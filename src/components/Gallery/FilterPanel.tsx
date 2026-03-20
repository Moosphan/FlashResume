import React from 'react';
import { INDUSTRY_CATEGORIES } from '../../data/industryData';
import type { Locale } from '../../utils/i18n';
import { getTranslations } from '../../utils/i18n';

export interface FilterPanelProps {
  selectedIndustry: string | null;
  onSelect: (industryId: string | null) => void;
  templateCountByIndustry: Record<string, number>;
  language: Locale;
}

export default function FilterPanel({
  selectedIndustry,
  onSelect,
  templateCountByIndustry,
  language,
}: FilterPanelProps) {
  const t = getTranslations(language);

  const totalCount = Object.values(templateCountByIndustry).reduce(
    (sum, c) => sum + c,
    0,
  );

  const isAllSelected = selectedIndustry === null;

  const tabStyle = (selected: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '6px 14px',
    borderRadius: 9999,
    border: 'none',
    fontSize: 13,
    fontWeight: selected ? 600 : 400,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    backgroundColor: selected ? '#2563eb' : '#f3f4f6',
    color: selected ? '#fff' : '#374151',
    transition: 'background-color 0.15s, color 0.15s',
  });

  return (
    <div
      role="tablist"
      aria-label={t.filterByIndustry}
      className="hide-scrollbar"
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        padding: '8px 0',
      }}
    >
      {/* "All" tab */}
      <button
        role="tab"
        aria-selected={isAllSelected}
        style={tabStyle(isAllSelected)}
        onClick={() => onSelect(null)}
      >
        {t.allCategories} ({totalCount})
      </button>

      {/* Industry category tabs */}
      {INDUSTRY_CATEGORIES.map((cat) => {
        const selected = selectedIndustry === cat.id;
        const count = templateCountByIndustry[cat.id] ?? 0;
        const name = language === 'zh' ? cat.nameZh : cat.nameEn;

        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={selected}
            style={tabStyle(selected)}
            onClick={() => onSelect(selected ? null : cat.id)}
          >
            {cat.icon} {name} ({count})
          </button>
        );
      })}
    </div>
  );
}
