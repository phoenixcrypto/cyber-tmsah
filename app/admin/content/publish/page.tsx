'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react'

export default function PublishContentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [contentType, setContentType] = useState<'article' | 'task'>('article')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    subjectId: '',
    isGeneral: false,
    targetSections: [] as number[],
    targetGroups: [] as string[],
    dueDate: '',
    files: [] as File[],
    sendNotification: false,
    notificationTiming: 'immediate' as 'immediate' | 'scheduled',
    scheduledDate: '',
    scheduledTime: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const sections = Array.from({ length: 15 }, (_, i) => i + 1)
  const groups = ['Group 1', 'Group 2']

  const handleSectionToggle = (section: number) => {
    setFormData(prev => ({
      ...prev,
      targetSections: prev.targetSections.includes(section)
        ? prev.targetSections.filter(s => s !== section)
        : [...prev.targetSections, section]
    }))
  }

  const handleGroupToggle = (group: string) => {
    setFormData(prev => ({
      ...prev,
      targetGroups: prev.targetGroups.includes(group)
        ? prev.targetGroups.filter(g => g !== group)
        : [...prev.targetGroups, group]
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      if (file.size > 4 * 1024 * 1024) {
        setError(`File ${file.name} exceeds 4MB limit`)
        return false
      }
      return true
    })

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }))
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validate
      if (!formData.title || !formData.description) {
        setError('Title and description are required')
        setLoading(false)
        return
      }

      if (!formData.isGeneral && formData.targetSections.length === 0 && formData.targetGroups.length === 0) {
        setError('Please select at least one section or group, or mark as general content')
        setLoading(false)
        return
      }

      if (contentType === 'task' && !formData.dueDate) {
        setError('Due date is required for tasks')
        setLoading(false)
        return
      }

      // Prepare data
      const payload: any = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        subjectId: formData.subjectId || null,
        isGeneral: formData.isGeneral,
        targetSections: formData.isGeneral ? null : formData.targetSections,
        targetGroups: formData.isGeneral ? null : formData.targetGroups,
        sendNotification: formData.sendNotification,
        notificationTiming: formData.notificationTiming,
      }

      if (contentType === 'task') {
        payload.dueDate = formData.dueDate
      }

      // Upload files first (if any)
      const fileUrls: string[] = []
      if (formData.files.length > 0) {
        // TODO: Upload files to Supabase Storage
        // For now, skip file upload
      }
      payload.files = fileUrls

      // Submit
      const endpoint = contentType === 'article' ? '/api/admin/content/publish/article' : '/api/admin/content/publish/task'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(`${contentType === 'article' ? 'Article' : 'Task'} published successfully!`)
        // Reset form
        setFormData({
          title: '',
          description: '',
          content: '',
          subjectId: '',
          isGeneral: false,
          targetSections: [],
          targetGroups: [],
          dueDate: '',
          files: [],
          sendNotification: false,
          notificationTiming: 'immediate',
          scheduledDate: '',
          scheduledTime: '',
        })
        
        setTimeout(() => {
          router.push('/admin')
        }, 2000)
      } else {
        setError(data.error || 'Failed to publish content')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-2">
            Publish Content
          </h1>
          <p className="text-dark-300">
            Create and publish articles or tasks with section targeting
          </p>
        </div>

        <div className="enhanced-card p-8 animate-slide-up">
          {/* Content Type Toggle */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setContentType('article')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                contentType === 'article'
                  ? 'bg-cyber-green text-dark-100'
                  : 'bg-cyber-dark/50 text-dark-300 hover:bg-cyber-dark'
              }`}
            >
              Article
            </button>
            <button
              onClick={() => setContentType('task')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                contentType === 'task'
                  ? 'bg-cyber-violet text-dark-100'
                  : 'bg-cyber-dark/50 text-dark-300 hover:bg-cyber-dark'
              }`}
            >
              Task
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                placeholder="Enter title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                rows={3}
                placeholder="Enter description"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                rows={10}
                placeholder="Enter content (HTML supported)"
              />
            </div>

            {/* Due Date (for tasks) */}
            {contentType === 'task' && (
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                />
              </div>
            )}

            {/* Subject (Optional) */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Subject (Optional)
              </label>
              <input
                type="text"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
                placeholder="Subject ID (optional)"
              />
            </div>

            {/* General Content Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isGeneral}
                onChange={(e) => setFormData({ ...formData, isGeneral: e.target.checked })}
                className="w-4 h-4 bg-cyber-dark border-cyber-neon/30 rounded text-cyber-neon focus:ring-cyber-neon/50"
              />
              <label className="text-sm text-dark-300">
                General content (visible to all sections)
              </label>
            </div>

            {/* Section Selection */}
            {!formData.isGeneral && (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Select Sections
                  </label>
                  <div className="grid grid-cols-5 gap-2 p-4 bg-cyber-dark/50 rounded-lg border border-cyber-neon/20">
                    {sections.map(section => (
                      <button
                        key={section}
                        type="button"
                        onClick={() => handleSectionToggle(section)}
                        className={`p-2 rounded text-sm font-semibold transition-colors ${
                          formData.targetSections.includes(section)
                            ? 'bg-cyber-neon text-dark-100'
                            : 'bg-cyber-dark text-dark-300 hover:bg-cyber-dark/70'
                        }`}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Group Selection */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Select Groups
                  </label>
                  <div className="flex gap-2">
                    {groups.map(group => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => handleGroupToggle(group)}
                        className={`px-4 py-2 rounded font-semibold transition-colors ${
                          formData.targetGroups.includes(group)
                            ? 'bg-cyber-neon text-dark-100'
                            : 'bg-cyber-dark text-dark-300 hover:bg-cyber-dark/70'
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Files (Max 4MB each)
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="w-full p-3 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon/50"
              />
              {formData.files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-cyber-dark/50 rounded">
                      <span className="text-sm text-dark-300">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Settings */}
            <div className="p-4 bg-cyber-dark/50 rounded-lg border border-cyber-neon/20">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={formData.sendNotification}
                  onChange={(e) => setFormData({ ...formData, sendNotification: e.target.checked })}
                  className="w-4 h-4 bg-cyber-dark border-cyber-neon/30 rounded text-cyber-neon focus:ring-cyber-neon/50"
                />
                <label className="text-sm font-medium text-dark-300">
                  Send Notification
                </label>
              </div>

              {formData.sendNotification && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.notificationTiming === 'immediate'}
                        onChange={() => setFormData({ ...formData, notificationTiming: 'immediate' })}
                        className="w-4 h-4 bg-cyber-dark border-cyber-neon/30 rounded text-cyber-neon focus:ring-cyber-neon/50"
                      />
                      <span className="text-sm text-dark-300">Send immediately</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.notificationTiming === 'scheduled'}
                        onChange={() => setFormData({ ...formData, notificationTiming: 'scheduled' })}
                        className="w-4 h-4 bg-cyber-dark border-cyber-neon/30 rounded text-cyber-neon focus:ring-cyber-neon/50"
                      />
                      <span className="text-sm text-dark-300">Schedule for later</span>
                    </label>
                  </div>

                  {formData.notificationTiming === 'scheduled' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={formData.scheduledDate}
                          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                          className="w-full p-2 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                          Time
                        </label>
                        <input
                          type="time"
                          value={formData.scheduledTime}
                          onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                          className="w-full p-2 bg-cyber-dark border border-cyber-neon/30 rounded-lg text-dark-100 focus:border-cyber-neon"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-cyber-green/20 border border-cyber-green/50 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
                <p className="text-cyber-green text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Publish {contentType === 'article' ? 'Article' : 'Task'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

