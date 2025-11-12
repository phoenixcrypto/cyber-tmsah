'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function UploadMaterialsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subjectId: '',
    excerpt: '',
    tags: '',
    type: 'lecture',
    apiKey: '',
  })

  const subjects = [
    { id: 'applied-physics', name: 'Applied Physics' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'entrepreneurship', name: 'Entrepreneurship & Creative Thinking' },
    { id: 'information-technology', name: 'Information Technology' },
    { id: 'database-systems', name: 'Database Systems' },
    { id: 'english-language', name: 'English Language' },
    { id: 'information-systems', name: 'Information Systems' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': formData.apiKey,
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          subjectId: formData.subjectId,
          excerpt: formData.excerpt || formData.title,
          tags: tagsArray,
          type: formData.type,
          isGeneral: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to upload material')
      }

      await response.json()
      setMessage({ type: 'success', text: 'Material uploaded successfully!' })
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        subjectId: '',
        excerpt: '',
        tags: '',
        type: 'lecture',
        apiKey: formData.apiKey, // Keep API key
      })

      // Redirect to materials page after 2 seconds
      setTimeout(() => {
        router.push('/materials')
      }, 2000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to upload material',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/materials"
            className="inline-flex items-center gap-2 text-cyber-neon hover:text-cyber-green transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Materials
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyber-neon to-cyber-green rounded-2xl flex items-center justify-center shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100">
                Upload Material
              </h1>
              <p className="text-lg text-dark-300">Add new learning materials to the platform</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-cyber-green/20 border border-cyber-green/50'
              : 'bg-red-500/20 border border-red-500/50'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.type === 'success' ? 'text-cyber-green' : 'text-red-300'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="enhanced-card p-6 space-y-6">
          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              API Key <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              required
              className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon transition-colors"
              placeholder="Enter API key"
            />
            <p className="mt-1 text-xs text-dark-400">
              API key is required to upload materials. Contact administrator for access.
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon transition-colors"
              placeholder="Enter material title"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Subject <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              required
              className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon transition-colors"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Type <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon transition-colors"
            >
              <option value="lecture">Lecture</option>
              <option value="lab">Lab</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon transition-colors"
              placeholder="Enter a brief description (optional)"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon transition-colors"
              placeholder="Enter tags separated by commas (e.g., chapter1, basics, introduction)"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={15}
              className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon transition-colors font-mono text-sm"
              placeholder="Enter material content (markdown supported)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Material
                </>
              )}
            </button>

            <Link
              href="/materials"
              className="btn-secondary px-6 py-3"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

