'use client'

import { useState, useEffect } from 'react'
import { Plus, Save, Edit, Trash2, FileText, Calendar, Clock, Lock, Search, Eye, BarChart3, RefreshCw, X, Zap, SortAsc, SortDesc } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'

interface Article {
  id: string
  title: string
  description: string
  content: string
  subjectId: string
  subjectName: string
  instructor: string
  duration: string
  date: string
  type: 'lecture' | 'lab' | 'assignment'
  status: 'published' | 'draft' | 'archived' | 'scheduled'
  publishedAt: string
  lastModified: string
  views: number
  likes: number
  tags: string[]
  featured: boolean
  scheduledFor?: string
  imageUrl?: string
  excerpt: string
}

export default function ContentManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  
  // Articles state
  const [articles, setArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubject, setFilterSubject] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views' | 'likes'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  // UI state
  const [showStats, setShowStats] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showArticleModal, setShowArticleModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    description: '',
    content: '',
    subjectId: 'applied-physics',
    instructor: '',
    duration: '90 minutes',
    date: new Date().toISOString().split('T')[0] || '',
    type: 'lecture',
    status: 'draft',
    tags: [],
    featured: false,
    excerpt: ''
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

  // Check authentication
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin-authenticated')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
      loadArticles()
    }
  }, [])

  // Load articles
  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      }
    } catch (error) {
      console.error('Error loading articles:', error)
    }
  }

  const handleLogin = () => {
    if (password === 'cyber2024') {
      setIsAuthenticated(true)
      localStorage.setItem('admin-authenticated', 'true')
      loadArticles()
    } else {
      alert('Incorrect password!')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin-authenticated')
  }

  // Filter and sort articles
  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesSubject = filterSubject === 'all' || article.subjectId === filterSubject
      const matchesStatus = filterStatus === 'all' || article.status === filterStatus
      const matchesType = filterType === 'all' || article.type === filterType
      
      return matchesSearch && matchesSubject && matchesStatus && matchesType
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'views':
          comparison = a.views - b.views
          break
        case 'likes':
          comparison = a.likes - b.likes
          break
        case 'date':
        default:
          comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  // Article operations
  const handleCreateArticle = async () => {
    try {
      const newArticle: Article = {
        id: Date.now().toString(),
        title: formData.title || '',
        description: formData.description || '',
        content: formData.content || '',
        subjectId: formData.subjectId || 'applied-physics',
        subjectName: subjects.find(s => s.id === formData.subjectId)?.name || '',
        instructor: formData.instructor || 'Dr. Instructor',
        duration: formData.duration || '90 minutes',
        date: formData.date || new Date().toISOString().split('T')[0] || '',
        type: formData.type || 'lecture',
        status: formData.status || 'draft',
        publishedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        views: 0,
        likes: 0,
        tags: formData.tags || [],
        featured: formData.featured || false,
        excerpt: formData.excerpt || formData.description?.substring(0, 150) || ''
      }

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      })

      if (response.ok) {
        setArticles([newArticle, ...articles])
        setIsCreating(false)
        resetForm()
        alert('Article created successfully!')
      } else {
        alert('Failed to create article')
      }
    } catch (error) {
      alert('Error creating article: ' + error)
    }
  }

  const handleUpdateArticle = async (id: string, updates: Partial<Article>) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      })
      
      if (response.ok) {
        const updatedArticle = await response.json()
        setArticles(articles.map(article => 
          article.id === id ? updatedArticle : article
        ))
        alert('Article updated successfully!')
      } else {
        alert('Failed to update article')
      }
    } catch (error) {
      alert('Error updating article: ' + error)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`/api/articles?id=${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setArticles(articles.filter(article => article.id !== id))
          alert('Article deleted successfully!')
        } else {
          alert('Failed to delete article')
        }
      } catch (error) {
        alert('Error deleting article: ' + error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      subjectId: 'applied-physics',
      instructor: '',
      duration: '90 minutes',
      date: new Date().toISOString().split('T')[0] || '',
      type: 'lecture',
      status: 'draft',
      tags: [],
      featured: false,
      excerpt: ''
    })
  }

  const startEditing = (article: Article) => {
    setEditingArticle(article)
    setFormData(article)
    setIsEditing(true)
  }

  const saveEdit = async () => {
    if (editingArticle) {
      await handleUpdateArticle(editingArticle.id, formData)
      setIsEditing(false)
      setEditingArticle(null)
      resetForm()
    }
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="enhanced-card p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyber-neon to-cyber-violet rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-orbitron font-bold text-dark-100 mb-2">
              Professional CMS
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
              Access Professional CMS
            </button>
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
              Professional Content Management
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
            Manage your articles with professional tools like Blogger
          </p>
        </div>

        {/* Action Bar */}
        <div className="enhanced-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCreating(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Article
              </button>
              
              <button
                onClick={() => setShowStats(!showStats)}
                className="btn-secondary flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Analytics
              </button>
              
              <button
                onClick={loadArticles}
                className="btn-tertiary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-dark-300">
                {filteredArticles.length} articles
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="enhanced-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search articles, tags, content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
              />
            </div>
            
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="lecture">Lecture</option>
              <option value="lab">Lab</option>
              <option value="assignment">Assignment</option>
            </select>
            
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="views">Views</option>
                <option value="likes">Likes</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="btn-tertiary p-2"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {showStats && (
          <div className="enhanced-card p-6 mb-8">
            <h2 className="text-xl font-semibold text-dark-100 mb-4">Analytics Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyber-neon">{articles.length}</div>
                <div className="text-sm text-dark-300">Total Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{articles.filter(a => a.status === 'published').length}</div>
                <div className="text-sm text-dark-300">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{articles.filter(a => a.status === 'draft').length}</div>
                <div className="text-sm text-dark-300">Drafts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{articles.reduce((sum, a) => sum + a.views, 0)}</div>
                <div className="text-sm text-dark-300">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{articles.reduce((sum, a) => sum + a.likes, 0)}</div>
                <div className="text-sm text-dark-300">Total Likes</div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div key={article.id} className="enhanced-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark-100 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-dark-300 text-sm mb-3 line-clamp-2">
                    {article.excerpt || article.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    article.status === 'published' ? 'bg-green-400/20 text-green-400' :
                    article.status === 'draft' ? 'bg-yellow-400/20 text-yellow-400' :
                    article.status === 'scheduled' ? 'bg-blue-400/20 text-blue-400' :
                    'bg-gray-400/20 text-gray-400'
                  }`}>
                    {article.status}
                  </span>
                  {article.featured && (
                    <span className="px-2 py-1 bg-cyber-neon/20 text-cyber-neon rounded-full text-xs">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-dark-400 mb-4">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {article.subjectName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>

              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-cyber-dark/50 text-cyber-neon text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="px-2 py-1 bg-cyber-dark/50 text-dark-400 text-xs rounded">
                      +{article.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-dark-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {article.likes}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedArticle(article)
                      setShowArticleModal(true)
                    }}
                    className="btn-tertiary p-2"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => startEditing(article)}
                    className="btn-tertiary p-2"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteArticle(article.id)}
                    className="btn-tertiary p-2 text-red-400 hover:bg-red-400/20"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-dark-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-dark-200 mb-2">No articles found</h3>
            <p className="text-dark-400 mb-4">
              {searchQuery || filterSubject !== 'all' || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'Start by creating your first article'
              }
            </p>
            {(!searchQuery && filterSubject === 'all' && filterStatus === 'all' && filterType === 'all') && (
              <button
                onClick={() => setIsCreating(true)}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create First Article
              </button>
            )}
          </div>
        )}

        {/* Create/Edit Article Modal */}
        {(isCreating || isEditing) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="enhanced-card max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-dark-100">
                  {isCreating ? 'Create New Article' : 'Edit Article'}
                </h2>
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setIsEditing(false)
                    setEditingArticle(null)
                    resetForm()
                  }}
                  className="btn-tertiary p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                      placeholder="Enter article title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">
                      Subject *
                    </label>
                    <select
                      value={formData.subjectId || 'applied-physics'}
                      onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                      className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                    >
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                      rows={3}
                      placeholder="Brief description of the article"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                      rows={2}
                      placeholder="Short excerpt for previews"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type || 'lecture'}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
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
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="archived">Archived</option>
                    </select>
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
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                    className="w-full px-4 py-2 bg-cyber-dark border border-cyber-neon/20 rounded-lg text-dark-100 focus:border-cyber-neon focus:outline-none"
                    placeholder="e.g., physics, mechanics, energy"
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-4 h-4 text-cyber-neon bg-cyber-dark border-cyber-neon/20 rounded focus:ring-cyber-neon"
                  />
                  <label htmlFor="featured" className="text-sm text-dark-200">
                    Featured Article
                  </label>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Article Content *
                  </label>
                  <RichTextEditor
                    content={formData.content || ''}
                    onChange={(content) => setFormData({...formData, content})}
                    placeholder="Write your article content here..."
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={isCreating ? handleCreateArticle : saveEdit}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isCreating ? 'Create Article' : 'Save Changes'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsCreating(false)
                      setIsEditing(false)
                      setEditingArticle(null)
                      resetForm()
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Details Modal */}
        {showArticleModal && selectedArticle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="enhanced-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-dark-100">
                  Article Details
                </h2>
                <button
                  onClick={() => setShowArticleModal(false)}
                  className="btn-tertiary p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-dark-100 mb-2">
                    {selectedArticle.title}
                  </h3>
                  <p className="text-dark-300 mb-4">
                    {selectedArticle.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-dark-400">Subject:</span>
                      <div className="text-dark-200">{selectedArticle.subjectName}</div>
                    </div>
                    <div>
                      <span className="text-dark-400">Type:</span>
                      <div className="text-dark-200 capitalize">{selectedArticle.type}</div>
                    </div>
                    <div>
                      <span className="text-dark-400">Status:</span>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        selectedArticle.status === 'published' ? 'bg-green-400/20 text-green-400' :
                        selectedArticle.status === 'draft' ? 'bg-yellow-400/20 text-yellow-400' :
                        selectedArticle.status === 'scheduled' ? 'bg-blue-400/20 text-blue-400' :
                        'bg-gray-400/20 text-gray-400'
                      }`}>
                        {selectedArticle.status}
                      </div>
                    </div>
                    <div>
                      <span className="text-dark-400">Views:</span>
                      <div className="text-dark-200">{selectedArticle.views}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-dark-100 mb-3">Content Preview</h4>
                  <div className="bg-cyber-dark/50 p-4 rounded-lg max-h-60 overflow-y-auto">
                    <div 
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedArticle.content.substring(0, 500) + (selectedArticle.content.length > 500 ? '...' : '') }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      window.open(`/materials/${selectedArticle.subjectId}/${selectedArticle.id}`, '_blank')
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Article
                  </button>
                  
                  <button
                    onClick={() => {
                      startEditing(selectedArticle)
                      setShowArticleModal(false)
                    }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Article
                  </button>
                  
                  <button
                    onClick={() => handleDeleteArticle(selectedArticle.id)}
                    className="btn-tertiary text-red-400 hover:bg-red-400/20 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

