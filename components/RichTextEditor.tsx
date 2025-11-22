'use client'

import { useMemo, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Code, Type } from 'lucide-react'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
  language?: 'ar' | 'en'
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'اكتب محتوى المقال هنا...',
  height = '400px',
  language = 'ar',
}: RichTextEditorProps) {
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual')

  // Configure Quill modules
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ direction: 'rtl' }, { direction: 'ltr' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: {
          // Custom handlers can be added here
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  )

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'script',
    'direction',
    'color',
    'background',
    'align',
    'link',
    'image',
    'video',
  ]

  // Custom styles for Quill editor
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .quill {
        background: rgba(15, 23, 42, 0.8);
        border-radius: 0.75rem;
        border: 2px solid rgba(0, 255, 255, 0.3);
      }
      .ql-container {
        font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 16px;
        color: #e2e8f0;
        min-height: ${height};
        direction: ${language === 'ar' ? 'rtl' : 'ltr'};
      }
      .ql-editor {
        min-height: ${height};
        color: #e2e8f0;
        line-height: 1.8;
      }
      .ql-editor.ql-blank::before {
        color: #94a3b8;
        font-style: normal;
      }
      .ql-toolbar {
        background: rgba(15, 23, 42, 0.6);
        border-top-left-radius: 0.75rem;
        border-top-right-radius: 0.75rem;
        border-bottom: 2px solid rgba(0, 255, 255, 0.3);
        padding: 12px;
      }
      .ql-toolbar .ql-stroke {
        stroke: #0ff;
      }
      .ql-toolbar .ql-fill {
        fill: #0ff;
      }
      .ql-toolbar button:hover,
      .ql-toolbar button.ql-active {
        color: #0ff;
      }
      .ql-toolbar .ql-picker-label {
        color: #e2e8f0;
      }
      .ql-toolbar .ql-picker-options {
        background: rgba(15, 23, 42, 0.95);
        border: 2px solid rgba(0, 255, 255, 0.3);
        border-radius: 0.5rem;
      }
      .ql-toolbar .ql-picker-item {
        color: #e2e8f0;
      }
      .ql-toolbar .ql-picker-item:hover {
        background: rgba(0, 255, 255, 0.2);
        color: #0ff;
      }
      .ql-snow .ql-picker {
        color: #e2e8f0;
      }
      .ql-snow .ql-stroke {
        stroke: #e2e8f0;
      }
      .ql-snow .ql-fill {
        fill: #e2e8f0;
      }
      .ql-snow .ql-picker-options {
        background: rgba(15, 23, 42, 0.95);
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [height, language])

  return (
    <div className="space-y-2">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-dark-200">
            {language === 'ar' ? 'وضع التحرير:' : 'Editor Mode:'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditorMode('visual')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              editorMode === 'visual'
                ? 'bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100'
                : 'bg-cyber-dark/50 text-dark-300 hover:bg-cyber-dark/70'
            }`}
          >
            <Type className="w-4 h-4" />
            {language === 'ar' ? 'المحرر' : 'Visual'}
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('html')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              editorMode === 'html'
                ? 'bg-gradient-to-r from-cyber-neon to-cyber-green text-dark-100'
                : 'bg-cyber-dark/50 text-dark-300 hover:bg-cyber-dark/70'
            }`}
          >
            <Code className="w-4 h-4" />
            HTML
          </button>
        </div>
      </div>

      {/* Editor */}
      {editorMode === 'visual' ? (
        <div className="rich-text-editor-wrapper">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
          />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-cyber-dark/80 border-2 border-cyber-neon/30 rounded-xl text-dark-100 focus:border-cyber-neon focus:outline-none focus:ring-4 focus:ring-cyber-neon/20 transition-all duration-300 font-mono text-sm"
          style={{ minHeight: height, direction: language === 'ar' ? 'rtl' : 'ltr' }}
        />
      )}
    </div>
  )
}

