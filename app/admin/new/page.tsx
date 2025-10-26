'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Plus, Trash2, Upload } from 'lucide-react'

export default function NewContentPage() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'lecture',
    subject: 'mathematics',
    instructor: 'Dr. Zeyad Eltmsah',
    date: '',
    duration: '2 hours',
    description: '',
    status: 'draft'
  })

  const [assistants, setAssistants] = useState([
    { id: 1, name: '', email: '', phone: '', specialization: '' }
  ])

  const [sections, setSections] = useState([
    { id: 1, title: '', content: '' }
  ])

  const [materials, setMaterials] = useState([])

  const subjects = [
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'information-technology', name: 'Information Technology' },
    { id: 'applied-physics', name: 'Applied Physics' },
    { id: 'database-systems', name: 'Database Systems' },
    { id: 'information-systems', name: 'Information Systems' },
    { id: 'english', name: 'English' },
    { id: 'entrepreneurship', name: 'Entrepreneurship & Creative Thinking' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSection = () => {
    setSections(prev => [...prev, { 
      id: Date.now(), 
      title: '', 
      content: '' 
    }])
  }

  const updateSection = (id: number, field: string, value: string) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ))
  }

  const removeSection = (id: number) => {
    setSections(prev => prev.filter(section => section.id !== id))
  }

  const addAssistant = () => {
    setAssistants(prev => [...prev, { 
      id: Date.now(), 
      name: '', 
      email: '', 
      phone: '', 
      specialization: '' 
    }])
  }

  const updateAssistant = (id: number, field: string, value: string) => {
    setAssistants(prev => prev.map(assistant => 
      assistant.id === id ? { ...assistant, [field]: value } : assistant
    ))
  }

  const removeAssistant = (id: number) => {
    setAssistants(prev => prev.filter(assistant => assistant.id !== id))
  }

  const handleSave = () => {
    // Here you would save to database
    console.log('Saving content:', { formData, sections, materials })
    alert('Content saved successfully!')
  }

  const handlePublish = () => {
    // Here you would publish to the website
    console.log('Publishing content:', { formData, sections, materials })
    alert('Content published successfully!')
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-dark-100 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/admin"
              className="p-2 bg-cyber-dark/50 border border-cyber-glow rounded-lg hover:bg-cyber-glow/20 transition-all duration-300"
            >
              <ArrowLeft size={20} className="text-cyber-neon" />
            </Link>
            <div>
              <h1 className="text-4xl font-orbitron font-bold text-cyber-neon mb-2">
                Create New Content
              </h1>
              <p className="text-dark-300">Add new lecture or session content</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card"
            >
              <h3 className="text-xl font-orbitron font-bold text-cyber-neon mb-6">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-cyber-neon font-semibold mb-2">Title *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter content title"
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>

                <div>
                  <label className="block text-cyber-neon font-semibold mb-2">Type *</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="session">Session</option>
                  </select>
                </div>

                <div>
                  <label className="block text-cyber-neon font-semibold mb-2">Subject *</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                  >
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-cyber-neon font-semibold mb-2">Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>

                <div>
                  <label className="block text-cyber-neon font-semibold mb-2">Duration</label>
                  <select 
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                  >
                    <option value="1 hour">1 hour</option>
                    <option value="1.5 hours">1.5 hours</option>
                    <option value="2 hours">2 hours</option>
                    <option value="2.5 hours">2.5 hours</option>
                    <option value="3 hours">3 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-cyber-neon font-semibold mb-2">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-cyber-neon font-semibold mb-2">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter content description"
                  rows={3}
                  className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                />
              </div>
            </motion.div>

            {/* Content Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-orbitron font-bold text-cyber-neon">
                  Content Sections
                </h3>
                <button
                  onClick={addSection}
                  className="flex items-center gap-2 px-4 py-2 bg-cyber-neon/10 border border-cyber-neon text-cyber-neon rounded-lg hover:bg-cyber-neon/20 transition-all duration-300"
                >
                  <Plus size={16} />
                  Add Section
                </button>
              </div>

              <div className="space-y-6">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-cyber-dark/30 rounded-lg border border-cyber-glow/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-cyber-neon">
                        Section {index + 1}
                      </h4>
                      {sections.length > 1 && (
                        <button
                          onClick={() => removeSection(section.id)}
                          className="p-2 bg-red-500/10 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-cyber-violet font-semibold mb-2">Section Title</label>
                        <input 
                          type="text" 
                          value={section.title}
                          onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                          placeholder="Enter section title"
                          className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-violet"
                        />
                      </div>

                      <div>
                        <label className="block text-cyber-violet font-semibold mb-2">Content</label>
                        <textarea 
                          value={section.content}
                          onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                          placeholder="Enter section content"
                          rows={6}
                          className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-violet"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Teaching Assistants */}
            {formData.type === 'session' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-orbitron font-bold text-cyber-neon">
                    Teaching Assistants
                  </h3>
                  <button
                    onClick={addAssistant}
                    className="flex items-center gap-2 px-4 py-2 bg-cyber-violet/10 border border-cyber-violet text-cyber-violet rounded-lg hover:bg-cyber-violet/20 transition-all duration-300"
                  >
                    <Plus size={16} />
                    Add Assistant
                  </button>
                </div>

                <div className="space-y-4">
                  {assistants.map((assistant, index) => (
                    <motion.div
                      key={assistant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-cyber-dark/30 rounded-lg border border-cyber-glow/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-cyber-violet">
                          Assistant {index + 1}
                        </h4>
                        {assistants.length > 1 && (
                          <button
                            onClick={() => removeAssistant(assistant.id)}
                            className="p-2 bg-red-500/10 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-cyber-violet font-semibold mb-2">Name *</label>
                          <input 
                            type="text" 
                            value={assistant.name}
                            onChange={(e) => updateAssistant(assistant.id, 'name', e.target.value)}
                            placeholder="Assistant name"
                            className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-violet"
                          />
                        </div>

                        <div>
                          <label className="block text-cyber-violet font-semibold mb-2">Email</label>
                          <input 
                            type="email" 
                            value={assistant.email}
                            onChange={(e) => updateAssistant(assistant.id, 'email', e.target.value)}
                            placeholder="assistant@university.edu"
                            className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-violet"
                          />
                        </div>

                        <div>
                          <label className="block text-cyber-violet font-semibold mb-2">Phone</label>
                          <input 
                            type="tel" 
                            value={assistant.phone}
                            onChange={(e) => updateAssistant(assistant.id, 'phone', e.target.value)}
                            placeholder="+20 100 123 4567"
                            className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-violet"
                          />
                        </div>

                        <div>
                          <label className="block text-cyber-violet font-semibold mb-2">Specialization</label>
                          <input 
                            type="text" 
                            value={assistant.specialization}
                            onChange={(e) => updateAssistant(assistant.id, 'specialization', e.target.value)}
                            placeholder="e.g., Calculus & Algebra"
                            className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-violet"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Materials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card"
            >
              <h3 className="text-xl font-orbitron font-bold text-cyber-neon mb-6">
                Materials & Resources
              </h3>
              
              <div className="border-2 border-dashed border-cyber-glow/30 rounded-lg p-8 text-center">
                <Upload size={48} className="text-cyber-neon mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-cyber-neon mb-2">
                  Upload Materials
                </h4>
                <p className="text-dark-300 mb-4">
                  Upload PDFs, documents, and other educational materials
                </p>
                <button className="px-6 py-3 bg-cyber-neon/10 border border-cyber-neon text-cyber-neon rounded-lg font-semibold hover:bg-cyber-neon/20 transition-all duration-300">
                  Choose Files
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Actions */}
              <div className="glass-card">
                <h3 className="text-lg font-orbitron font-bold text-cyber-neon mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyber-neon/10 border border-cyber-neon text-cyber-neon rounded-lg font-semibold hover:bg-cyber-neon/20 transition-all duration-300"
                  >
                    <Save size={16} />
                    Save Draft
                  </button>
                  
                  <button
                    onClick={handlePublish}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500 text-green-400 rounded-lg font-semibold hover:bg-green-500/20 transition-all duration-300"
                  >
                    <Eye size={16} />
                    Publish Now
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="glass-card">
                <h3 className="text-lg font-orbitron font-bold text-cyber-neon mb-4">
                  Preview
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-dark-400 text-sm">Title</p>
                    <p className="text-dark-300">{formData.title || 'Untitled'}</p>
                  </div>
                  <div>
                    <p className="text-dark-400 text-sm">Type</p>
                    <p className="text-dark-300 capitalize">{formData.type}</p>
                  </div>
                  <div>
                    <p className="text-dark-400 text-sm">Subject</p>
                    <p className="text-dark-300">{subjects.find(s => s.id === formData.subject)?.name}</p>
                  </div>
                  <div>
                    <p className="text-dark-400 text-sm">Sections</p>
                    <p className="text-dark-300">{sections.length}</p>
                  </div>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="glass-card">
                <h3 className="text-lg font-orbitron font-bold text-cyber-neon mb-4">
                  Instructor Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-cyber-violet font-semibold mb-2">Instructor</label>
                    <input 
                      type="text" 
                      value={formData.instructor}
                      onChange={(e) => handleInputChange('instructor', e.target.value)}
                      className="w-full px-3 py-2 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 text-sm focus:outline-none focus:border-cyber-violet"
                    />
                  </div>
                  {formData.type === 'session' && (
                    <div>
                      <label className="block text-cyber-violet font-semibold mb-2">
                        Assistants ({assistants.length})
                      </label>
                      <div className="space-y-2">
                        {assistants.map((assistant, index) => (
                          <div key={assistant.id} className="p-2 bg-cyber-dark/30 rounded text-xs">
                            <span className="text-cyber-violet">TA {index + 1}:</span> {assistant.name || 'Unnamed'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
