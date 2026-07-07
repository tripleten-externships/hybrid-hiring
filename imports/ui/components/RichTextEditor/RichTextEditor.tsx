import { useRef, useCallback, useEffect } from 'react';
import './RichTextEditor.css';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  id?: string;
  placeholder?: string;
  'aria-label'?: string;
};

type FormatCommand = 'bold' | 'italic' | 'underline' | 'insertUnorderedList' | 'insertOrderedList';

export function RichTextEditor({
  value,
  onChange,
  id,
  placeholder = 'Describe the role, responsibilities, and requirements.',
  'aria-label': ariaLabel = 'Job description',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  const syncValue = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? '';
    isInternalChange.current = true;
    onChange(html);
  }, [onChange]);

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const runCommand = (command: FormatCommand) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    syncValue();
  };

  const handleLink = () => {
    const url = window.prompt('Enter link URL (https://…)');
    if (!url) return;
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed) && !/^mailto:/i.test(trimmed)) {
      window.alert('Please enter a valid http(s) or mailto link.');
      return;
    }
    editorRef.current?.focus();
    document.execCommand('createLink', false, trimmed);
    syncValue();
  };

  const isEmpty = !value || value === '<br>' || value.replace(/<[^>]+>/g, '').trim() === '';

  return (
    <div className="rich-text-editor">
      <div className="rich-text-editor__toolbar" role="toolbar" aria-label="Formatting options">
        <button
          type="button"
          className="rich-text-editor__btn"
          onClick={() => runCommand('bold')}
          aria-label="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className="rich-text-editor__btn"
          onClick={() => runCommand('italic')}
          aria-label="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className="rich-text-editor__btn"
          onClick={() => runCommand('underline')}
          aria-label="Underline"
        >
          <span className="rich-text-editor__underline">U</span>
        </button>
        <span className="rich-text-editor__divider" aria-hidden="true" />
        <button
          type="button"
          className="rich-text-editor__btn"
          onClick={() => runCommand('insertUnorderedList')}
          aria-label="Bullet list"
        >
          •≡
        </button>
        <button
          type="button"
          className="rich-text-editor__btn"
          onClick={() => runCommand('insertOrderedList')}
          aria-label="Numbered list"
        >
          1.
        </button>
        <span className="rich-text-editor__divider" aria-hidden="true" />
        <button
          type="button"
          className="rich-text-editor__btn"
          onClick={handleLink}
          aria-label="Insert link"
        >
          Link
        </button>
      </div>

      <div
        id={id}
        ref={editorRef}
        className={`rich-text-editor__area${isEmpty ? ' rich-text-editor__area--empty' : ''}`}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onInput={syncValue}
        onBlur={syncValue}
      />
    </div>
  );
}
