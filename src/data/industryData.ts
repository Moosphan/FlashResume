export interface IndustryCategory {
  id: string;
  nameZh: string;
  nameEn: string;
  icon: string;
}

export const INDUSTRY_CATEGORIES: IndustryCategory[] = [
  { id: 'tech', nameZh: '科技/互联网', nameEn: 'Tech/Internet', icon: '💻' },
  { id: 'finance', nameZh: '金融/银行', nameEn: 'Finance/Banking', icon: '🏦' },
  { id: 'healthcare', nameZh: '医疗/健康', nameEn: 'Healthcare', icon: '🏥' },
  { id: 'education', nameZh: '教育/学术', nameEn: 'Education/Academia', icon: '🎓' },
  { id: 'creative', nameZh: '创意/设计', nameEn: 'Creative/Design', icon: '🎨' },
  { id: 'legal', nameZh: '法律/合规', nameEn: 'Legal/Compliance', icon: '⚖️' },
  { id: 'marketing', nameZh: '市场营销', nameEn: 'Marketing', icon: '📢' },
  { id: 'manufacturing', nameZh: '制造/工程', nameEn: 'Manufacturing/Engineering', icon: '🏭' },
  { id: 'government', nameZh: '政府/公共事业', nameEn: 'Government/Public Sector', icon: '🏛️' },
  { id: 'retail', nameZh: '零售/电商', nameEn: 'Retail/E-commerce', icon: '🛒' },
  { id: 'realestate', nameZh: '房地产/建筑', nameEn: 'Real Estate/Construction', icon: '🏗️' },
  { id: 'hospitality', nameZh: '餐饮/酒店', nameEn: 'Hospitality', icon: '🍽️' },
  { id: 'logistics', nameZh: '物流/供应链', nameEn: 'Logistics/Supply Chain', icon: '🚚' },
  { id: 'media', nameZh: '媒体/传播', nameEn: 'Media/Communications', icon: '📺' },
  { id: 'agriculture', nameZh: '农业/环保', nameEn: 'Agriculture/Environment', icon: '🌱' },
  { id: 'hr', nameZh: '人力资源/咨询', nameEn: 'HR/Consulting', icon: '🤝' },
];

export const VALID_INDUSTRY_IDS = new Set(INDUSTRY_CATEGORIES.map((c) => c.id));
