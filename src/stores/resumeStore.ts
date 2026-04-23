import { create } from 'zustand';
import type {
  ResumeData,
  ResumeListItem,
  PersonalInfo,
  Experience,
  Education,
  Project,
  CustomSection,
  SkillLevel,
  ImportResult,
  StandardSectionId,
} from '../types/resume';
import { DEFAULT_RESUME_DATA } from '../types/resume';
import { generateId } from '../utils/validators';
import { validateResumeData } from '../services/validationService';
import * as storage from '../services/storageService';
import type { ResumeLanguage } from '../utils/i18n';
import { getLocale, getTranslations } from '../utils/i18n';

// ============================================================
// ResumeStore - 简历数据状态管理 (Zustand)
// ============================================================

export interface ResumeStoreState {
  currentResumeId: string | null;
  resumeData: ResumeData;
  resumeList: ResumeListItem[];
  selectedTemplateId: string;
  themeColor: string;
  resumeLanguage: ResumeLanguage;

  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;

  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (fromIndex: number, toIndex: number) => void;

  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducations: (fromIndex: number, toIndex: number) => void;

  addSkill: (name: string) => void;
  removeSkill: (id: string) => void;
  updateSkillLevel: (id: string, level: SkillLevel) => void;

  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (fromIndex: number, toIndex: number) => void;

  addCustomSection: () => void;
  updateCustomSection: (id: string, data: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;

  setTemplate: (templateId: string) => void;
  setThemeColor: (color: string) => void;
  setResumeLanguage: (lang: ResumeLanguage) => void;
  updateSectionTitle: (sectionId: StandardSectionId, title: string) => void;

  createResume: (name: string) => void;
  loadResume: (id: string) => void;
  deleteResume: (id: string) => void;
  renameResume: (id: string, name: string) => void;

  importFromJSON: (json: string) => ImportResult;
  exportToJSON: () => string;

  clearAll: () => void;
}

/**
 * 数组重排序工具：将 fromIndex 位置的元素移动到 toIndex 位置
 */
function reorderArray<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...arr];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

function createDefaultResumeData(): ResumeData {
  const now = new Date().toISOString();
  return {
    ...DEFAULT_RESUME_DATA,
    personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo },
    experiences: [],
    educations: [],
    skills: [],
    projects: [],
    customSections: [],
    sectionTitles: { ...(DEFAULT_RESUME_DATA.sectionTitles ?? {}) },
    sectionOrder: [...DEFAULT_RESUME_DATA.sectionOrder],
    metadata: {
      ...DEFAULT_RESUME_DATA.metadata,
      createdAt: now,
      updatedAt: now,
    },
  };
}

export const useResumeStore = create<ResumeStoreState>()((set, get) => ({
  currentResumeId: null,
  resumeData: createDefaultResumeData(),
  resumeLanguage: 'zh',
  resumeList: storage.getResumeList(),
  selectedTemplateId: DEFAULT_RESUME_DATA.metadata.templateId,
  themeColor: DEFAULT_RESUME_DATA.metadata.themeColor,

  // --- 个人信息 ---
  updatePersonalInfo: (info) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...info },
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  // --- 工作经历 ---
  addExperience: () =>
    set((state) => {
      const newExp: Experience = {
        id: generateId(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      };
      return {
        resumeData: {
          ...state.resumeData,
          experiences: [...state.resumeData.experiences, newExp],
          metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
        },
      };
    }),

  updateExperience: (id, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experiences: state.resumeData.experiences.map((exp) =>
          exp.id === id ? { ...exp, ...data } : exp,
        ),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experiences: state.resumeData.experiences.filter((exp) => exp.id !== id),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  reorderExperiences: (fromIndex, toIndex) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experiences: reorderArray(state.resumeData.experiences, fromIndex, toIndex),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  // --- 教育背景 ---
  addEducation: () =>
    set((state) => {
      const newEdu: Education = {
        id: generateId(),
        school: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
      };
      return {
        resumeData: {
          ...state.resumeData,
          educations: [...state.resumeData.educations, newEdu],
          metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
        },
      };
    }),

  updateEducation: (id, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        educations: state.resumeData.educations.map((edu) =>
          edu.id === id ? { ...edu, ...data } : edu,
        ),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  removeEducation: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        educations: state.resumeData.educations.filter((edu) => edu.id !== id),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  reorderEducations: (fromIndex, toIndex) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        educations: reorderArray(state.resumeData.educations, fromIndex, toIndex),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  // --- 技能 ---
  addSkill: (name) =>
    set((state) => {
      const newSkill = {
        id: generateId(),
        name,
        level: 'intermediate' as SkillLevel,
      };
      return {
        resumeData: {
          ...state.resumeData,
          skills: [...state.resumeData.skills, newSkill],
          metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
        },
      };
    }),

  removeSkill: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.filter((s) => s.id !== id),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  updateSkillLevel: (id, level) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.map((s) =>
          s.id === id ? { ...s, level } : s,
        ),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  // --- 项目经验 ---
  addProject: () =>
    set((state) => {
      const newProject: Project = {
        id: generateId(),
        name: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
      };
      return {
        resumeData: {
          ...state.resumeData,
          projects: [...state.resumeData.projects, newProject],
          metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
        },
      };
    }),

  updateProject: (id, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.map((p) =>
          p.id === id ? { ...p, ...data } : p,
        ),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  removeProject: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((p) => p.id !== id),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  reorderProjects: (fromIndex, toIndex) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: reorderArray(state.resumeData.projects, fromIndex, toIndex),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  // --- 自定义区块 ---
  addCustomSection: () =>
    set((state) => {
      const newSection: CustomSection = {
        id: generateId(),
        title: '',
        content: '',
      };
      return {
        resumeData: {
          ...state.resumeData,
          customSections: [...state.resumeData.customSections, newSection],
          sectionOrder: [...state.resumeData.sectionOrder, newSection.id],
          metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
        },
      };
    }),

  updateCustomSection: (id, data) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: state.resumeData.customSections.map((sec) =>
          sec.id === id ? { ...sec, ...data } : sec,
        ),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  removeCustomSection: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        customSections: state.resumeData.customSections.filter((sec) => sec.id !== id),
        sectionOrder: state.resumeData.sectionOrder.filter((sId) => sId !== id),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  reorderSections: (fromIndex, toIndex) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        sectionOrder: reorderArray(state.resumeData.sectionOrder, fromIndex, toIndex),
        metadata: { ...state.resumeData.metadata, updatedAt: new Date().toISOString() },
      },
    })),

  // --- 模板与主题 ---
  setTemplate: (templateId) =>
    set((state) => ({
      selectedTemplateId: templateId,
      resumeData: {
        ...state.resumeData,
        metadata: {
          ...state.resumeData.metadata,
          templateId,
          updatedAt: new Date().toISOString(),
        },
      },
    })),

  setThemeColor: (color) =>
    set((state) => ({
      themeColor: color,
      resumeData: {
        ...state.resumeData,
        metadata: {
          ...state.resumeData.metadata,
          themeColor: color,
          updatedAt: new Date().toISOString(),
        },
      },
    })),

  setResumeLanguage: (lang) => set({ resumeLanguage: lang }),

  updateSectionTitle: (sectionId, title) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        sectionTitles: {
          ...(state.resumeData.sectionTitles ?? {}),
          [sectionId]: title,
        },
        metadata: {
          ...state.resumeData.metadata,
          updatedAt: new Date().toISOString(),
        },
      },
    })),

  // --- 多简历管理 ---
  createResume: (name) => {
    const id = generateId();
    const now = new Date().toISOString();
    const newData = createDefaultResumeData();

    // Save to storage
    storage.saveResume(id, newData);
    storage.setCurrentResumeId(id);

    const newListItem: ResumeListItem = { id, name, updatedAt: now };
    const updatedList = [...get().resumeList, newListItem];
    storage.saveResumeList(updatedList);

    set({
      currentResumeId: id,
      resumeData: newData,
      resumeList: updatedList,
      selectedTemplateId: newData.metadata.templateId,
      themeColor: newData.metadata.themeColor,
    });
  },

  loadResume: (id) => {
    const data = storage.loadResume(id);
    if (!data) return;

    storage.setCurrentResumeId(id);
    set({
      currentResumeId: id,
      resumeData: data,
      selectedTemplateId: data.metadata.templateId,
      themeColor: data.metadata.themeColor,
    });
  },

  deleteResume: (id) => {
    const state = get();
    storage.deleteResume(id);

    const updatedList = state.resumeList.filter((item) => item.id !== id);
    storage.saveResumeList(updatedList);

    // If deleting the current resume, reset to default
    if (state.currentResumeId === id) {
      const defaultData = createDefaultResumeData();
      set({
        currentResumeId: null,
        resumeData: defaultData,
        resumeList: updatedList,
        selectedTemplateId: defaultData.metadata.templateId,
        themeColor: defaultData.metadata.themeColor,
      });
    } else {
      set({ resumeList: updatedList });
    }
  },

  renameResume: (id, name) => {
    const updatedList = get().resumeList.map((item) =>
      item.id === id ? { ...item, name, updatedAt: new Date().toISOString() } : item,
    );
    storage.saveResumeList(updatedList);
    set({ resumeList: updatedList });
  },

  // --- 导入导出 ---
  importFromJSON: (json): ImportResult => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      return { success: false, error: 'invalid_json' };
    }

    const validation = validateResumeData(parsed);
    if (!validation.valid) {
      return {
        success: false,
        error: 'missing_fields',
        details: validation.missingFields,
      };
    }

    const data = parsed as ResumeData;
    if (!data.sectionTitles) {
      data.sectionTitles = {};
    }
    // Ensure backward compatibility: add projects array if missing from imported data
    if (!data.projects) {
      data.projects = [];
    }
    // Ensure projects is in sectionOrder for backward compatibility
    if (!data.sectionOrder.includes('projects')) {
      const expIdx = data.sectionOrder.indexOf('experiences');
      if (expIdx !== -1) {
        data.sectionOrder.splice(expIdx + 1, 0, 'projects');
      } else {
        data.sectionOrder.push('projects');
      }
    }

    // Create a resume list entry so the sidebar shows the imported resume
    const id = generateId();
    const now = new Date().toISOString();
    const name = data.personalInfo.name?.trim() || getTranslations(getLocale()).importedResume;

    storage.saveResume(id, data);
    storage.setCurrentResumeId(id);

    const newListItem: ResumeListItem = { id, name, updatedAt: now };
    const updatedList = [...get().resumeList, newListItem];
    storage.saveResumeList(updatedList);

    set(() => ({
      currentResumeId: id,
      resumeList: updatedList,
      resumeData: {
        ...data,
        metadata: {
          ...data.metadata,
          updatedAt: now,
        },
      },
      selectedTemplateId: data.metadata.templateId,
      themeColor: data.metadata.themeColor,
    }));

    return { success: true, data };
  },

  exportToJSON: (): string => {
    return JSON.stringify(get().resumeData, null, 2);
  },

  // --- 重置 ---
  clearAll: () => {
    storage.clearAll();
    const defaultData = createDefaultResumeData();
    set({
      currentResumeId: null,
      resumeData: defaultData,
      resumeList: [],
      selectedTemplateId: defaultData.metadata.templateId,
      themeColor: defaultData.metadata.themeColor,
    });
  },
}));
