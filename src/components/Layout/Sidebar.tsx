import { useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import ConfirmDialog from '../UI/ConfirmDialog';

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const resumeList = useResumeStore((s) => s.resumeList);
  const currentResumeId = useResumeStore((s) => s.currentResumeId);
  const createResume = useResumeStore((s) => s.createResume);
  const loadResume = useResumeStore((s) => s.loadResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleCreate = () => {
    const name = window.prompt('请输入简历名称');
    if (name?.trim()) {
      createResume(name.trim());
    }
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteResume(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleSelect = (id: string) => {
    loadResume(id);
    onClose();
  };

  const deleteName =
    resumeList.find((r) => r.id === deleteTarget)?.name ?? '';

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        data-testid="sidebar"
        className={`
          fixed inset-y-0 left-0 z-40 flex w-48 flex-col border-r border-gray-200 bg-white
          dark:border-gray-700 dark:bg-gray-800 transition-transform duration-200
          lg:static lg:translate-x-0 lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            我的简历
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[44px] w-[44px] items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
            aria-label="关闭侧边栏"
          >
            ✕
          </button>
        </div>

        {/* Create button */}
        <div className="px-3 py-2">
          <button
            type="button"
            onClick={handleCreate}
            className="flex min-h-[44px] w-full items-center justify-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + 新建简历
          </button>
        </div>

        {/* Resume list */}
        <nav className="flex-1 overflow-y-auto px-2 py-1" aria-label="简历列表">
          {resumeList.length === 0 && (
            <p className="px-2 py-4 text-center text-xs text-gray-400 dark:text-gray-500">
              暂无简历，点击上方按钮创建
            </p>
          )}
          {resumeList.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(item.id);
                }
              }}
              className={`group mb-1 flex min-h-[44px] cursor-pointer items-center justify-between rounded-md px-3 py-2 transition-colors ${
                item.id === currentResumeId
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              aria-current={item.id === currentResumeId ? 'true' : undefined}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(item.updatedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(item.id);
                }}
                className="ml-2 flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 focus:opacity-100"
                aria-label={`删除简历 ${item.name}`}
              >
                🗑
              </button>
            </div>
          ))}
        </nav>
      </aside>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="删除简历"
        message={`确定要删除简历「${deleteName}」吗？此操作不可撤销。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
}
