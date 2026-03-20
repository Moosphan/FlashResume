import React from 'react';
import type { ExtendedTemplateDefinition, ResumeData } from '../../types/resume';
import type { Locale } from '../../utils/i18n';
import { getTranslations } from '../../utils/i18n';
import { templateRegistry } from '../../services/templateRegistry';

// --- ErrorBoundary ---

interface ErrorBoundaryState {
  hasError: boolean;
}

class ThumbnailErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            color: '#9ca3af',
            fontSize: 14,
          }}
        >
          Preview unavailable
        </div>
      );
    }
    return this.props.children;
  }
}

// --- GalleryTemplateCard ---

export interface GalleryTemplateCardProps {
  template: ExtendedTemplateDefinition;
  isCurrent: boolean;
  onSelect: () => void;
  resumeData: ResumeData;
  themeColor: string;
  language: Locale;
}

export default function GalleryTemplateCard({
  template,
  isCurrent,
  onSelect,
  resumeData,
  themeColor,
  language,
}: GalleryTemplateCardProps) {
  const [hovered, setHovered] = React.useState(false);
  const [containerWidth, setContainerWidth] = React.useState(220);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const t = getTranslations(language);

  const displayName = language === 'zh' ? template.name : template.nameEn;

  // Resolve the template component from registry (in case the definition's component reference is stale)
  const registered = templateRegistry.getById(template.id);
  const TemplateComponent = registered?.component ?? template.component;

  // A4 dimensions in mm → use px approximation for the inner render
  const innerWidth = 794; // ~210mm at 96dpi
  const innerHeight = 1123; // ~297mm at 96dpi

  // Measure actual container width to fill grid cell
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
        if (w > 0) setContainerWidth(w);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = containerWidth / innerWidth;

  return (
    <div
      ref={containerRef}
      role="article"
      aria-label={displayName}
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      style={{
        position: 'relative',
        borderRadius: 8,
        border: isCurrent ? `2px solid ${themeColor}` : '2px solid #e5e7eb',
        overflow: 'hidden',
        cursor: 'pointer',
        outline: 'none',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      // Focus-visible handled via inline + className fallback
      onFocus={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 3px ${themeColor}66`;
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Thumbnail preview */}
      <div
        style={{
          width: '100%',
          aspectRatio: `${innerWidth} / ${innerHeight}`,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#fff',
        }}
      >
        <ThumbnailErrorBoundary>
          <div
            style={{
              width: innerWidth,
              height: innerHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              pointerEvents: 'none',
            }}
          >
            <TemplateComponent
              data={resumeData}
              themeColor={themeColor}
              language={language}
            />
          </div>
        </ThumbnailErrorBoundary>

        {/* Hover overlay with "Use This Template" button */}
        {hovered && !isCurrent && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: themeColor,
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: 44,
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {t.useTemplate}
            </button>
          </div>
        )}

        {/* Current template badge */}
        {isCurrent && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: themeColor,
              color: '#fff',
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            {t.currentTemplate}
          </div>
        )}
      </div>

      {/* Card footer: name + tags */}
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
          {displayName}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {template.featureTags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                padding: '1px 6px',
                borderRadius: 9999,
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
              }}
            >
              {language === 'zh' ? tag.zh : tag.en}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
