import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { useLocale } from '../../hooks/useLocale';
import { getDefaultSectionTitle, getSectionTitle } from '../../utils/sectionTitles';
import type { StandardSectionId } from '../../types/resume';

interface EditableSectionTitleProps {
  sectionId: StandardSectionId;
  className?: string;
}

export default function EditableSectionTitle({
  sectionId,
  className = 'text-lg font-semibold text-gray-800 dark:text-gray-100',
}: EditableSectionTitleProps) {
  const resumeData = useResumeStore((state) => state.resumeData);
  const updateSectionTitle = useResumeStore((state) => state.updateSectionTitle);
  const { t } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const displayTitle = getSectionTitle(resumeData, t, sectionId);
  const defaultTitle = getDefaultSectionTitle(t, sectionId);
  const [draft, setDraft] = useState(displayTitle);

  useEffect(() => {
    if (!isEditing) {
      setDraft(displayTitle);
    }
  }, [displayTitle, isEditing]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const commit = () => {
    const trimmed = draft.trim();
    updateSectionTitle(sectionId, trimmed && trimmed !== defaultTitle ? trimmed : '');
    setIsEditing(false);
  };

  const cancel = () => {
    setDraft(displayTitle);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit();
          if (event.key === 'Escape') cancel();
        }}
        className={`w-full rounded-md border border-blue-300 bg-white px-2 py-1 outline-none ring-2 ring-blue-100 dark:border-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:ring-blue-900/40 ${className}`}
        aria-label={`${displayTitle} 标题`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className={`cursor-text rounded-md px-2 py-1 -mx-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
      aria-label={`编辑${displayTitle}标题`}
    >
      {displayTitle}
    </button>
  );
}
