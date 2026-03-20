import type { ExtendedTemplateDefinition } from '../../types/resume';

/**
 * 按行业筛选模板。
 * 当 industryId 为 null 时返回全部模板。
 */
export function filterTemplatesByIndustry(
  templates: ExtendedTemplateDefinition[],
  industryId: string | null,
): ExtendedTemplateDefinition[] {
  if (industryId === null) {
    return templates;
  }
  return templates.filter((t) => t.industries.includes(industryId));
}

/**
 * 统计每个行业分类下的模板数量。
 */
export function getTemplateCountByIndustry(
  templates: ExtendedTemplateDefinition[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const template of templates) {
    for (const industry of template.industries) {
      counts[industry] = (counts[industry] ?? 0) + 1;
    }
  }
  return counts;
}
