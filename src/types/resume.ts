// ============================================================
// 核心数据模型 - 简历制作应用 (Resume Builder)
// ============================================================

// --- 基础类型 ---

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  avatar: string; // Base64 或 URL
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string; // ISO 8601 格式 YYYY-MM
  endDate: string;   // ISO 8601 格式 YYYY-MM，空字符串表示"至今"
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string; // ISO 8601 格式 YYYY-MM
  endDate: string;   // ISO 8601 格式 YYYY-MM
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string; // HTML 富文本内容
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string; // ISO 8601 格式 YYYY-MM
  endDate: string;   // ISO 8601 格式 YYYY-MM，空字符串表示"至今"
  description: string;
}

export interface ResumeMetadata {
  templateId: string;
  themeColor: string;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}


// --- 简历完整数据结构 ---

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  customSections: CustomSection[];
  sectionOrder: string[]; // Section ID 排序数组
  metadata: ResumeMetadata;
}

// --- 简历列表项（用于侧边栏展示） ---

export interface ResumeListItem {
  id: string;
  name: string;
  updatedAt: string;
}

// --- 校验相关类型 ---

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface ResumeDataValidationResult {
  valid: boolean;
  missingFields: string[];
  errors: string[];
}

// --- 导入结果（判别联合类型） ---

export type ImportResult =
  | { success: true; data: ResumeData }
  | { success: false; error: 'invalid_json' | 'missing_fields'; details?: string[] };

// --- 模板相关类型 ---

export interface TemplateProps {
  data: ResumeData;
  themeColor: string;
  language: 'zh' | 'en';
}

export interface TemplateDefinition {
  id: string;
  name: string;
  thumbnail: string;
  component: React.ComponentType<TemplateProps>;
}

// --- 默认空简历数据 ---

export const DEFAULT_RESUME_DATA: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    avatar: '',
  },
  experiences: [],
  educations: [],
  skills: [],
  projects: [],
  customSections: [],
  sectionOrder: ['personalInfo', 'experiences', 'projects', 'educations', 'skills'],
  metadata: {
    templateId: 'classic',
    themeColor: '#2563EB',
    createdAt: '',  // 创建时填充
    updatedAt: '',  // 每次保存时更新
  },
};
