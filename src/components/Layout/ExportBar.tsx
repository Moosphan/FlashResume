import { useCallback, useRef } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { useUIStore } from '../../stores/uiStore';
import { exportToPDF, exportToJSON, downloadFile } from '../../services/exportService';
import { parseJSON } from '../../services/importService';

interface ExportBarProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Checks whether the resume has any meaningful content.
 * Returns true when there is nothing to export.
 */
function isResumeEmpty(data: ReturnType<typeof useResumeStore.getState>['resumeData']): boolean {
  const hasName = data.personalInfo.name.trim() !== '';
  const hasExperiences = data.experiences.length > 0;
  const hasEducations = data.educations.length > 0;
  const hasSkills = data.skills.length > 0;
  return !hasName && !hasExperiences && !hasEducations && !hasSkills;
}

/**
 * ExportBar - 导出工具栏
 *
 * - 导出 PDF：调用 exportToPDF 渲染预览面板并触发下载
 * - 导出 JSON：序列化 resumeData 并触发下载
 * - 导入 JSON：打开文件选择器，解析并导入简历数据
 * - 内容为空时禁用导出按钮
 */
export default function ExportBar({ previewRef }: ExportBarProps) {
  const resumeData = useResumeStore((s) => s.resumeData);
  const importFromJSON = useResumeStore((s) => s.importFromJSON);
  const addToast = useUIStore((s) => s.addToast);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const empty = isResumeEmpty(resumeData);

  const handleExportPDF = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      const blob = await exportToPDF(previewRef.current);
      downloadFile(blob, 'resume.pdf');
    } catch (err) {
      console.error('[ExportBar] PDF export failed:', err);
      addToast('PDF 生成失败，请重试', 'error');
    }
  }, [previewRef, addToast]);

  const handleExportJSON = useCallback(() => {
    try {
      const json = exportToJSON(resumeData);
      const blob = new Blob([json], { type: 'application/json' });
      downloadFile(blob, 'resume.json');
    } catch {
      addToast('JSON 导出失败，请重试', 'error');
    }
  }, [resumeData, addToast]);

  const handleImportClick = useCallback(() => {
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
          addToast('导入成功', 'success');
        } else if (result.error === 'invalid_json') {
          addToast('文件格式无效', 'error');
        } else if (result.error === 'missing_fields') {
          const details = result.details?.join('、') ?? '';
          addToast(`简历数据不完整：缺少 ${details}`, 'error');
        }
      };

      reader.onerror = () => {
        addToast('文件读取失败，请重试', 'error');
      };

      reader.readAsText(file);

      // Reset so the same file can be re-selected
      e.target.value = '';
    },
    [importFromJSON, addToast],
  );

  const btnBase =
    'inline-flex items-center justify-center min-w-[36px] min-h-[36px] px-3 py-1.5 rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';

  const btnPrimary = `${btnBase} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed`;
  const btnSecondary = `${btnBase} bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400`;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExportPDF}
        disabled={empty}
        className={btnPrimary}
        aria-label="导出 PDF"
      >
        导出 PDF
      </button>

      <button
        type="button"
        onClick={handleExportJSON}
        disabled={empty}
        className={btnPrimary}
        aria-label="导出 JSON"
      >
        导出 JSON
      </button>

      <button
        type="button"
        onClick={handleImportClick}
        className={btnSecondary}
        aria-label="导入 JSON"
      >
        导入 JSON
      </button>

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
