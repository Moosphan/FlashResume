import { describe, expect, it } from 'vitest';
import { getPathnameLocale } from '../i18n';

describe('getPathnameLocale', () => {
  it('detects zh locale from the localized path', () => {
    expect(getPathnameLocale('/FlashResume/zh/')).toBe('zh');
    expect(getPathnameLocale('/FlashResume/zh')).toBe('zh');
  });

  it('returns null for the default path', () => {
    expect(getPathnameLocale('/FlashResume/')).toBeNull();
    expect(getPathnameLocale('/FlashResume/anything-else')).toBeNull();
  });
});
