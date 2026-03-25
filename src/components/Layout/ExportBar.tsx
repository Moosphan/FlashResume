import { useCallback, useRef, useState, useEffect } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { useUIStore } from '../../stores/uiStore';
import { useLocale } from '../../hooks/useLocale';
import { useIsMobile } from '../../hooks/useMediaQuery';
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

/** Hook for real export progress driven by onProgress callbacks from exportService */
function useExportProgress() {
  const [progress, setProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [label, setLabel] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const start = useCallback((text: string) => {
    setLabel(text);
    setProgress(0);
    setExporting(true);
  }, []);

  // Called by the export service at each real step
  const onProgress = useCallback((value: number) => {
    setProgress(value);
  }, []);

  const finish = useCallback(() => {
    setProgress(100);
    timeoutRef.current = setTimeout(() => {
      setExporting(false);
      setProgress(0);
      setLabel('');
    }, 600);
  }, []);

  const fail = useCallback(() => {
    setExporting(false);
    setProgress(0);
    setLabel('');
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { progress, exporting, label, start, onProgress, finish, fail };
}

export default function ExportBar({ previewRef }: ExportBarProps) {
  const resumeData = useResumeStore((s) => s.resumeData);
  const importFromJSON = useResumeStore((s) => s.importFromJSON);
  const addToast = useUIStore((s) => s.addToast);
  const { t } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { progress, exporting, label, start, onProgress, finish, fail } = useExportProgress();

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
    start(t.exportingPDF);
    try {
      const blob = await exportToPDF(previewRef.current, resumeData.personalInfo.name, onProgress);
      finish();
      downloadFile(blob, 'resume.pdf');
      addToast(t.exportSuccess, 'success');
    } catch (err) {
      console.error('[ExportBar] PDF export error:', err);
      fail();
      addToast(t.pdfFailed, 'error');
    }
  }, [previewRef, addToast, t, resumeData.personalInfo.name, start, onProgress, finish, fail]);

  const handleExportJSON = useCallback(() => {
    setOpen(false);
    try {
      const json = exportToJSON(resumeData);
      const blob = new Blob([json], { type: 'application/json' });
      downloadFile(blob, 'resume.json');
      addToast(t.exportSuccess, 'success');
    } catch {
      addToast(t.jsonExportFailed, 'error');
    }
  }, [resumeData, addToast, t]);

  const handleExportPNG = useCallback(async () => {
    setOpen(false);
    if (!previewRef.current) return;
    start(t.exportingPNG);
    try {
      const blob = await exportToPNG(previewRef.current, onProgress);
      finish();
      downloadFile(blob, 'resume.png');
      addToast(t.exportSuccess, 'success');
    } catch (err) {
      console.error('[ExportBar] PNG export error:', err);
      fail();
      addToast(t.pngFailed, 'error');
    }
  }, [previewRef, addToast, t, start, onProgress, finish, fail]);

  const handleExportJPG = useCallback(async () => {
    setOpen(false);
    if (!previewRef.current) return;
    start(t.exportingJPG);
    try {
      const blob = await exportToJPG(previewRef.current, onProgress);
      finish();
      downloadFile(blob, 'resume.jpg');
      addToast(t.exportSuccess, 'success');
    } catch (err) {
      console.error('[ExportBar] JPG export error:', err);
      fail();
      addToast(t.jpgFailed, 'error');
    }
  }, [previewRef, addToast, t, start, onProgress, finish, fail]);

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

  const isMobile = useIsMobile();

  const iconBtnCls = isMobile
    ? 'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors'
    : 'inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors';

  const itemCls = isMobile
    ? 'flex w-full items-center gap-2 px-3 py-2 min-h-[44px] text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
    : 'flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

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

      {/* Export dropdown with progress bar wrapper */}
      <div ref={menuRef} className="relative">
        {/* Progress bar container - rounded rect around the button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !exporting && setOpen((v) => !v)}
            className={`${iconBtnCls} ${exporting ? 'pointer-events-none' : ''}`}
            aria-label={t.exportMenu}
            aria-expanded={open}
            aria-haspopup="true"
            disabled={exporting}
          >
            {exporting ? (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
          </button>

          {/* Rounded-rect progress bar around the export button */}
          {exporting && (
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <svg className="w-full h-full" viewBox="0 0 40 40" preserveAspectRatio="none">
                {/* Background track */}
                <rect
                  x="1" y="1" width="38" height="38" rx="7" ry="7"
                  fill="none" stroke="currentColor"
                  className="text-gray-200 dark:text-gray-600"
                  strokeWidth="2"
                />
                {/* Progress stroke */}
                <rect
                  x="1" y="1" width="38" height="38" rx="7" ry="7"
                  fill="none" stroke="currentColor"
                  className="text-blue-500 dark:text-blue-400"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${(progress / 100) * 144} 144`}
                  style={{ transition: 'stroke-dasharray 0.3s ease-out' }}
                />
              </svg>
            </div>
          )}
        </div>

        {/* Progress label tooltip */}
        {exporting && label && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow dark:bg-gray-200 dark:text-gray-900 z-50">
            {label} {Math.round(progress)}%
          </div>
        )}

        {open && !exporting && (
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
