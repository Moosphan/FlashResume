import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useResumeStore } from '../resumeStore';
import { DEFAULT_RESUME_DATA } from '../../types/resume';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

function resetStore() {
  useResumeStore.setState({
    currentResumeId: null,
    resumeData: {
      ...DEFAULT_RESUME_DATA,
      personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo },
      experiences: [],
      educations: [],
      skills: [],
      customSections: [],
      sectionOrder: [...DEFAULT_RESUME_DATA.sectionOrder],
      metadata: {
        ...DEFAULT_RESUME_DATA.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    resumeList: [],
    selectedTemplateId: DEFAULT_RESUME_DATA.metadata.templateId,
    themeColor: DEFAULT_RESUME_DATA.metadata.themeColor,
  });
}

describe('ResumeStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    resetStore();
  });

  describe('updatePersonalInfo', () => {
    it('should update personal info fields', () => {
      useResumeStore.getState().updatePersonalInfo({ name: 'John', email: 'john@example.com' });
      const { personalInfo } = useResumeStore.getState().resumeData;
      expect(personalInfo.name).toBe('John');
      expect(personalInfo.email).toBe('john@example.com');
      expect(personalInfo.phone).toBe(''); // unchanged
    });
  });

  describe('updateSectionTitle', () => {
    it('should update standard section titles', () => {
      useResumeStore.getState().updateSectionTitle('experiences', '职业经历');
      expect(useResumeStore.getState().resumeData.sectionTitles?.experiences).toBe('职业经历');
    });
  });

  describe('Experience CRUD', () => {
    it('should add an experience', () => {
      useResumeStore.getState().addExperience();
      const { experiences } = useResumeStore.getState().resumeData;
      expect(experiences).toHaveLength(1);
      expect(experiences[0].company).toBe('');
      expect(experiences[0].id).toBeTruthy();
    });

    it('should update an experience', () => {
      useResumeStore.getState().addExperience();
      const id = useResumeStore.getState().resumeData.experiences[0].id;
      useResumeStore.getState().updateExperience(id, { company: 'Acme Corp' });
      expect(useResumeStore.getState().resumeData.experiences[0].company).toBe('Acme Corp');
    });

    it('should remove an experience', () => {
      useResumeStore.getState().addExperience();
      useResumeStore.getState().addExperience();
      const id = useResumeStore.getState().resumeData.experiences[0].id;
      useResumeStore.getState().removeExperience(id);
      expect(useResumeStore.getState().resumeData.experiences).toHaveLength(1);
    });

    it('should reorder experiences', () => {
      useResumeStore.getState().addExperience();
      useResumeStore.getState().updateExperience(
        useResumeStore.getState().resumeData.experiences[0].id,
        { company: 'First' },
      );
      useResumeStore.getState().addExperience();
      useResumeStore.getState().updateExperience(
        useResumeStore.getState().resumeData.experiences[1].id,
        { company: 'Second' },
      );
      useResumeStore.getState().reorderExperiences(1, 0);
      const exps = useResumeStore.getState().resumeData.experiences;
      expect(exps[0].company).toBe('Second');
      expect(exps[1].company).toBe('First');
    });
  });

  describe('Education CRUD', () => {
    it('should add an education', () => {
      useResumeStore.getState().addEducation();
      expect(useResumeStore.getState().resumeData.educations).toHaveLength(1);
    });

    it('should update an education', () => {
      useResumeStore.getState().addEducation();
      const id = useResumeStore.getState().resumeData.educations[0].id;
      useResumeStore.getState().updateEducation(id, { school: 'MIT' });
      expect(useResumeStore.getState().resumeData.educations[0].school).toBe('MIT');
    });

    it('should remove an education', () => {
      useResumeStore.getState().addEducation();
      const id = useResumeStore.getState().resumeData.educations[0].id;
      useResumeStore.getState().removeEducation(id);
      expect(useResumeStore.getState().resumeData.educations).toHaveLength(0);
    });

    it('should reorder educations', () => {
      useResumeStore.getState().addEducation();
      useResumeStore.getState().updateEducation(
        useResumeStore.getState().resumeData.educations[0].id,
        { school: 'A' },
      );
      useResumeStore.getState().addEducation();
      useResumeStore.getState().updateEducation(
        useResumeStore.getState().resumeData.educations[1].id,
        { school: 'B' },
      );
      useResumeStore.getState().reorderEducations(1, 0);
      expect(useResumeStore.getState().resumeData.educations[0].school).toBe('B');
    });
  });

  describe('Skill CRUD', () => {
    it('should add a skill', () => {
      useResumeStore.getState().addSkill('TypeScript');
      const { skills } = useResumeStore.getState().resumeData;
      expect(skills).toHaveLength(1);
      expect(skills[0].name).toBe('TypeScript');
      expect(skills[0].level).toBe('intermediate');
    });

    it('should remove a skill', () => {
      useResumeStore.getState().addSkill('React');
      const id = useResumeStore.getState().resumeData.skills[0].id;
      useResumeStore.getState().removeSkill(id);
      expect(useResumeStore.getState().resumeData.skills).toHaveLength(0);
    });

    it('should update skill level', () => {
      useResumeStore.getState().addSkill('React');
      const id = useResumeStore.getState().resumeData.skills[0].id;
      useResumeStore.getState().updateSkillLevel(id, 'expert');
      expect(useResumeStore.getState().resumeData.skills[0].level).toBe('expert');
    });
  });

  describe('CustomSection CRUD', () => {
    it('should add a custom section and update sectionOrder', () => {
      useResumeStore.getState().addCustomSection();
      const { customSections, sectionOrder } = useResumeStore.getState().resumeData;
      expect(customSections).toHaveLength(1);
      expect(sectionOrder).toContain(customSections[0].id);
    });

    it('should update a custom section', () => {
      useResumeStore.getState().addCustomSection();
      const id = useResumeStore.getState().resumeData.customSections[0].id;
      useResumeStore.getState().updateCustomSection(id, { title: 'Projects' });
      expect(useResumeStore.getState().resumeData.customSections[0].title).toBe('Projects');
    });

    it('should remove a custom section and clean sectionOrder', () => {
      useResumeStore.getState().addCustomSection();
      const id = useResumeStore.getState().resumeData.customSections[0].id;
      useResumeStore.getState().removeCustomSection(id);
      expect(useResumeStore.getState().resumeData.customSections).toHaveLength(0);
      expect(useResumeStore.getState().resumeData.sectionOrder).not.toContain(id);
    });

    it('should reorder sections', () => {
      const order = useResumeStore.getState().resumeData.sectionOrder;
      // Default: ['personalInfo', 'experiences', 'educations', 'skills']
      useResumeStore.getState().reorderSections(0, 3);
      const newOrder = useResumeStore.getState().resumeData.sectionOrder;
      expect(newOrder[3]).toBe(order[0]);
      expect(newOrder).toHaveLength(order.length);
    });
  });

  describe('Template & Theme', () => {
    it('should set template and only change metadata.templateId', () => {
      useResumeStore.getState().updatePersonalInfo({ name: 'Test' });
      const dataBefore = { ...useResumeStore.getState().resumeData };
      useResumeStore.getState().setTemplate('modern');
      const dataAfter = useResumeStore.getState().resumeData;
      expect(dataAfter.metadata.templateId).toBe('modern');
      expect(useResumeStore.getState().selectedTemplateId).toBe('modern');
      expect(dataAfter.personalInfo.name).toBe(dataBefore.personalInfo.name);
      expect(dataAfter.experiences).toEqual(dataBefore.experiences);
    });

    it('should set theme color', () => {
      useResumeStore.getState().setThemeColor('#FF0000');
      expect(useResumeStore.getState().themeColor).toBe('#FF0000');
      expect(useResumeStore.getState().resumeData.metadata.themeColor).toBe('#FF0000');
    });
  });

  describe('Multi-resume management', () => {
    it('should create a new resume', () => {
      useResumeStore.getState().createResume('My Resume');
      expect(useResumeStore.getState().currentResumeId).toBeTruthy();
      expect(useResumeStore.getState().resumeList).toHaveLength(1);
      expect(useResumeStore.getState().resumeList[0].name).toBe('My Resume');
    });

    it('should load a resume from storage', () => {
      useResumeStore.getState().createResume('Resume 1');
      const id = useResumeStore.getState().currentResumeId!;
      useResumeStore.getState().updatePersonalInfo({ name: 'Saved Name' });
      // Manually save current state to storage for loadResume to find
      const currentData = useResumeStore.getState().resumeData;
      localStorageMock.setItem(`resume_builder_data_${id}`, JSON.stringify(currentData));

      // Create another resume to switch away
      useResumeStore.getState().createResume('Resume 2');
      expect(useResumeStore.getState().resumeData.personalInfo.name).toBe('');

      // Load back
      useResumeStore.getState().loadResume(id);
      expect(useResumeStore.getState().currentResumeId).toBe(id);
      expect(useResumeStore.getState().resumeData.personalInfo.name).toBe('Saved Name');
    });

    it('should delete a resume', () => {
      useResumeStore.getState().createResume('To Delete');
      const id = useResumeStore.getState().currentResumeId!;
      useResumeStore.getState().deleteResume(id);
      expect(useResumeStore.getState().resumeList).toHaveLength(0);
      expect(useResumeStore.getState().currentResumeId).toBeNull();
    });

    it('should rename a resume', () => {
      useResumeStore.getState().createResume('Old Name');
      const id = useResumeStore.getState().currentResumeId!;
      useResumeStore.getState().renameResume(id, 'New Name');
      expect(useResumeStore.getState().resumeList[0].name).toBe('New Name');
    });
  });

  describe('Import / Export', () => {
    it('should export to JSON and import back', () => {
      useResumeStore.getState().updatePersonalInfo({ name: 'Export Test', email: 'test@test.com' });
      useResumeStore.getState().addSkill('React');
      const json = useResumeStore.getState().exportToJSON();
      const parsed = JSON.parse(json);
      expect(parsed.personalInfo.name).toBe('Export Test');
      expect(parsed.skills).toHaveLength(1);
    });

    it('should import valid JSON', () => {
      const validData = {
        ...DEFAULT_RESUME_DATA,
        personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, name: 'Imported' },
        metadata: { ...DEFAULT_RESUME_DATA.metadata, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      };
      const result = useResumeStore.getState().importFromJSON(JSON.stringify(validData));
      expect(result.success).toBe(true);
      expect(useResumeStore.getState().resumeData.personalInfo.name).toBe('Imported');
    });

    it('should backfill empty sectionTitles when importing legacy JSON', () => {
      const legacyData = {
        personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, name: 'Imported' },
        experiences: [],
        educations: [],
        skills: [],
        projects: [],
        customSections: [],
        sectionOrder: [...DEFAULT_RESUME_DATA.sectionOrder],
        metadata: { ...DEFAULT_RESUME_DATA.metadata, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      };

      const result = useResumeStore.getState().importFromJSON(JSON.stringify(legacyData));

      expect(result.success).toBe(true);
      expect(useResumeStore.getState().resumeData.sectionTitles).toEqual({});
    });

    it('should reject invalid JSON', () => {
      const result = useResumeStore.getState().importFromJSON('not json');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('invalid_json');
      }
    });

    it('should reject JSON with missing fields', () => {
      const result = useResumeStore.getState().importFromJSON(JSON.stringify({ foo: 'bar' }));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('missing_fields');
        expect(result.details).toBeDefined();
        expect(result.details!.length).toBeGreaterThan(0);
      }
    });
  });

  describe('clearAll', () => {
    it('should reset all state and clear storage', () => {
      useResumeStore.getState().createResume('Test');
      useResumeStore.getState().updatePersonalInfo({ name: 'Test Name' });
      useResumeStore.getState().clearAll();

      expect(useResumeStore.getState().currentResumeId).toBeNull();
      expect(useResumeStore.getState().resumeList).toHaveLength(0);
      expect(useResumeStore.getState().resumeData.personalInfo.name).toBe('');
    });
  });
});
