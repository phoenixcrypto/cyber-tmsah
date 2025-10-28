'use client'

import { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Quote, Link, Image, Code, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Eye } from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder = "Start writing your article..." }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState<string[]>([content])
  const [historyIndex, setHistoryIndex] = useState(0)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      onChange(newContent)
      
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newContent)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex] || '')
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex] || ''
      }
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex] || '')
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex] || ''
      }
    }
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      executeCommand('insertImage', url)
    }
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      executeCommand('createLink', url)
    }
  }

  const togglePreview = () => {
    setIsPreview(!isPreview)
  }

  return (
    <div className="border border-cyber-neon/20 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-cyber-dark/50 p-3 border-b border-cyber-neon/20 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIndex === 0}
            className="btn-tertiary p-2 disabled:opacity-50"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="btn-tertiary p-2 disabled:opacity-50"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-cyber-neon/20 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => executeCommand('bold')}
            className="btn-tertiary p-2"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('italic')}
            className="btn-tertiary p-2"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('underline')}
            className="btn-tertiary p-2"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-cyber-neon/20 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => executeCommand('insertUnorderedList')}
            className="btn-tertiary p-2"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('insertOrderedList')}
            className="btn-tertiary p-2"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('formatBlock', 'blockquote')}
            className="btn-tertiary p-2"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-cyber-neon/20 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={insertLink}
            className="btn-tertiary p-2"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            onClick={insertImage}
            className="btn-tertiary p-2"
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('formatBlock', 'pre')}
            className="btn-tertiary p-2"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-cyber-neon/20 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => executeCommand('justifyLeft')}
            className="btn-tertiary p-2"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyCenter')}
            className="btn-tertiary p-2"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyRight')}
            className="btn-tertiary p-2"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={togglePreview}
            className={`btn-tertiary p-2 ${isPreview ? 'bg-cyber-neon/20 text-cyber-neon' : ''}`}
            title="Toggle Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-6 min-h-[400px] prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="p-6 min-h-[400px] focus:outline-none text-dark-100"
            style={{ 
              lineHeight: '1.6',
              fontSize: '16px'
            }}
            onInput={updateContent}
            suppressContentEditableWarning={true}
            data-placeholder={placeholder}
          />
        )}
      </div>
    </div>
  )
}
