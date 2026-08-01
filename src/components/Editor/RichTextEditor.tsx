import React, { useEffect, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './editor.css';
import type { RichTextEditorProps } from '@/types/textEditor';

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your content...',
  className = '',
  readOnly = false,
  theme = 'snow',
  minHeight = 'auto',
}) => {
  const quillRef = useRef<ReactQuill>(null);

  // Sync external value to Quill instance when loaded asynchronously
  useEffect(() => {
    if (value !== undefined && value !== null) {
      const timer = setTimeout(() => {
        if (quillRef.current) {
          const editor = quillRef.current.getEditor();
          if (editor) {
            const currentHTML = editor.root.innerHTML;
            const normalizedValue = value.trim();
            const normalizedCurrent = currentHTML.trim();

            if (
              normalizedCurrent === '<p><br></p>' ||
              normalizedCurrent === '' ||
              (normalizedCurrent !== normalizedValue && !editor.hasFocus())
            ) {
              try {
                editor.clipboard.dangerouslyPasteHTML(0, value);
              } catch {
                editor.root.innerHTML = value;
              }
            }
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [value]);

  // Configure Quill modules with optimized toolbar
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          [{ direction: 'rtl' }, { align: [] }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video'],
          ['clean'],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  // Configure Quill formats
  const formats = useMemo(
    () => [
      'header',
      'font',
      'size',
      'bold',
      'italic',
      'underline',
      'strike',
      'color',
      'background',
      'script',
      'list',
      'indent',
      'direction',
      'align',
      'blockquote',
      'code-block',
      'link',
      'image',
      'video',
    ],
    [],
  );

  const hasContent = Boolean(
    value && value.trim() !== '' && value.trim() !== '<p><br></p>',
  );

  return (
    <div className={`rich-text-editor-wrapper ${className}`}>
      <ReactQuill
        key={hasContent ? 'content-populated' : 'content-empty'}
        ref={quillRef}
        theme={theme}
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{ minHeight }}
      />
    </div>
  );
};

export default RichTextEditor;
