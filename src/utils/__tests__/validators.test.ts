import { describe, it, expect } from 'vitest';
import {
  isEmptyString,
  generateId,
  formatDate,
  validateEmail,
  validatePhone,
  validateDateRange,
  validateResumeData,
} from '../validators';

describe('isEmptyString', () => {
  it('returns true for empty string', () => {
    expect(isEmptyString('')).toBe(true);
  });

  it('returns true for whitespace-only string', () => {
    expect(isEmptyString('   ')).toBe(true);
    expect(isEmptyString('\t\n')).toBe(true);
  });

  it('returns false for non-empty string', () => {
    expect(isEmptyString('hello')).toBe(false);
  });

  it('returns false for string with leading/trailing spaces', () => {
    expect(isEmptyString('  hello  ')).toBe(false);
  });
});

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateId()));
    expect(ids.size).toBe(50);
  });

  it('contains a dash separator', () => {
    const id = generateId();
    expect(id).toContain('-');
  });
});

describe('formatDate', () => {
  it('formats YYYY-MM to Chinese date format', () => {
    expect(formatDate('2023-01')).toBe('2023年01月');
    expect(formatDate('2024-12')).toBe('2024年12月');
  });

  it('returns "至今" for empty string', () => {
    expect(formatDate('')).toBe('至今');
  });

  it('returns original string for unexpected format', () => {
    expect(formatDate('2023')).toBe('2023');
  });
});

// Verify re-exports work correctly
describe('re-exports from validationService', () => {
  it('re-exports validateEmail', () => {
    expect(typeof validateEmail).toBe('function');
    expect(validateEmail('test@example.com').valid).toBe(true);
  });

  it('re-exports validatePhone', () => {
    expect(typeof validatePhone).toBe('function');
    expect(validatePhone('123456').valid).toBe(true);
  });

  it('re-exports validateDateRange', () => {
    expect(typeof validateDateRange).toBe('function');
    expect(validateDateRange('2023-01', '2023-06').valid).toBe(true);
  });

  it('re-exports validateResumeData', () => {
    expect(typeof validateResumeData).toBe('function');
  });
});
