import { useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { useResumeStore } from '../stores/resumeStore';
import { useUIStore } from '../stores/uiStore';
import * as storage from '../services/storageService';

/**
 * useAutoSave - 自动保存 Hook
 * 监听简历数据变更，防抖 2 秒后自动保存到 localStorage
 */
export function useAutoSave(): void {
  const resumeData = useResumeStore((s) => s.resumeData);
  const currentResumeId = useResumeStore((s) => s.currentResumeId);
  const setAutoSaveStatus = useUIStore((s) => s.setAutoSaveStatus);

  const debouncedData = useDebounce(resumeData, 2000);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the first render to avoid saving on mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (currentResumeId === null) return;

    storage.saveResume(currentResumeId, debouncedData);

    // Update the resumeList item's updatedAt timestamp
    // Read resumeList directly from store to avoid it being a reactive dependency
    const resumeList = useResumeStore.getState().resumeList;
    const now = new Date().toISOString();
    const updatedList = resumeList.map((item) =>
      item.id === currentResumeId ? { ...item, updatedAt: now } : item,
    );
    storage.saveResumeList(updatedList);
    useResumeStore.setState({ resumeList: updatedList });

    setAutoSaveStatus('saved');
  }, [debouncedData, currentResumeId, setAutoSaveStatus]);
}
