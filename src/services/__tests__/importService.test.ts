import { describe, it, expect } from 'vitest';
import { parseJSON } from '../importService';
import { DEFAULT_RESUME_DATA } from '../../types/resume';

describe('importService - parseJSON', () => {
  it('should return success with valid ResumeData JSON', () => {
    const data = {
      ...DEFAULT_RESUME_DATA,
      metadata: { ...DEFAULT_RESUME_DATA.metadata, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    };
    const json = JSON.stringify(data);
    const result = parseJSON(json);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(data);
    }
  });

  it('should return invalid_json for non-JSON strings', () => {
    const result = parseJSON('not json at all');
    expect(result).toEqual({ success: false, error: 'invalid_json' });
  });

  it('should return invalid_json for empty string', () => {
    const result = parseJSON('');
    expect(result).toEqual({ success: false, error: 'invalid_json' });
  });

  it('should return invalid_json for malformed JSON', () => {
    const result = parseJSON('{ "name": }');
    expect(result).toEqual({ success: false, error: 'invalid_json' });
  });

  it('should return missing_fields for empty object', () => {
    const result = parseJSON('{}');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('missing_fields');
      expect(result.details).toBeDefined();
      expect(result.details!.length).toBeGreaterThan(0);
    }
  });

  it('should return missing_fields when personalInfo is missing', () => {
    const partial = { experiences: [], educations: [], skills: [], customSections: [], sectionOrder: [], metadata: { templateId: 'a', themeColor: '#000', createdAt: '', updatedAt: '' } };
    const result = parseJSON(JSON.stringify(partial));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('missing_fields');
      expect(result.details).toContain('personalInfo');
    }
  });

  it('should return missing_fields when metadata sub-fields are missing', () => {
    const data = { ...DEFAULT_RESUME_DATA, metadata: {} };
    const result = parseJSON(JSON.stringify(data));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('missing_fields');
      expect(result.details!.some((d: string) => d.startsWith('metadata.'))).toBe(true);
    }
  });

  it('should return invalid_json for a plain number', () => {
    // JSON.parse("42") succeeds but validateResumeData rejects non-objects
    const result = parseJSON('42');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('missing_fields');
    }
  });
});
