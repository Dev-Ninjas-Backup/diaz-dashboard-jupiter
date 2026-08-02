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
  const lastSyncedValue = useRef<string>('');

  // Sync external value to Quill instance when loaded asynchronously
  useEffect(() => {
    if (value !== undefined && value !== null && value !== lastSyncedValue.current) {
      const timer = setTimeout(() => {
        if (quillRef.current) {
          const editor = quillRef.current.getEditor();
          if (editor && !editor.hasFocus()) {
            const currentHTML = editor.root.innerHTML.trim();
            const normalizedValue = value.trim();

            // Only update if editor is empty or content differs from what we're trying to set
            if (
              currentHTML === '<p><br></p>' ||
              currentHTML === '' ||
              currentHTML !== normalizedValue
            ) {
              editor.root.innerHTML = value;
              lastSyncedValue.current = value;
            }
          }
        }
      }, 200);
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

  return (
    <div className={`rich-text-editor-wrapper ${className}`}>
      <ReactQuill
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

