import React from 'react';
import GalleryTemplateCard from './GalleryTemplateCard';
import type { ExtendedTemplateDefinition, ResumeData } from '../../types/resume';
import type { Locale } from '../../utils/i18n';
import { getTranslations } from '../../utils/i18n';

export interface TemplateGridProps {
  templates: ExtendedTemplateDefinition[];
  currentTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  resumeData: ResumeData;
  themeColor: string;
  language: Locale;
}

export default function TemplateGrid({
  templates,
  currentTemplateId,
  onSelectTemplate,
  resumeData,
  themeColor,
  language,
}: TemplateGridProps) {
  const t = getTranslations(language);

  if (templates.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 16px',
          color: '#9ca3af',
          fontSize: 15,
        }}
      >
        {t.noTemplatesFound}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 20,
        padding: '16px 0',
      }}
    >
      {templates.map((template) => (
        <GalleryTemplateCard
          key={template.id}
          template={template}
          isCurrent={template.id === currentTemplateId}
          onSelect={() => onSelectTemplate(template.id)}
          resumeData={resumeData}
          themeColor={themeColor}
          language={language}
        />
      ))}
    </div>
  );
}
