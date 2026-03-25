import { useState } from 'react';

interface TutorialCardProps {
  title: string;
  content: string;
}

export default function TutorialCard({ title, content }: TutorialCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-2 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 min-h-[44px] text-left text-sm font-medium text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
        aria-expanded={expanded}
      >
        <span>{title}</span>
        <span className="ml-2 text-gray-500 dark:text-gray-400" aria-hidden="true">
          {expanded ? '▼' : '▶'}
        </span>
      </button>
      {expanded && (
        <div className="px-4 pb-3 text-sm text-gray-600 leading-relaxed break-words dark:text-gray-300">
          {content}
        </div>
      )}
    </div>
  );
}
