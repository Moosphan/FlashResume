import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveResume,
  loadResume,
  deleteResume,
  getResumeList,
  saveResumeList,
  getCurrentResumeId,
  setCurrentResumeId,
  getThemeMode,
  setThemeMode,
  clearAll,
  isStorageAvailable,
} from '../storageService';
import { DEFAULT_RESUME_DATA } from '../../types/resume';
import type { ResumeData, ResumeListItem } from '../../types/resume';

beforeEach(() => {
  localStorage.clear();
});

describe('isStorageAvailable', () => {
  it('returns true when localStorage is available', () => {
    expect(isStorageAvailable()).toBe(true);
  });
});

describe('saveResume / loadResume', () => {
  const testData: ResumeData = {
    ...DEFAULT_RESUME_DATA,
    personalInfo: {
      ...DEFAULT_RESUME_DATA.personalInfo,
      name: 'Test User',
      email: 'test@example.com',
    },
    metadata: {
      ...DEFAULT_RESUME_DATA.metadata,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  };

  it('saves and loads resume data correctly', () => {
    saveResume('r1', testData);
    const loaded = loadResume('r1');
    expect(loaded).toEqual(testData);
  });

  it('returns null for non-existent resume', () => {
    expect(loadResume('non-existent')).toBeNull();
  });

  it('handles corrupted data gracefully', () => {
    localStorage.setItem('resume_builder_data_bad', '{invalid json');
    expect(loadResume('bad')).toBeNull();
  });
});

describe('deleteResume', () => {
  it('removes resume data from storage', () => {
    saveResume('r1', DEFAULT_RESUME_DATA);
    expect(loadResume('r1')).not.toBeNull();
    deleteResume('r1');
    expect(loadResume('r1')).toBeNull();
  });

  it('does not throw when deleting non-existent resume', () => {
    expect(() => deleteResume('non-existent')).not.toThrow();
  });
});

describe('getResumeList / saveResumeList', () => {
  const list: ResumeListItem[] = [
    { id: 'r1', name: 'Resume 1', updatedAt: '2024-01-01T00:00:00Z' },
    { id: 'r2', name: 'Resume 2', updatedAt: '2024-01-02T00:00:00Z' },
  ];

  it('returns empty array when no list saved', () => {
    expect(getResumeList()).toEqual([]);
  });

  it('saves and retrieves resume list', () => {
    saveResumeList(list);
    expect(getResumeList()).toEqual(list);
  });

  it('handles corrupted list data gracefully', () => {
    localStorage.setItem('resume_builder_list', 'not-json');
    expect(getResumeList()).toEqual([]);
  });
});

describe('getCurrentResumeId / setCurrentResumeId', () => {
  it('returns null when no current ID set', () => {
    expect(getCurrentResumeId()).toBeNull();
  });

  it('saves and retrieves current resume ID', () => {
    setCurrentResumeId('r1');
    expect(getCurrentResumeId()).toBe('r1');
  });
});

describe('getThemeMode / setThemeMode', () => {
  it('defaults to light when no theme set', () => {
    expect(getThemeMode()).toBe('light');
  });

  it('saves and retrieves dark mode', () => {
    setThemeMode('dark');
    expect(getThemeMode()).toBe('dark');
  });

  it('saves and retrieves light mode', () => {
    setThemeMode('light');
    expect(getThemeMode()).toBe('light');
  });

  it('defaults to light for invalid stored value', () => {
    localStorage.setItem('resume_builder_theme_mode', 'invalid');
    expect(getThemeMode()).toBe('light');
  });
});

describe('clearAll', () => {
  it('removes all resume_builder_ prefixed keys', () => {
    saveResume('r1', DEFAULT_RESUME_DATA);
    saveResumeList([{ id: 'r1', name: 'Test', updatedAt: '' }]);
    setCurrentResumeId('r1');
    setThemeMode('dark');

    // Add a non-prefixed key to ensure it's not removed
    localStorage.setItem('other_key', 'value');

    clearAll();

    expect(loadResume('r1')).toBeNull();
    expect(getResumeList()).toEqual([]);
    expect(getCurrentResumeId()).toBeNull();
    expect(getThemeMode()).toBe('light');
    expect(localStorage.getItem('other_key')).toBe('value');
  });

  it('does not throw when storage is empty', () => {
    expect(() => clearAll()).not.toThrow();
  });
});
