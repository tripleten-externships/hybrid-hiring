import { useEffect, useMemo, type ReactNode } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './RichTextEditor.css';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  id?: string;
  placeholder?: string;
  'aria-label'?: string;
};

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function ToolbarButton({ label, active = false, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`rich-text-editor__btn${active ? ' rich-text-editor__btn--active' : ''}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  id,
  placeholder = 'Describe the role, responsibilities, and requirements.',
  'aria-label': ariaLabel = 'Job description',
}: RichTextEditorProps) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: false,
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        },
      }),
    ],
    []
  );

  const editor = useEditor({
    extensions,
    content: value,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class: 'rich-text-editor__content',
        'aria-label': ariaLabel,
        'data-placeholder': placeholder,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const handleLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter link URL (https://…)', previousUrl ?? '');
    if (url === null) return;

    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    if (!/^https?:\/\//i.test(trimmed) && !/^mailto:/i.test(trimmed)) {
      window.alert('Please enter a valid http(s) or mailto link.');
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run();
  };

  const isEmpty = !value || value === '<p></p>' || value.replace(/<[^>]+>/g, '').trim() === '';

  return (
    <div className={`rich-text-editor${isEmpty ? ' rich-text-editor--empty' : ''}`}>
      <div
        className="rich-text-editor__toolbar"
        role="toolbar"
        aria-label="Formatting options"
        onMouseDown={(e) => e.preventDefault()}
      >
        <ToolbarButton
          label="Bold"
          active={editor?.isActive('bold') ?? false}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor?.isActive('italic') ?? false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={editor?.isActive('underline') ?? false}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <span className="rich-text-editor__underline">U</span>
        </ToolbarButton>
        <span className="rich-text-editor__divider" aria-hidden="true" />
        <ToolbarButton
          label="Bullet list"
          active={editor?.isActive('bulletList') ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          •≡
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor?.isActive('orderedList') ?? false}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <span className="rich-text-editor__divider" aria-hidden="true" />
        <ToolbarButton
          label="Insert link"
          active={editor?.isActive('link') ?? false}
          onClick={handleLink}
        >
          Link
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
