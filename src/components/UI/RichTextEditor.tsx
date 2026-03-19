import { useRef, useCallback, useEffect } from 'react';
import { useLocale } from '../../hooks/useLocale';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = '', minHeight = '80px' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);
  const { t } = useLocale();

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) el.innerHTML = value;
  }, [value]);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    onChange(el.innerHTML);
  }, [onChange]);

  const exec = useCallback((cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    editorRef.current?.focus();
    emitChange();
  }, [emitChange]);

  const handleBold = useCallback(() => exec('bold'), [exec]);
  const handleItalic = useCallback(() => exec('italic'), [exec]);
  const handleUnderline = useCallback(() => exec('underline'), [exec]);
  const handleLink = useCallback(() => {
    const url = window.prompt(t.linkPrompt, 'https://');
    if (url) exec('createLink', url);
  }, [exec, t]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); handleBold(); break;
        case 'i': e.preventDefault(); handleItalic(); break;
        case 'u': e.preventDefault(); handleUnderline(); break;
        case 'k': e.preventDefault(); handleLink(); break;
      }
    }
  }, [handleBold, handleItalic, handleUnderline, handleLink]);

  // 粘贴时去除富文本格式，并清理多余空行
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    let text = e.clipboardData.getData('text/plain');
    // 将连续多个空行合并为单个换行
    text = text.replace(/\n{3,}/g, '\n\n').replace(/^\n+|\n+$/g, '');
    document.execCommand('insertText', false, text);
    emitChange();
  }, [emitChange]);

  const btnCls = 'flex items-center justify-center w-7 h-7 rounded text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors select-none';

  return (
    <div className="rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden bg-white dark:bg-gray-800 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      <div className="flex items-center gap-0.5 px-2 py-1 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
        <button type="button" onClick={handleBold} className={btnCls} title={`${t.bold} (Ctrl+B)`} aria-label={t.bold}><span className="font-bold">B</span></button>
        <button type="button" onClick={handleItalic} className={btnCls} title={`${t.italic} (Ctrl+I)`} aria-label={t.italic}><span className="italic">I</span></button>
        <button type="button" onClick={handleUnderline} className={btnCls} title={`${t.underline} (Ctrl+U)`} aria-label={t.underline}><span className="underline">U</span></button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-500 mx-1" />
        <button type="button" onClick={handleLink} className={btnCls} title={`${t.insertLink} (Ctrl+K)`} aria-label={t.insertLink}>🔗</button>
      </div>
      <div ref={editorRef} contentEditable role="textbox" aria-multiline="true" aria-placeholder={placeholder} data-placeholder={placeholder}
        className="px-3 py-2 text-sm outline-none dark:text-gray-100 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:dark:text-gray-500 empty:before:pointer-events-none [&_a]:text-blue-600 [&_a]:underline"
        style={{ minHeight }}
        onInput={() => { if (!isComposing.current) emitChange(); }}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => { isComposing.current = false; emitChange(); }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste} />
    </div>
  );
}
