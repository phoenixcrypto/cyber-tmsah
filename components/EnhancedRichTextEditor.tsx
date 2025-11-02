'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Bold, Italic, Underline, List, ListOrdered, Quote, Link, Image, Code, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, Eye, 
  Heading1, Heading2, Heading3, Minus, Save
} from 'lucide-react'

interface EnhancedRichTextEditorProps {
  content: string
  onChange: (content: string) => void
  onAutoSave?: (content: string) => void
  placeholder?: string
  minHeight?: number
  onImageUpload?: (file: File) => Promise<string>
}

export default function EnhancedRichTextEditor({ 
  content, 
  onChange, 
  onAutoSave,
  placeholder = "Start writing your article...", 
  minHeight = 500,
  onImageUpload
}: EnhancedRichTextEditorProps) {
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual')
  const [isPreview, setIsPreview] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState<string[]>([content])
  const [historyIndex, setHistoryIndex] = useState(0)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate statistics
  const calculateStats = useCallback((text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '').trim()
    const words = plainText.split(/\s+/).filter(word => word.length > 0)
    const chars = plainText.length
    const wordsCount = words.length
    const readingTimeMinutes = Math.ceil(wordsCount / 200) // Average reading speed: 200 words/minute

    setWordCount(wordsCount)
    setCharCount(chars)
    setReadingTime(readingTimeMinutes)
  }, [])

  // Update content and statistics
  const updateContent = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      onChange(newContent)
      calculateStats(newContent)

      // Add to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newContent)
      if (newHistory.length > 50) newHistory.shift() // Limit history
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)

      // Auto-save
      if (onAutoSave && newContent.trim()) {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current)
        }
        
        setIsSaving(true)
        autoSaveTimeoutRef.current = setTimeout(() => {
          onAutoSave(newContent)
          setLastSaved(new Date())
          setIsSaving(false)
        }, 2000) // Auto-save after 2 seconds of inactivity
      }
    }
  }, [onChange, onAutoSave, history, historyIndex, calculateStats])

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
      calculateStats(content)
    }
  }, [content, calculateStats])

  useEffect(() => {
    calculateStats(content)
  }, [content, calculateStats])

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const previousContent = history[newIndex] || ''
      onChange(previousContent)
      if (editorRef.current) {
        editorRef.current.innerHTML = previousContent
      }
      calculateStats(previousContent)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const nextContent = history[newIndex] || ''
      onChange(nextContent)
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent
      }
      calculateStats(nextContent)
    }
  }

  const convertToWebP = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }
          
          // Calculate optimal size (max 1200px width)
          let width = img.width
          let height = img.height
          if (width > 1200) {
            height = (height * 1200) / width
            width = 1200
          }
          
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          
          // Convert to WebP
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to convert to WebP'))
                return
              }
              
              const reader = new FileReader()
              reader.onload = () => {
                resolve(reader.result as string)
              }
              reader.onerror = () => reject(new Error('Failed to read WebP'))
              reader.readAsDataURL(blob)
            },
            'image/webp',
            0.85 // Quality: 85%
          )
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const insertImage = async () => {
    // Try file upload first if available
    if (onImageUpload) {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          try {
            // Convert to WebP client-side first
            const webpDataUrl = await convertToWebP(file)
            // Then upload if needed (or use directly)
            const imageUrl = await onImageUpload(file).catch(() => webpDataUrl) || webpDataUrl
            executeCommand('insertImage', imageUrl)
          } catch (error) {
            console.error('Image conversion error:', error)
            alert('Failed to process image. Please try again.')
          }
        }
      }
      input.click()
    } else {
      // Fallback to URL input
      const url = prompt('Enter image URL:')
      if (url) {
        executeCommand('insertImage', url)
      }
    }
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    const text = window.getSelection()?.toString() || prompt('Enter link text:')
    if (url && text) {
      executeCommand('createLink', url)
    }
  }

  const insertHeading = (level: 1 | 2 | 3) => {
    executeCommand('formatBlock', `h${level}`)
  }

  const togglePreview = () => {
    setIsPreview(!isPreview)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault()
            executeCommand('bold')
            break
          case 'i':
            e.preventDefault()
            executeCommand('italic')
            break
          case 'u':
            e.preventDefault()
            executeCommand('underline')
            break
          case 'z':
            if (!e.shiftKey) {
              e.preventDefault()
              undo()
            }
            break
          case 'y':
            e.preventDefault()
            redo()
            break
          case 's':
            e.preventDefault()
            if (onAutoSave && editorRef.current) {
              onAutoSave(editorRef.current.innerHTML)
              setLastSaved(new Date())
            }
            break
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key === 'Z') {
          e.preventDefault()
          redo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onAutoSave])

  return (
    <div className="border border-cyber-neon/20 rounded-lg overflow-hidden">
      {/* Enhanced Toolbar */}
      <div className="bg-cyber-dark/80 backdrop-blur-sm p-3 border-b border-cyber-neon/20">
        {/* Main Toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={historyIndex === 0}
              className="btn-tertiary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="btn-tertiary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-cyber-neon/20 mx-1" />

          {/* Headings */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => insertHeading(1)}
              className="btn-tertiary p-2"
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertHeading(2)}
              className="btn-tertiary p-2"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertHeading(3)}
              className="btn-tertiary p-2"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-cyber-neon/20 mx-1" />

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => executeCommand('bold')}
              className="btn-tertiary p-2"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('italic')}
              className="btn-tertiary p-2"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('underline')}
              className="btn-tertiary p-2"
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-cyber-neon/20 mx-1" />

          {/* Lists */}
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
              onClick={() => executeCommand('insertHorizontalRule')}
              className="btn-tertiary p-2"
              title="Horizontal Line"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-cyber-neon/20 mx-1" />

          {/* Quote & Code */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => executeCommand('formatBlock', 'blockquote')}
              className="btn-tertiary p-2"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('formatBlock', 'pre')}
              className="btn-tertiary p-2"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-cyber-neon/20 mx-1" />

          {/* Links & Images */}
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
          </div>

          <div className="w-px h-6 bg-cyber-neon/20 mx-1" />

          {/* Alignment */}
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
            <button
              onClick={() => executeCommand('justifyFull')}
              className="btn-tertiary p-2"
              title="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Editor Mode Toggle */}
            <div className="flex items-center gap-1 bg-cyber-dark/50 rounded-lg p-1">
              <button
                onClick={() => setEditorMode('visual')}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  editorMode === 'visual' 
                    ? 'bg-cyber-neon/20 text-cyber-neon' 
                    : 'text-dark-400 hover:text-dark-200'
                }`}
                title="Visual Editor"
              >
                Visual
              </button>
              <button
                onClick={() => setEditorMode('html')}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  editorMode === 'html' 
                    ? 'bg-cyber-neon/20 text-cyber-neon' 
                    : 'text-dark-400 hover:text-dark-200'
                }`}
                title="HTML Editor"
              >
                HTML
              </button>
            </div>

            <button
              onClick={togglePreview}
              className={`btn-tertiary p-2 ${isPreview ? 'bg-cyber-neon/20 text-cyber-neon' : ''}`}
              title="Toggle Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            {onAutoSave && (
              <button
                onClick={() => {
                  if (editorRef.current) {
                    onAutoSave(editorRef.current.innerHTML)
                    setLastSaved(new Date())
                  }
                }}
                className="btn-tertiary p-2"
                title="Save Now (Ctrl+S)"
              >
                <Save className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="flex items-center justify-between text-xs text-dark-400 pt-2 border-t border-cyber-neon/10">
          <div className="flex items-center gap-4">
            <span>Words: <strong className="text-cyber-neon">{wordCount.toLocaleString()}</strong></span>
            <span>Characters: <strong className="text-cyber-neon">{charCount.toLocaleString()}</strong></span>
            <span>Reading time: <strong className="text-cyber-neon">{readingTime} min</strong></span>
          </div>
          <div className="flex items-center gap-2">
            {isSaving && (
              <span className="text-yellow-400 flex items-center gap-1">
                <Save className="w-3 h-3 animate-spin" />
                Saving...
              </span>
            )}
            {lastSaved && !isSaving && (
              <span className="text-green-400">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-6 min-h-[400px] prose prose-invert max-w-none bg-cyber-dark/30"
            style={{ minHeight: `${minHeight}px` }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : editorMode === 'html' ? (
          <textarea
            value={content}
            onChange={(e) => {
              onChange(e.target.value)
              calculateStats(e.target.value)
            }}
            className="w-full p-6 bg-cyber-dark border-0 focus:outline-none text-dark-100 font-mono text-sm"
            style={{ 
              minHeight: `${minHeight}px`,
              lineHeight: '1.6',
              resize: 'vertical'
            }}
            placeholder="Write HTML code here..."
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="p-6 focus:outline-none text-dark-100 prose prose-invert max-w-none"
            style={{ 
              minHeight: `${minHeight}px`,
              lineHeight: '1.8',
              fontSize: '16px'
            }}
            onInput={updateContent}
            suppressContentEditableWarning={true}
            data-placeholder={placeholder}
          />
        )}
      </div>

      {/* Placeholder CSS */}
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
          position: absolute;
        }
      `}</style>
    </div>
  )
}

