'use client'

import { useState, useEffect } from 'react'
import { Plus, Save, Edit, Trash2, FileText, Calendar, Clock, Lock, Upload, CheckCircle } from 'lucide-react'

interface Lecture {
  id: number
  title: string
  description: string
  content: string
  duration: string
  date: string
  type: 'lecture' | 'lab' | 'assignment'
  status: 'published' | 'draft' | 'coming-soon'
}

export default function ContentManagementPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [lectures, setLectures] = useState<Lecture[]>([
    {
      id: 1,
      title: 'Introduction to Applied Physics',
      description: 'Basic concepts and principles of physics',
      content: '# Introduction to Applied Physics\n\nThis is sample content...',
      duration: '90 minutes',
      date: '2024-01-15',
      type: 'lecture',
      status: 'published'
    }
  ])

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishStatus, setPublishStatus] = useState<{ [key: number]: 'idle' | 'publishing' | 'success' | 'error' }>({})
  const [selectedSubject, setSelectedSubject] = useState('applied-physics')
  const [formData, setFormData] = useState<Partial<Lecture>>({
    title: '',
    description: '',
    content: '',
    duration: '90 minutes',
    date: new Date().toISOString().split('T')[0] || '',
    type: 'lecture',
    status: 'draft'
  })

  const subjects = [
    { id: 'applied-physics', name: 'Applied Physics', color: 'from-blue-500 to-blue-600' },
    { id: 'mathematics', name: 'Mathematics', color: 'from-green-500 to-green-600' },
    { id: 'entrepreneurship', name: 'Entrepreneurship', color: 'from-purple-500 to-purple-600' },
    { id: 'information-technology', name: 'Information Technology', color: 'from-cyan-500 to-cyan-600' },
    { id: 'database-systems', name: 'Database Systems', color: 'from-orange-500 to-orange-600' },
    { id: 'english-language', name: 'English Language', color: 'from-red-500 to-red-600' },
    { id: 'information-systems', name: 'Information Systems', color: 'from-indigo-500 to-indigo-600' }
  ]

  // Check authentication on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin-authenticated')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    // Simple password protection - change this password
    if (password === 'cyber2024') {
      setIsAuthenticated(true)
      localStorage.setItem('admin-authenticated', 'true')
    } else {
      alert('Incorrect password!')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin-authenticated')
  }

  const handleSave = () => {
    if (editingId) {
      setLectures(lectures.map(lecture => 
        lecture.id === editingId ? { ...lecture, ...formData } as Lecture : lecture
      ))
    } else {
      const newLecture: Lecture = {
        id: Math.max(...lectures.map(l => l.id)) + 1,
        ...formData
      } as Lecture
      setLectures([...lectures, newLecture])
    }
    
    setIsAddingNew(false)
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      content: '',
      duration: '90 minutes',
      date: new Date().toISOString().split('T')[0] || '',
      type: 'lecture',
      status: 'draft'
    })
  }

  const handleEdit = (lecture: Lecture) => {
    setFormData(lecture)
    setEditingId(lecture.id)
    setIsAddingNew(true)
  }

  const handleDelete = (id: number) => {
    setLectures(lectures.filter(lecture => lecture.id !== id))
  }

  const handlePublish = async (lecture: Lecture) => {
    setIsPublishing(true)
    setPublishStatus(prev => ({ ...prev, [lecture.id]: 'publishing' }))

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'publish_lecture',
          subjectId: selectedSubject,
          lectureData: lecture
        })
      })

      const result = await response.json()

      if (result.success) {
        setPublishStatus(prev => ({ ...prev, [lecture.id]: 'success' }))
        
        // Update lecture status to published
        setLectures(lectures.map(l => 
          l.id === lecture.id ? { ...l, status: 'published' as const } : l
        ))
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setPublishStatus(prev => ({ ...prev, [lecture.id]: 'idle' }))
        }, 3000)
      } else {
        setPublishStatus(prev => ({ ...prev, [lecture.id]: 'error' }))
        alert('Failed to publish lecture: ' + result.message)
      }
    } catch (error) {
      setPublishStatus(prev => ({ ...prev, [lecture.id]: 'error' }))
      alert('Error publishing lecture: ' + error)
    } finally {
      setIsPublishing(false)
    }
  }

  const generateCode = () => {
    const lecturesCode = lectures.map(lecture => `        {
          id: ${lecture.id},
          title: '${lecture.title}',
          description: '${lecture.description}',
          duration: '${lecture.duration}',
          date: '${lecture.date}',
          type: '${lecture.type}',
          status: '${lecture.status}'
        }`).join(',\n')

    return `lectures: [
${lecturesCode}
      ]`
  }

  // Login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="enhanced-card p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyber-neon to-cyber-violet rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-orbitron font-bold text-dark-100 mb-2">
              Admin Access
            </h1>
            <p className="text-dark-300">
              Enter password to access content management
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                placeholder="Enter admin password"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full btn-primary"
            >
              Access Admin Panel
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-dark-400">
              This is a private admin area for content management
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100">
              Content Management
            </h1>
            <button
              onClick={handleLogout}
              className="btn-tertiary p-2 text-red-400 hover:bg-red-400/20"
              title="Logout"
            >
              <Lock className="w-5 h-5" />
            </button>
          </div>
          <p className="text-lg text-dark-300">
            Manage your lecture content and materials
          </p>
        </div>

        {/* Add New Lecture */}
        {!isAddingNew && (
          <div className="text-center mb-8">
            <button
              onClick={() => setIsAddingNew(true)}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Add New Lecture
            </button>
          </div>
        )}

        {/* Lecture Form */}
        {isAddingNew && (
          <div className="enhanced-card p-8 mb-8">
            <h2 className="text-2xl font-semibold text-dark-100 mb-6">
              {editingId ? 'Edit Lecture' : 'Add New Lecture'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                  placeholder="Enter lecture title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                  placeholder="e.g., 90 minutes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Type
                </label>
                <select
                  value={formData.type || 'lecture'}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'lecture' | 'lab' | 'assignment'})}
                  className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                >
                  <option value="lecture">Lecture</option>
                  <option value="lab">Lab</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'published' | 'draft' | 'coming-soon'})}
                  className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="coming-soon">Coming Soon</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                rows={3}
                placeholder="Enter lecture description"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Content (Markdown)
              </label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none font-mono text-sm"
                rows={10}
                placeholder="Enter lecture content in Markdown format..."
              />
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update Lecture' : 'Save Lecture'}
              </button>
              
              {!editingId && (
                <button
                  onClick={async () => {
                    await handleSave()
                    if (formData.title && formData.description && formData.content) {
                      const newLecture: Lecture = {
                        id: Math.max(...lectures.map(l => l.id)) + 1,
                        ...formData
                      } as Lecture
                      await handlePublish(newLecture)
                    }
                  }}
                  className="btn-secondary flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Upload className="w-4 h-4" />
                  Save & Publish
                </button>
              )}
              
              <button
                onClick={() => {
                  setIsAddingNew(false)
                  setEditingId(null)
                  setFormData({
                    title: '',
                    description: '',
                    content: '',
                    duration: '90 minutes',
                    date: new Date().toISOString().split('T')[0] || '',
                    type: 'lecture',
                    status: 'draft'
                  })
                }}
                className="btn-tertiary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Lectures List */}
        <div className="enhanced-card p-6">
          <h2 className="text-2xl font-semibold text-dark-100 mb-6">
            Current Lectures
          </h2>
          
          <div className="space-y-4">
            {lectures.map((lecture) => (
              <div key={lecture.id} className="flex items-center justify-between p-4 bg-cyber-dark/50 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark-100 mb-1">
                    {lecture.title}
                  </h3>
                  <p className="text-dark-300 text-sm mb-2">
                    {lecture.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-dark-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lecture.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {lecture.date}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      lecture.status === 'published' ? 'bg-green-400/20 text-green-400' :
                      lecture.status === 'draft' ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-blue-400/20 text-blue-400'
                    }`}>
                      {lecture.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {lecture.status !== 'published' && (
                    <button
                      onClick={() => handlePublish(lecture)}
                      disabled={isPublishing || publishStatus[lecture.id] === 'publishing'}
                      className={`btn-primary p-2 flex items-center gap-1 ${
                        publishStatus[lecture.id] === 'success' ? 'bg-green-600' : ''
                      } ${
                        publishStatus[lecture.id] === 'error' ? 'bg-red-600' : ''
                      }`}
                      title="Publish Lecture"
                    >
                      {publishStatus[lecture.id] === 'publishing' ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : publishStatus[lecture.id] === 'success' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleEdit(lecture)}
                    className="btn-tertiary p-2"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(lecture.id)}
                    className="btn-tertiary p-2 text-red-400 hover:bg-red-400/20"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Generation */}
        <div className="mt-8 enhanced-card p-6">
          <h2 className="text-2xl font-semibold text-dark-100 mb-4">
            Generated Code
          </h2>
          <p className="text-dark-300 mb-4">
            Copy this code and paste it into your subject page file:
          </p>
          
          <div className="bg-cyber-dark/80 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm text-cyber-neon font-mono">
              <code>{generateCode()}</code>
            </pre>
          </div>
          
          <button
            onClick={() => navigator.clipboard.writeText(generateCode())}
            className="btn-secondary mt-4 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Copy Code
          </button>
        </div>
      </div>
    </div>
  )
}
