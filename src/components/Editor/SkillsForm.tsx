import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';

/** Split raw text into skill names */
function parseSkills(text: string): string[] {
  return text
    .split(/[,，、\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * SkillsForm — 技能专长编辑
 * 用户在文本框中自由输入，用顿号、逗号或换行分隔。
 * 失焦时同步到 store。
 */
export default function SkillsForm() {
  const skills = useResumeStore((s) => s.resumeData.skills);
  const addSkill = useResumeStore((s) => s.addSkill);
  const removeSkill = useResumeStore((s) => s.removeSkill);

  const [text, setText] = useState(() => skills.map((s) => s.name).join('、'));
  const isFocused = useRef(false);

  // When store changes externally (e.g. import), update local text — but only when not focused
  useEffect(() => {
    if (!isFocused.current) {
      setText(skills.map((s) => s.name).join('、'));
    }
  }, [skills]);

  const syncToStore = (value: string) => {
    const newNames = parseSkills(value);
    // Remove skills not in the new list
    for (const skill of useResumeStore.getState().resumeData.skills) {
      if (!newNames.includes(skill.name)) {
        removeSkill(skill.id);
      }
    }
    // Add new skills
    const existing = new Set(useResumeStore.getState().resumeData.skills.map((s) => s.name));
    for (const name of newNames) {
      if (!existing.has(name)) {
        addSkill(name);
      }
    }
  };

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">技能专长</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => { isFocused.current = true; }}
        onBlur={(e) => {
          isFocused.current = false;
          syncToStore(e.target.value);
        }}
        placeholder="输入技能，用顿号、逗号或换行分隔，如：React、TypeScript、Node.js"
        rows={3}
        className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 resize-y"
      />
    </section>
  );
}
