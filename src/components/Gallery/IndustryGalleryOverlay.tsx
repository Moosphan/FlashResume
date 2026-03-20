import { useState, useEffect, useCallback } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useResumeStore } from '../../stores/resumeStore';
import { useLocale } from '../../hooks/useLocale';
import { templateRegistry } from '../../services/templateRegistry';
import { filterTemplatesByIndustry, getTemplateCountByIndustry } from './galleryUtils';
import FilterPanel from './FilterPanel';
import TemplateGrid from './TemplateGrid';

export default function IndustryGalleryOverlay() {
  const galleryOpen = useUIStore((s) => s.galleryOpen);
  const { locale, t } = useLocale();
  const resumeData = useResumeStore((s) => s.resumeData);
  const themeColor = useResumeStore((s) => s.themeColor);
  const currentTemplateId = useResumeStore((s) => s.selectedTemplateId);

  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setSelectedIndustry(null);
    useUIStore.getState().closeGallery();
  }, []);

  useEffect(() => {
    if (!galleryOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [galleryOpen, handleClose]);

  if (!galleryOpen) return null;

  const allTemplates = templateRegistry.getAll();
  const filtered = filterTemplatesByIndustry(allTemplates, selectedIndustry);
  const countByIndustry = getTemplateCountByIndustry(allTemplates);

  const handleSelectTemplate = (templateId: string) => {
    useResumeStore.getState().setTemplate(templateId);
    useUIStore.getState().closeGallery();
    useUIStore.getState().addToast(t.templateSwitched, 'success');
    setSelectedIndustry(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111827' }}>
          {t.galleryTitle}
        </h2>
        <button
          onClick={handleClose}
          aria-label={t.closeGallery}
          style={{
            background: 'none',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            padding: '6px 16px',
            fontSize: 14,
            cursor: 'pointer',
            color: '#374151',
          }}
        >
          {t.closeGallery}
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
        <FilterPanel
          selectedIndustry={selectedIndustry}
          onSelect={setSelectedIndustry}
          templateCountByIndustry={countByIndustry}
          language={locale}
        />
        <TemplateGrid
          templates={filtered}
          currentTemplateId={currentTemplateId}
          onSelectTemplate={handleSelectTemplate}
          resumeData={resumeData}
          themeColor={themeColor}
          language={locale}
        />
      </div>
    </div>
  );
}
