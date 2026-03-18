export type Locale = 'zh' | 'en';

// Keep backward compat alias
export type ResumeLanguage = Locale;

// ============================================================
// All UI translations
// ============================================================

const translations = {
  zh: {
    // Resume template section headings
    experiences: '工作经历',
    educations: '教育背景',
    skills: '技能专长',
    projects: '项目经验',
    contact: '联系方式',
    namePlaceholder: '您的姓名',
    templateNotFound: '未找到模板',

    // Header
    autoSaved: '已自动保存',
    openSidebar: '打开侧边栏',
    exportMenu: '导出菜单',
    importJSON: '导入 JSON',
    exportPDF: '导出 PDF',
    exportPNG: '导出 PNG',
    exportJPG: '导出 JPG',
    exportJSON: '导出 JSON',
    switchLang: '中 → EN',
    switchToDark: '切换到深色模式',
    switchToLight: '切换到浅色模式',

    // Editor - sections
    templateSelect: '模板选择',
    themeColor: '主题颜色',
    customColor: '自定义',
    selectTemplate: '选择模板',
    selectThemeColor: '选择主题颜色',

    // Personal info
    personalInfo: '个人信息',
    avatar: '头像',
    avatarPreview: '头像预览',
    name: '姓名',
    namePh: '请输入姓名',
    email: '邮箱',
    emailPh: '请输入邮箱',
    phone: '电话',
    phonePh: '请输入电话号码',
    address: '地址',
    addressPh: '请输入地址',
    website: '个人网站',
    websitePh: '请输入个人网站 URL',

    // Experience
    companyName: '公司名称',
    companyPh: '请输入公司名称',
    position: '职位',
    positionPh: '请输入职位',
    startDate: '开始日期',
    endDate: '结束日期',
    jobDescription: '工作描述',
    jobDescPh: '请描述工作内容和成就',
    addExperience: '+ 添加工作经历',
    unfilled: '未填写公司',
    delete: '删除',

    // Education
    schoolName: '学校名称',
    schoolPh: '请输入学校名称',
    degree: '学位',
    degreePh: '请输入学位',
    major: '专业',
    majorPh: '请输入专业',
    addEducation: '+ 添加教育背景',
    unfilledSchool: '未填写学校',

    // Skills
    skillsPh: '输入技能，用顿号、逗号或换行分隔，如：React、TypeScript、Node.js',

    // Projects
    projectName: '项目名称',
    projectPh: '请输入项目名称',
    projectRole: '担任角色',
    projectRolePh: '请输入担任角色',
    projectDesc: '项目描述',
    projectDescPh: '请描述项目内容、技术栈和成果',
    addProject: '+ 添加项目经验',
    unfilledProject: '未填写项目',

    // Custom sections
    customSections: '自定义区块',
    sectionTitle: '区块标题',
    sectionTitlePh: '请输入区块标题',
    sectionContent: '内容',
    sectionContentPh: '请输入区块内容',
    addSection: '+ 添加区块',
    addCustomSection: '+ 添加自定义区块',
    unnamedSection: '未命名区块',

    // Sortable section labels
    sectionPersonalInfo: '个人信息',
    sectionExperiences: '工作经历',
    sectionProjects: '项目经验',
    sectionEducations: '教育背景',
    sectionSkills: '技能专长',
    sectionCustom: '自定义区块',
    dragSort: '拖拽排序',

    // Sidebar
    myResumes: '我的简历',
    closeSidebar: '关闭侧边栏',
    newResume: '+ 新建简历',
    noResumes: '暂无简历，点击上方按钮创建',
    deleteResume: '删除简历',
    promptResumeName: '请输入简历名称',
    deleteConfirmTitle: '删除简历',
    deleteConfirmMsg: (name: string) => `确定要删除简历「${name}」吗？此操作不可撤销。`,

    // Confirm dialog
    cancel: '取消',
    confirm: '确认',
    closeNotification: '关闭通知',

    // Rich text editor
    bold: '粗体',
    italic: '斜体',
    underline: '下划线',
    insertLink: '插入链接',
    linkPrompt: '请输入链接地址',

    // Export / Import toasts
    pdfFailed: 'PDF 生成失败，请重试',
    jsonExportFailed: 'JSON 导出失败，请重试',
    pngFailed: 'PNG 导出失败，请重试',
    jpgFailed: 'JPG 导出失败，请重试',
    importSuccess: '导入成功',
    invalidFile: '文件格式无效',
    incompleteData: (fields: string) => `简历数据不完整：缺少 ${fields}`,
    fileReadFailed: '文件读取失败，请重试',
    importedResume: '导入的简历',

    // ThemePicker colors
    colorBlue: '蓝色',
    colorRed: '红色',
    colorGreen: '绿色',
    colorPurple: '紫色',
    colorAmber: '琥珀色',
    colorCyan: '青色',
  },
  en: {
    experiences: 'Work Experience',
    educations: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    contact: 'Contact',
    namePlaceholder: 'Your Name',
    templateNotFound: 'Template not found',

    autoSaved: 'Auto saved',
    openSidebar: 'Open sidebar',
    exportMenu: 'Export menu',
    importJSON: 'Import JSON',
    exportPDF: 'Export PDF',
    exportPNG: 'Export PNG',
    exportJPG: 'Export JPG',
    exportJSON: 'Export JSON',
    switchLang: 'EN → 中',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',

    templateSelect: 'Template',
    themeColor: 'Theme Color',
    customColor: 'Custom',
    selectTemplate: 'Select template',
    selectThemeColor: 'Select theme color',

    personalInfo: 'Personal Info',
    avatar: 'Avatar',
    avatarPreview: 'Avatar preview',
    name: 'Name',
    namePh: 'Enter your name',
    email: 'Email',
    emailPh: 'Enter your email',
    phone: 'Phone',
    phonePh: 'Enter your phone number',
    address: 'Address',
    addressPh: 'Enter your address',
    website: 'Website',
    websitePh: 'Enter your website URL',

    companyName: 'Company',
    companyPh: 'Enter company name',
    position: 'Position',
    positionPh: 'Enter position',
    startDate: 'Start Date',
    endDate: 'End Date',
    jobDescription: 'Description',
    jobDescPh: 'Describe your work and achievements',
    addExperience: '+ Add Experience',
    unfilled: 'No company',
    delete: 'Delete',

    schoolName: 'School',
    schoolPh: 'Enter school name',
    degree: 'Degree',
    degreePh: 'Enter degree',
    major: 'Major',
    majorPh: 'Enter major',
    addEducation: '+ Add Education',
    unfilledSchool: 'No school',

    skillsPh: 'Enter skills separated by commas, e.g.: React, TypeScript, Node.js',

    projectName: 'Project Name',
    projectPh: 'Enter project name',
    projectRole: 'Role',
    projectRolePh: 'Enter your role',
    projectDesc: 'Description',
    projectDescPh: 'Describe the project, tech stack and outcomes',
    addProject: '+ Add Project',
    unfilledProject: 'No project',

    customSections: 'Custom Sections',
    sectionTitle: 'Section Title',
    sectionTitlePh: 'Enter section title',
    sectionContent: 'Content',
    sectionContentPh: 'Enter section content',
    addSection: '+ Add Section',
    addCustomSection: '+ Add Custom Section',
    unnamedSection: 'Unnamed section',

    sectionPersonalInfo: 'Personal Info',
    sectionExperiences: 'Work Experience',
    sectionProjects: 'Projects',
    sectionEducations: 'Education',
    sectionSkills: 'Skills',
    sectionCustom: 'Custom Section',
    dragSort: 'Drag to reorder',

    myResumes: 'My Resumes',
    closeSidebar: 'Close sidebar',
    newResume: '+ New Resume',
    noResumes: 'No resumes yet. Click above to create one.',
    deleteResume: 'Delete resume',
    promptResumeName: 'Enter resume name',
    deleteConfirmTitle: 'Delete Resume',
    deleteConfirmMsg: (name: string) => `Are you sure you want to delete "${name}"? This cannot be undone.`,

    cancel: 'Cancel',
    confirm: 'Confirm',
    closeNotification: 'Close notification',

    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    insertLink: 'Insert link',
    linkPrompt: 'Enter link URL',

    pdfFailed: 'PDF export failed, please retry',
    jsonExportFailed: 'JSON export failed, please retry',
    pngFailed: 'PNG export failed, please retry',
    jpgFailed: 'JPG export failed, please retry',
    importSuccess: 'Import successful',
    invalidFile: 'Invalid file format',
    incompleteData: (fields: string) => `Incomplete resume data: missing ${fields}`,
    fileReadFailed: 'File read failed, please retry',
    importedResume: 'Imported Resume',

    colorBlue: 'Blue',
    colorRed: 'Red',
    colorGreen: 'Green',
    colorPurple: 'Purple',
    colorAmber: 'Amber',
    colorCyan: 'Cyan',
  },
} as const;

// Static keys type (excludes function values)
export type TranslationKeys = keyof typeof translations.zh;

// The full translations object for a locale (widened to accept both zh and en values)
export type Translations = (typeof translations)['zh'] | (typeof translations)['en'];

// Backward compat: SectionLabels is a subset
export type SectionLabels = Pick<
  Translations,
  'experiences' | 'educations' | 'skills' | 'projects' | 'contact' | 'namePlaceholder' | 'templateNotFound'
>;

/** Get all translations for a locale */
export function getTranslations(locale: Locale) {
  return translations[locale];
}

/** Backward compat: get just the resume section labels */
export function getLabels(lang: ResumeLanguage) {
  return translations[lang];
}

// ============================================================
// Global locale state (simple module-level singleton)
// ============================================================

type LocaleListener = (locale: Locale) => void;
const listeners = new Set<LocaleListener>();

let currentLocale: Locale = ((): Locale => {
  try {
    const saved = localStorage.getItem('flash-resume-locale');
    if (saved === 'en' || saved === 'zh') return saved;
  } catch { /* ignore */ }
  return 'zh';
})();

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  try { localStorage.setItem('flash-resume-locale', locale); } catch { /* ignore */ }
  listeners.forEach((fn) => fn(locale));
}

export function subscribeLocale(fn: LocaleListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
