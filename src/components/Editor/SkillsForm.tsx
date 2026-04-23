import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { useLocale } from '../../hooks/useLocale';
import EditableSectionTitle from './EditableSectionTitle';

function parseSkills(text: string): string[] {
  return text.split(/[,，、\n]/).map((s) => s.trim()).filter(Boolean);
}

export default function SkillsForm() {
  const skills = useResumeStore((s) => s.resumeData.skills);
  const addSkill = useResumeStore((s) => s.addSkill);
  const removeSkill = useResumeStore((s) => s.removeSkill);
  const { t } = useLocale();

  const [text, setText] = useState(() => skills.map((s) => s.name).join('、'));
  const isFocused = useRef(false);

  useEffect(() => {
    if (!isFocused.current) {
      setText(skills.map((s) => s.name).join('、'));
    }
  }, [skills]);

  const syncToStore = (value: string) => {
    const newNames = parseSkills(value);
    for (const skill of useResumeStore.getState().resumeData.skills) {
      if (!newNames.includes(skill.name)) removeSkill(skill.id);
    }
    const existing = new Set(useResumeStore.getState().resumeData.skills.map((s) => s.name));
    for (const name of newNames) {
      if (!existing.has(name)) addSkill(name);
    }
  };

  return (
    <section className="space-y-3">
      <EditableSectionTitle sectionId="skills" />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => { isFocused.current = true; }}
        onBlur={(e) => { isFocused.current = false; syncToStore(e.target.value); }}
        placeholder={t.skillsPh}
        rows={3}
        className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base md:text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 resize-y"
      />
    </section>
  );
}
