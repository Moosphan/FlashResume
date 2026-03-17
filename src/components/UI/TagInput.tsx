import { useState, type KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
}

export default function TagInput({ tags, onAdd, onRemove, placeholder = '输入后按回车添加' }: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    if (tags.includes(value)) {
      setInput('');
      return;
    }
    onAdd(value);
    setInput('');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-800">
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary dark:bg-primary/20"
        >
          {tag}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="inline-flex h-[44px] w-[44px] -mr-2 items-center justify-center rounded-full text-primary hover:bg-primary/20 transition-colors duration-150"
            aria-label={`删除标签 ${tag}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="min-h-[44px] min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
    </div>
  );
}
