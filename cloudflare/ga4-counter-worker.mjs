const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: buildCorsHeaders(request, env) });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/stats') {
      return json({ error: 'Not found' }, 404, buildCorsHeaders(request, env));
    }

    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    try {
      const [totalViews, activeUsers] = await Promise.all([
        fetchTotalViews(env),
        fetchActiveUsers(env),
      ]);

      const response = json(
        {
          totalViews,
          activeUsers,
          updatedAt: new Date().toISOString(),
        },
        200,
        {
          ...buildCorsHeaders(request, env),
          'Cache-Control': `public, max-age=${getCacheTtl(env)}`,
        },
      );

      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (error) {
      console.error('GA4 counter worker error', error);
      return json(
        { error: 'Failed to fetch GA4 statistics' },
        500,
        buildCorsHeaders(request, env),
      );
    }
  },
};

async function fetchTotalViews(env) {
  const accessToken = await getAccessToken(env);
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${env.GA4_PROPERTY_ID}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [
          {
            startDate: env.GA4_START_DATE || '2024-01-01',
            endDate: 'today',
          },
        ],
        metrics: [{ name: 'screenPageViews' }],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`runReport failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  return Number(payload.rows?.[0]?.metricValues?.[0]?.value ?? 0);
}

async function fetchActiveUsers(env) {
  const accessToken = await getAccessToken(env);
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${env.GA4_PROPERTY_ID}:runRealtimeReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metrics: [{ name: 'activeUsers' }],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`runRealtimeReport failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  return Number(payload.rows?.[0]?.metricValues?.[0]?.value ?? 0);
}

async function getAccessToken(env) {
  validateEnv(env);

  const now = Math.floor(Date.now() / 1000);
  const jwt = await signJwt(
    {
      alg: 'RS256',
      typ: 'JWT',
    },
    {
      iss: env.GA4_SERVICE_ACCOUNT_EMAIL,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    },
    env.GA4_SERVICE_ACCOUNT_PRIVATE_KEY,
  );

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`OAuth token failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
  }

  const tokenPayload = await tokenResponse.json();
  return tokenPayload.access_token;
}

async function signJwt(header, payload, privateKeyPem) {
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    await importPrivateKey(privateKeyPem),
    new TextEncoder().encode(signingInput),
  );
  return `${signingInput}.${base64UrlEncode(signature)}`;
}

async function importPrivateKey(pem) {
  const pkcs8 = pemToArrayBuffer(pem);
  return crypto.subtle.importKey(
    'pkcs8',
    pkcs8,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  );
}

function pemToArrayBuffer(pem) {
  const base64 = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\\n/g, '\n')
    .replace(/\n/g, '')
    .trim();
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function base64UrlEncode(input) {
  const bytes = typeof input === 'string'
    ? new TextEncoder().encode(input)
    : new Uint8Array(input);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function getCacheTtl(env) {
  const ttl = Number(env.COUNTER_CACHE_TTL ?? 60);
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
}

function buildCorsHeaders(request, env) {
  const requestOrigin = request.headers.get('Origin') ?? '*';
  const allowedOrigin = env.ALLOWED_ORIGIN?.trim();
  return {
    ...corsHeaders,
    'Access-Control-Allow-Origin': allowedOrigin || requestOrigin,
  };
}

function json(payload, status, headers) {
  return new Response(JSON.stringify(payload), {
    status,
    headers,
  });
}

function validateEnv(env) {
  const required = [
    'GA4_PROPERTY_ID',
    'GA4_SERVICE_ACCOUNT_EMAIL',
    'GA4_SERVICE_ACCOUNT_PRIVATE_KEY',
  ];
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required env: ${key}`);
    }
  }
}
