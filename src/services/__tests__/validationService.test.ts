import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePhone,
  validateDateRange,
  validateResumeData,
} from '../validationService';
import { DEFAULT_RESUME_DATA } from '../../types/resume';

describe('validateEmail', () => {
  it('returns valid for standard email', () => {
    expect(validateEmail('user@example.com')).toEqual({ valid: true });
  });

  it('returns valid for email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toEqual({ valid: true });
  });

  it('returns invalid for empty string', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns invalid for missing @', () => {
    const result = validateEmail('userexample.com');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for missing domain', () => {
    const result = validateEmail('user@');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for missing TLD', () => {
    const result = validateEmail('user@example');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for spaces in email', () => {
    const result = validateEmail('user @example.com');
    expect(result.valid).toBe(false);
  });
});

describe('validatePhone', () => {
  it('returns valid for digits only', () => {
    expect(validatePhone('1234567890')).toEqual({ valid: true });
  });

  it('returns valid for phone with + prefix', () => {
    expect(validatePhone('+8613800138000')).toEqual({ valid: true });
  });

  it('returns valid for phone with dashes', () => {
    expect(validatePhone('010-12345678')).toEqual({ valid: true });
  });

  it('returns valid for phone with + and dashes', () => {
    expect(validatePhone('+86-138-0013-8000')).toEqual({ valid: true });
  });

  it('returns invalid for empty string', () => {
    const result = validatePhone('');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for letters', () => {
    const result = validatePhone('123abc');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for spaces', () => {
    const result = validatePhone('123 456');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for special characters', () => {
    const result = validatePhone('123#456');
    expect(result.valid).toBe(false);
  });
});

describe('validateDateRange', () => {
  it('returns valid when end is after start', () => {
    expect(validateDateRange('2023-01', '2023-06')).toEqual({ valid: true });
  });

  it('returns valid when end equals start', () => {
    expect(validateDateRange('2023-01', '2023-01')).toEqual({ valid: true });
  });

  it('returns valid when end is empty (present)', () => {
    expect(validateDateRange('2023-01', '')).toEqual({ valid: true });
  });

  it('returns invalid when end is before start', () => {
    const result = validateDateRange('2023-06', '2023-01');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns invalid when start is empty', () => {
    const result = validateDateRange('', '2023-06');
    expect(result.valid).toBe(false);
  });
});

describe('validateResumeData', () => {
  it('returns valid for complete DEFAULT_RESUME_DATA', () => {
    const result = validateResumeData(DEFAULT_RESUME_DATA);
    expect(result.valid).toBe(true);
    expect(result.missingFields).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it('returns invalid for null', () => {
    const result = validateResumeData(null);
    expect(result.valid).toBe(false);
    expect(result.missingFields.length).toBeGreaterThan(0);
  });

  it('returns invalid for undefined', () => {
    const result = validateResumeData(undefined);
    expect(result.valid).toBe(false);
  });

  it('returns invalid for non-object', () => {
    const result = validateResumeData('string');
    expect(result.valid).toBe(false);
  });

  it('returns missing fields for empty object', () => {
    const result = validateResumeData({});
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('personalInfo');
    expect(result.missingFields).toContain('experiences');
    expect(result.missingFields).toContain('metadata');
  });

  it('detects missing personalInfo sub-fields', () => {
    const data = {
      ...DEFAULT_RESUME_DATA,
      personalInfo: { name: 'Test' },
    };
    const result = validateResumeData(data);
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('personalInfo.email');
    expect(result.missingFields).toContain('personalInfo.phone');
  });

  it('detects non-array fields', () => {
    const data = {
      ...DEFAULT_RESUME_DATA,
      experiences: 'not-an-array',
    };
    const result = validateResumeData(data);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('experiences'))).toBe(true);
  });

  it('detects missing metadata sub-fields', () => {
    const data = {
      ...DEFAULT_RESUME_DATA,
      metadata: { templateId: 'classic' },
    };
    const result = validateResumeData(data);
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('metadata.themeColor');
  });
});
