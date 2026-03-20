import type { TemplateDefinition, ExtendedTemplateDefinition } from '../types/resume';
import { VALID_INDUSTRY_IDS } from '../data/industryData';
import ClassicTemplate from '../components/Preview/templates/ClassicTemplate';
import ModernTemplate from '../components/Preview/templates/ModernTemplate';
import MinimalTemplate from '../components/Preview/templates/MinimalTemplate';
import TimelineTemplate from '../components/Preview/templates/TimelineTemplate';
import CardTemplate from '../components/Preview/templates/CardTemplate';
import ProfessionalTemplate from '../components/Preview/templates/ProfessionalTemplate';
import MagazineTemplate from '../components/Preview/templates/MagazineTemplate';
import CenteredTemplate from '../components/Preview/templates/CenteredTemplate';
import TechTemplate from '../components/Preview/templates/TechTemplate';
import FinanceTemplate from '../components/Preview/templates/FinanceTemplate';
import HealthcareTemplate from '../components/Preview/templates/HealthcareTemplate';
import AcademicTemplate from '../components/Preview/templates/AcademicTemplate';
import CreativeTemplate from '../components/Preview/templates/CreativeTemplate';
import LegalTemplate from '../components/Preview/templates/LegalTemplate';
import MarketingTemplate from '../components/Preview/templates/MarketingTemplate';
import EngineeringTemplate from '../components/Preview/templates/EngineeringTemplate';
import GovernmentTemplate from '../components/Preview/templates/GovernmentTemplate';
import RetailTemplate from '../components/Preview/templates/RetailTemplate';
import RealEstateTemplate from '../components/Preview/templates/RealEstateTemplate';
import HospitalityTemplate from '../components/Preview/templates/HospitalityTemplate';
import LogisticsTemplate from '../components/Preview/templates/LogisticsTemplate';
import MediaTemplate from '../components/Preview/templates/MediaTemplate';
import AgricultureTemplate from '../components/Preview/templates/AgricultureTemplate';
import HRConsultingTemplate from '../components/Preview/templates/HRConsultingTemplate';

// --- Template Registry ---

const templates: ExtendedTemplateDefinition[] = [];

function register(template: TemplateDefinition | ExtendedTemplateDefinition): void {
  const extended = template as Partial<ExtendedTemplateDefinition>;

  // Validate extended fields when present
  if (extended.industries || extended.featureTags) {
    // Filter out invalid industry IDs, keeping only valid ones
    const validIndustries = (extended.industries ?? []).filter((id) => VALID_INDUSTRY_IDS.has(id));

    if (validIndustries.length === 0) {
      console.warn(
        `Template "${template.id}" registration rejected: industries must contain at least one valid industry ID.`
      );
      return;
    }

    if (!extended.featureTags || extended.featureTags.length === 0) {
      console.warn(
        `Template "${template.id}" registration rejected: featureTags must contain at least one tag.`
      );
      return;
    }

    // Build the validated extended template
    const validatedTemplate: ExtendedTemplateDefinition = {
      ...template,
      industries: validIndustries,
      featureTags: extended.featureTags,
      nameEn: extended.nameEn ?? '',
    };

    const existing = templates.findIndex((t) => t.id === validatedTemplate.id);
    if (existing !== -1) {
      templates[existing] = validatedTemplate;
    } else {
      templates.push(validatedTemplate);
    }
  } else {
    // Legacy template without extended fields - wrap as ExtendedTemplateDefinition
    const legacyTemplate: ExtendedTemplateDefinition = {
      ...template,
      industries: [],
      featureTags: [],
      nameEn: '',
    };

    const existing = templates.findIndex((t) => t.id === legacyTemplate.id);
    if (existing !== -1) {
      templates[existing] = legacyTemplate;
    } else {
      templates.push(legacyTemplate);
    }
  }
}

function getAll(): ExtendedTemplateDefinition[] {
  return [...templates];
}

function getById(id: string): ExtendedTemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}

// Pre-register built-in templates
register({
  id: 'classic',
  name: '经典',
  nameEn: 'Classic',
  thumbnail: '',
  component: ClassicTemplate,
  industries: ['finance', 'government', 'legal', 'manufacturing'],
  featureTags: [
    { zh: '传统布局', en: 'Traditional Layout' },
    { zh: '正式风格', en: 'Formal Style' },
  ],
});

register({
  id: 'modern',
  name: '现代',
  nameEn: 'Modern',
  thumbnail: '',
  component: ModernTemplate,
  industries: ['tech', 'creative', 'marketing', 'media'],
  featureTags: [
    { zh: '双栏布局', en: 'Two-Column Layout' },
    { zh: '现代风格', en: 'Modern Style' },
  ],
});

register({
  id: 'minimal',
  name: '极简',
  nameEn: 'Minimal',
  thumbnail: '',
  component: MinimalTemplate,
  industries: ['tech', 'education', 'hr'],
  featureTags: [
    { zh: '简洁布局', en: 'Clean Layout' },
    { zh: '极简风格', en: 'Minimalist Style' },
  ],
});

register({
  id: 'timeline',
  name: '时间线',
  nameEn: 'Timeline',
  thumbnail: '',
  component: TimelineTemplate,
  industries: ['tech', 'manufacturing', 'logistics', 'education'],
  featureTags: [
    { zh: '时间线布局', en: 'Timeline Layout' },
    { zh: '时序风格', en: 'Chronological Style' },
  ],
});

register({
  id: 'card',
  name: '卡片',
  nameEn: 'Card',
  thumbnail: '',
  component: CardTemplate,
  industries: ['creative', 'marketing', 'retail', 'hospitality'],
  featureTags: [
    { zh: '卡片布局', en: 'Card Layout' },
    { zh: '视觉风格', en: 'Visual Style' },
  ],
});

register({
  id: 'professional',
  name: '专业',
  nameEn: 'Professional',
  thumbnail: '',
  component: ProfessionalTemplate,
  industries: ['finance', 'legal', 'government', 'manufacturing'],
  featureTags: [
    { zh: '专业布局', en: 'Professional Layout' },
    { zh: '结构化风格', en: 'Structured Style' },
  ],
});

register({
  id: 'magazine',
  name: '杂志',
  nameEn: 'Magazine',
  thumbnail: '',
  component: MagazineTemplate,
  industries: ['creative', 'media', 'marketing'],
  featureTags: [
    { zh: '杂志布局', en: 'Magazine Layout' },
    { zh: '创意风格', en: 'Creative Style' },
  ],
});

register({
  id: 'centered',
  name: '居中',
  nameEn: 'Centered',
  thumbnail: '',
  component: CenteredTemplate,
  industries: ['education', 'healthcare', 'hr'],
  featureTags: [
    { zh: '居中布局', en: 'Centered Layout' },
    { zh: '均衡风格', en: 'Balanced Style' },
  ],
});

export const templateRegistry = { getAll, getById, register };

// --- Industry-specific templates ---

register({
  id: 'tech-industry',
  name: '科技',
  nameEn: 'Tech',
  thumbnail: '',
  component: TechTemplate,
  industries: ['tech'],
  featureTags: [
    { zh: '深色侧边栏', en: 'Dark Sidebar' },
    { zh: '技能进度条', en: 'Skill Progress Bars' },
  ],
});

register({
  id: 'finance-industry',
  name: '金融',
  nameEn: 'Finance',
  thumbnail: '',
  component: FinanceTemplate,
  industries: ['finance'],
  featureTags: [
    { zh: '传统单栏', en: 'Traditional Single Column' },
    { zh: '衬线字体', en: 'Serif Font' },
  ],
});

register({
  id: 'healthcare-industry',
  name: '医疗',
  nameEn: 'Healthcare',
  thumbnail: '',
  component: HealthcareTemplate,
  industries: ['healthcare'],
  featureTags: [
    { zh: '清爽留白', en: 'Clean Whitespace' },
    { zh: '时间线', en: 'Timeline' },
  ],
});

register({
  id: 'academic-industry',
  name: '学术',
  nameEn: 'Academic',
  thumbnail: '',
  component: AcademicTemplate,
  industries: ['education'],
  featureTags: [
    { zh: '论文风格', en: 'Paper Style' },
    { zh: '编号章节', en: 'Numbered Sections' },
  ],
});

register({
  id: 'creative-industry',
  name: '创意',
  nameEn: 'Creative',
  thumbnail: '',
  component: CreativeTemplate,
  industries: ['creative'],
  featureTags: [
    { zh: '非对称布局', en: 'Asymmetric Layout' },
    { zh: '撞色方案', en: 'Bold Colors' },
  ],
});

register({
  id: 'legal-industry',
  name: '法律',
  nameEn: 'Legal',
  thumbnail: '',
  component: LegalTemplate,
  industries: ['legal'],
  featureTags: [
    { zh: '法律文书风格', en: 'Legal Document Style' },
    { zh: '衬线字体', en: 'Serif Font' },
  ],
});

register({
  id: 'marketing-industry',
  name: '营销',
  nameEn: 'Marketing',
  thumbnail: '',
  component: MarketingTemplate,
  industries: ['marketing'],
  featureTags: [
    { zh: '信息图风格', en: 'Infographic Style' },
    { zh: '数据高亮', en: 'Data Highlights' },
  ],
});

register({
  id: 'engineering-industry',
  name: '工程',
  nameEn: 'Engineering',
  thumbnail: '',
  component: EngineeringTemplate,
  industries: ['manufacturing'],
  featureTags: [
    { zh: '网格布局', en: 'Grid Layout' },
    { zh: '等宽字体', en: 'Monospace Font' },
  ],
});

register({
  id: 'government-industry',
  name: '政府',
  nameEn: 'Government',
  thumbnail: '',
  component: GovernmentTemplate,
  industries: ['government'],
  featureTags: [
    { zh: '标准化布局', en: 'Standardized Layout' },
    { zh: '庄重风格', en: 'Formal Style' },
  ],
});

register({
  id: 'retail-industry',
  name: '零售',
  nameEn: 'Retail',
  thumbnail: '',
  component: RetailTemplate,
  industries: ['retail'],
  featureTags: [
    { zh: '圆角卡片', en: 'Rounded Cards' },
    { zh: '标签云', en: 'Tag Cloud' },
  ],
});

register({
  id: 'realestate-industry',
  name: '房地产',
  nameEn: 'Real Estate',
  thumbnail: '',
  component: RealEstateTemplate,
  industries: ['realestate'],
  featureTags: [
    { zh: '宽幅头部', en: 'Wide Header' },
    { zh: '建筑线条', en: 'Architectural Lines' },
  ],
});

register({
  id: 'hospitality-industry',
  name: '餐饮酒店',
  nameEn: 'Hospitality',
  thumbnail: '',
  component: HospitalityTemplate,
  industries: ['hospitality'],
  featureTags: [
    { zh: '温馨风格', en: 'Warm Style' },
    { zh: '圆角元素', en: 'Rounded Elements' },
  ],
});

register({
  id: 'logistics-industry',
  name: '物流',
  nameEn: 'Logistics',
  thumbnail: '',
  component: LogisticsTemplate,
  industries: ['logistics'],
  featureTags: [
    { zh: '流程图风格', en: 'Flowchart Style' },
    { zh: '连接线装饰', en: 'Connector Lines' },
  ],
});

register({
  id: 'media-industry',
  name: '媒体',
  nameEn: 'Media',
  thumbnail: '',
  component: MediaTemplate,
  industries: ['media'],
  featureTags: [
    { zh: '杂志排版', en: 'Magazine Layout' },
    { zh: '混合字体', en: 'Mixed Fonts' },
  ],
});

register({
  id: 'agriculture-industry',
  name: '农业环保',
  nameEn: 'Agriculture',
  thumbnail: '',
  component: AgricultureTemplate,
  industries: ['agriculture'],
  featureTags: [
    { zh: '自然风格', en: 'Natural Style' },
    { zh: '有机曲线', en: 'Organic Curves' },
  ],
});

register({
  id: 'hr-industry',
  name: '人力咨询',
  nameEn: 'HR Consulting',
  thumbnail: '',
  component: HRConsultingTemplate,
  industries: ['hr'],
  featureTags: [
    { zh: '评分矩阵', en: 'Rating Matrix' },
    { zh: '双栏专业', en: 'Professional Two-Column' },
  ],
});
