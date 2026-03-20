import { describe, it, expect } from 'vitest';
import { filterTemplatesByIndustry, getTemplateCountByIndustry } from '../galleryUtils';
import type { ExtendedTemplateDefinition } from '../../../types/resume';

const mockTemplate = (
  id: string,
  industries: string[],
): ExtendedTemplateDefinition =>
  ({
    id,
    name: id,
    nameEn: id,
    thumbnail: '',
    component: () => null,
    industries,
    featureTags: [{ zh: '标签', en: 'tag' }],
  }) as unknown as ExtendedTemplateDefinition;

const templates: ExtendedTemplateDefinition[] = [
  mockTemplate('a', ['tech', 'finance']),
  mockTemplate('b', ['tech', 'healthcare']),
  mockTemplate('c', ['finance']),
  mockTemplate('d', ['education']),
];

describe('filterTemplatesByIndustry', () => {
  it('returns all templates when industryId is null', () => {
    const result = filterTemplatesByIndustry(templates, null);
    expect(result).toEqual(templates);
  });

  it('filters templates by industry', () => {
    const result = filterTemplatesByIndustry(templates, 'tech');
    expect(result.map((t) => t.id)).toEqual(['a', 'b']);
  });

  it('returns empty array when no templates match', () => {
    const result = filterTemplatesByIndustry(templates, 'legal');
    expect(result).toEqual([]);
  });

  it('handles empty template list', () => {
    expect(filterTemplatesByIndustry([], 'tech')).toEqual([]);
    expect(filterTemplatesByIndustry([], null)).toEqual([]);
  });
});

describe('getTemplateCountByIndustry', () => {
  it('counts templates per industry', () => {
    const counts = getTemplateCountByIndustry(templates);
    expect(counts).toEqual({
      tech: 2,
      finance: 2,
      healthcare: 1,
      education: 1,
    });
  });

  it('returns empty record for empty template list', () => {
    expect(getTemplateCountByIndustry([])).toEqual({});
  });
});
