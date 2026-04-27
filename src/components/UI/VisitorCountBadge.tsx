import { useEffect, useMemo, useState } from 'react';
import { useLocale } from '../../hooks/useLocale';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface VisitorStats {
  totalViews: number;
  activeUsers: number;
  updatedAt: string;
}

const apiUrl = import.meta.env.VITE_VISITOR_COUNT_API_URL?.trim();
const refreshIntervalMs = 60_000;

export default function VisitorCountBadge() {
  const { locale } = useLocale();
  const isMobile = useIsMobile();
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(Boolean(apiUrl));

  useEffect(() => {
    if (!apiUrl) return;

    let disposed = false;

    const loadStats = async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error(`Visitor API returned ${response.status}`);
        }
        const payload = await response.json() as Partial<VisitorStats>;
        if (disposed) return;
        setStats({
          totalViews: Number(payload.totalViews ?? 0),
          activeUsers: Number(payload.activeUsers ?? 0),
          updatedAt: String(payload.updatedAt ?? new Date().toISOString()),
        });
      } catch (error) {
        console.warn('[VisitorCountBadge] Failed to load visitor stats:', error);
      } finally {
        if (!disposed) setLoading(false);
      }
    };

    void loadStats();
    const timer = window.setInterval(() => {
      void loadStats();
    }, refreshIntervalMs);

    return () => {
      disposed = true;
      window.clearInterval(timer);
    };
  }, []);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US'),
    [locale],
  );

  if (!apiUrl || (!stats && !loading)) {
    return null;
  }

  const labels = locale === 'zh'
    ? { total: '访问', live: '在线', loading: '统计加载中…' }
    : { total: 'Visits', live: 'Live', loading: 'Loading stats…' };

  return (
    <div
      className={`pointer-events-none fixed left-3 z-40 rounded-full border border-gray-200/70 bg-white/90 px-3 py-2 text-xs text-gray-700 shadow-lg backdrop-blur-sm dark:border-gray-700/70 dark:bg-gray-900/90 dark:text-gray-200 ${
        isMobile
          ? 'bottom-[calc(var(--mobile-tab-height)+var(--safe-area-bottom)+12px)]'
          : 'bottom-3'
      }`}
      aria-live="polite"
    >
      {stats ? (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span>{labels.total} {numberFormatter.format(stats.totalViews)}</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {labels.live} {numberFormatter.format(stats.activeUsers)}
          </span>
        </div>
      ) : (
        <span className="whitespace-nowrap">{labels.loading}</span>
      )}
    </div>
  );
}
