import { useCallback, useRef, useState, useEffect } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { useUIStore } from '../../stores/uiStore';
import { useLocale } from '../../hooks/useLocale';
import {
  exportToPDF,
  exportToJSON,
  exportToPNG,
  exportToJPG,
  downloadFile,
} from '../../services/exportService';
import { parseJSON } from '../../services/importService';

interface ExportBarProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
}

function isResumeEmpty(data: ReturnType<typeof useResumeStore.getState>['resumeData']): boolean {
  const hasName = data.personalInfo.name.trim() !== '';
  const hasExperiences = data.experiences.length > 0;
  const hasEducations = data.educations.length > 0;
  const hasSkills = data.skills.length > 0;
  return !hasName && !hasExperiences && !hasEducations && !hasSkills;
}

export default function ExportBar({ previewRef }: ExportBarProps) {
  const resumeData = useResumeStore((s) => s.resumeData);
  const importFromJSON = useResumeStore((s) => s.importFromJSON);
  const addToast = useUIStore((s) => s.addToast);
  const { t } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const empty = isResumeEmpty(resumeData);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleExportPDF = useCallback(async () => {
    setOpen(false);
    if (!previewRef.current) return;
    try {
      const blob = await exportToPDF(previewRef.current);
      downloadFile(blob, 'resume.pdf');
    } catch {
      addToast(t.pdfFailed, 'error');
    }
  }, [previewRef, addToast, t]);

  const handleExportJSON = useCallback(() => {
    setOpen(false);
    try {
      const json = exportToJSON(resumeData);
      const blob = new Blob([json], { type: 'application/json' });
      downloadFile(blob, 'resume.json');
    } catch {
      addToast(t.jsonExportFailed, 'error');
    }
  }, [resumeData, addToast, t]);

  const handleExportPNG = useCallback(async () => {
    setOpen(false);
    if (!previewRef.current) return;
    try {
      const blob = await exportToPNG(previewRef.current);
      downloadFile(blob, 'resume.png');
    } catch {
      addToast(t.pngFailed, 'error');
    }
  }, [previewRef, addToast, t]);

  const handleExportJPG = useCallback(async () => {
    setOpen(false);
    if (!previewRef.current) return;
    try {
      const blob = await exportToJPG(previewRef.current);
      downloadFile(blob, 'resume.jpg');
    } catch {
      addToast(t.jpgFailed, 'error');
    }
  }, [previewRef, addToast, t]);

  const handleImportClick = useCallback(() => {
    setOpen(false);
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        const result = parseJSON(content);
        if (result.success) {
          importFromJSON(content);
          addToast(t.importSuccess, 'success');
        } else if (result.error === 'invalid_json') {
          addToast(t.invalidFile, 'error');
        } else if (result.error === 'missing_fields') {
          const details = result.details?.join('、') ?? '';
          addToast(t.incompleteData(details), 'error');
        }
      };
      reader.onerror = () => addToast(t.fileReadFailed, 'error');
      reader.readAsText(file);
      e.target.value = '';
    },
    [importFromJSON, addToast, t],
  );

  const iconBtnCls =
    'inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors';

  const itemCls =
    'flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="flex items-center gap-1">
      {/* Import JSON standalone button */}
      <button
        type="button"
        onClick={handleImportClick}
        className={iconBtnCls}
        aria-label={t.importJSON}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </button>

      {/* Export dropdown */}
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={iconBtnCls}
          aria-label={t.exportMenu}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800 z-50 animate-fade-in">
            <button type="button" onClick={handleExportPDF} disabled={empty} className={itemCls}>
              <span className="w-5 text-center text-xs">📄</span> {t.exportPDF}
            </button>
            <button type="button" onClick={handleExportPNG} disabled={empty} className={itemCls}>
              <span className="w-5 text-center text-xs">🖼️</span> {t.exportPNG}
            </button>
            <button type="button" onClick={handleExportJPG} disabled={empty} className={itemCls}>
              <span className="w-5 text-center text-xs">🖼️</span> {t.exportJPG}
            </button>
            <button type="button" onClick={handleExportJSON} disabled={empty} className={itemCls}>
              <span className="w-5 text-center text-xs">📋</span> {t.exportJSON}
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
