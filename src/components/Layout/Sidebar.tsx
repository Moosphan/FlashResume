import { useCallback, useRef, useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { useLocale } from '../../hooks/useLocale';
import ConfirmDialog from '../UI/ConfirmDialog';

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const resumeList = useResumeStore((s) => s.resumeList);
  const currentResumeId = useResumeStore((s) => s.currentResumeId);
  const createResume = useResumeStore((s) => s.createResume);
  const loadResume = useResumeStore((s) => s.loadResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);
  const { locale, t } = useLocale();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateClick = useCallback(() => {
    setShowCreateInput(true);
    setNewName('');
    setNameError('');
    // 等 DOM 渲染后聚焦
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleCreateConfirm = useCallback(() => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setNameError(t.resumeNameRequired);
      inputRef.current?.focus();
      return;
    }
    createResume(trimmed);
    setShowCreateInput(false);
    setNewName('');
    setNameError('');
  }, [newName, createResume, t]);

  const handleCreateCancel = useCallback(() => {
    setShowCreateInput(false);
    setNewName('');
    setNameError('');
  }, []);

  const handleCreateKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateConfirm();
    if (e.key === 'Escape') handleCreateCancel();
  }, [handleCreateConfirm, handleCreateCancel]);

  const handleDelete = () => {
    if (deleteTarget) { deleteResume(deleteTarget); setDeleteTarget(null); }
  };

  const handleSelect = (id: string) => { loadResume(id); onClose(); };

  const deleteName = resumeList.find((r) => r.id === deleteTarget)?.name ?? '';

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside data-testid="sidebar" className={`fixed inset-y-0 left-0 z-40 flex w-48 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 transition-transform duration-200 lg:static lg:translate-x-0 lg:z-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.myResumes}</h2>
          <button type="button" onClick={onClose} className="flex h-[44px] w-[44px] items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden" aria-label={t.closeSidebar}>✕</button>
        </div>
        <div className="px-3 py-2">
          {showCreateInput ? (
            <div className="space-y-1">
              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); if (nameError) setNameError(''); }}
                onKeyDown={handleCreateKeyDown}
                placeholder={t.promptResumeName}
                className={`min-h-[44px] w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 ${
                  nameError
                    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600'
                }`}
              />
              {nameError && (
                <p className="text-xs text-red-500">{nameError}</p>
              )}
              <div className="flex gap-1">
                <button type="button" onClick={handleCreateConfirm} className="flex-1 min-h-[44px] rounded-md bg-blue-600 text-xs font-medium text-white hover:bg-blue-700 transition-colors">{t.confirm}</button>
                <button type="button" onClick={handleCreateCancel} className="flex-1 min-h-[44px] rounded-md border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">{t.cancel}</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={handleCreateClick} className="flex min-h-[44px] w-full items-center justify-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">{t.newResume}</button>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-1" aria-label={t.myResumes}>
          {resumeList.length === 0 && <p className="px-2 py-4 text-center text-xs text-gray-400 dark:text-gray-500">{t.noResumes}</p>}
          {resumeList.map((item) => (
            <div key={item.id} role="button" tabIndex={0} onClick={() => handleSelect(item.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(item.id); } }}
              className={`group mb-1 flex min-h-[44px] cursor-pointer items-center justify-between rounded-md px-3 py-2 transition-colors ${item.id === currentResumeId ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              aria-current={item.id === currentResumeId ? 'true' : undefined}>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="truncate text-xs text-gray-400 dark:text-gray-500">{formatDate(item.updatedAt, locale)}</p>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteTarget(item.id); }}
                className="ml-2 flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 focus:opacity-100"
                aria-label={`${t.deleteResume} ${item.name}`}>🗑</button>
            </div>
          ))}
        </nav>
      </aside>
      <ConfirmDialog open={deleteTarget !== null} title={t.deleteConfirmTitle} message={t.deleteConfirmMsg(deleteName)} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </>
  );
}

function formatDate(iso: string, locale: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
  } catch { return iso; }
}
