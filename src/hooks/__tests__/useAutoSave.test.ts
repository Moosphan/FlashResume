import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutoSave } from '../useAutoSave';
import { useResumeStore } from '../../stores/resumeStore';
import { useUIStore } from '../../stores/uiStore';
import { DEFAULT_RESUME_DATA } from '../../types/resume';

// Mock storageService
vi.mock('../../services/storageService', () => ({
  saveResume: vi.fn(),
  loadResume: vi.fn(),
  deleteResume: vi.fn(),
  getResumeList: vi.fn(() => []),
  saveResumeList: vi.fn(),
  clearAll: vi.fn(),
  getCurrentResumeId: vi.fn(() => null),
  setCurrentResumeId: vi.fn(),
  getThemeMode: vi.fn(() => 'light'),
  setThemeMode: vi.fn(),
  isStorageAvailable: vi.fn(() => true),
}));

import * as storage from '../../services/storageService';

const mockedSaveResume = vi.mocked(storage.saveResume);
const mockedSaveResumeList = vi.mocked(storage.saveResumeList);

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Reset stores
    const now = new Date().toISOString();
    useResumeStore.setState({
      currentResumeId: null,
      resumeData: {
        ...DEFAULT_RESUME_DATA,
        personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo },
        experiences: [],
        educations: [],
        skills: [],
        customSections: [],
        sectionOrder: [...DEFAULT_RESUME_DATA.sectionOrder],
        metadata: { ...DEFAULT_RESUME_DATA.metadata, createdAt: now, updatedAt: now },
      },
      resumeList: [],
    });

    useUIStore.setState({
      autoSaveStatus: 'idle',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not save when currentResumeId is null', () => {
    renderHook(() => useAutoSave());

    // Trigger a data change
    act(() => {
      useResumeStore.getState().updatePersonalInfo({ name: 'Test' });
    });

    // Advance past debounce
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(mockedSaveResume).not.toHaveBeenCalled();
  });

  it('saves to localStorage after 2-second debounce when data changes', () => {
    const resumeId = 'test-resume-1';
    useResumeStore.setState({
      currentResumeId: resumeId,
      resumeList: [{ id: resumeId, name: 'Test', updatedAt: new Date().toISOString() }],
    });

    renderHook(() => useAutoSave());

    // Trigger a data change
    act(() => {
      useResumeStore.getState().updatePersonalInfo({ name: 'John' });
    });

    // Before debounce completes, nothing saved
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(mockedSaveResume).not.toHaveBeenCalled();

    // After debounce completes
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(mockedSaveResume).toHaveBeenCalledWith(resumeId, expect.any(Object));
  });

  it('updates autoSaveStatus to saved after saving', () => {
    const resumeId = 'test-resume-2';
    useResumeStore.setState({
      currentResumeId: resumeId,
      resumeList: [{ id: resumeId, name: 'Test', updatedAt: new Date().toISOString() }],
    });

    renderHook(() => useAutoSave());

    act(() => {
      useResumeStore.getState().updatePersonalInfo({ email: 'test@example.com' });
    });

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(useUIStore.getState().autoSaveStatus).toBe('saved');
  });

  it('updates resumeList updatedAt timestamp after saving', () => {
    const resumeId = 'test-resume-3';
    const oldDate = '2020-01-01T00:00:00.000Z';
    useResumeStore.setState({
      currentResumeId: resumeId,
      resumeList: [{ id: resumeId, name: 'Test', updatedAt: oldDate }],
    });

    renderHook(() => useAutoSave());

    act(() => {
      useResumeStore.getState().updatePersonalInfo({ phone: '123' });
    });

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(mockedSaveResumeList).toHaveBeenCalled();
    const savedList = mockedSaveResumeList.mock.calls[0][0];
    expect(savedList[0].id).toBe(resumeId);
    expect(savedList[0].updatedAt).not.toBe(oldDate);
  });

  it('does not save on initial mount', () => {
    const resumeId = 'test-resume-4';
    useResumeStore.setState({
      currentResumeId: resumeId,
      resumeList: [{ id: resumeId, name: 'Test', updatedAt: new Date().toISOString() }],
    });

    renderHook(() => useAutoSave());

    // Advance past debounce without any data change
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(mockedSaveResume).not.toHaveBeenCalled();
  });
});
