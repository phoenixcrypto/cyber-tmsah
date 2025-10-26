'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  FileText, 
  BookOpen, 
  Users, 
  Settings,
  BarChart3,
  Calendar,
  Clock,
  Shield,
  Target,
  Zap
} from 'lucide-react'

// Sample data - in real app this would come from database
const sampleContent = [
  {
    id: 'math-lecture-1',
    title: 'Introduction to Calculus',
    type: 'lecture',
    subject: 'Mathematics',
    status: 'published',
    createdAt: '2025-01-15',
    views: 45,
    sections: 4
  },
  {
    id: 'math-session-1',
    title: 'Calculus Problem Solving',
    type: 'session',
    subject: 'Mathematics',
    status: 'draft',
    createdAt: '2025-01-16',
    views: 23,
    sections: 3
  },
  {
    id: 'it-lecture-1',
    title: 'Computer Networks Fundamentals',
    type: 'lecture',
    subject: 'Information Technology',
    status: 'published',
    createdAt: '2025-01-17',
    views: 67,
    sections: 5
  }
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'materials' | 'settings'>('overview')
  const [content, setContent] = useState(sampleContent)

  const stats = {
    totalContent: content.length,
    published: content.filter(c => c.status === 'published').length,
    drafts: content.filter(c => c.status === 'draft').length,
    totalViews: content.reduce((sum, c) => sum + c.views, 0)
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-dark-100 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 mb-4"
              >
                
                  <Shield className="text-cyber-neon" size={48} />
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-orbitron font-black text-cyber-neon mb-3 sm:mb-4">
                  Admin Dashboard
                </h1>
              </motion.div>
              <p className="text-dark-300 text-base sm:text-lg">Manage your educational content and platform</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/admin/new"
                className="btn-primary flex items-center gap-3 px-8 py-4"
              >
                
                  <Plus size={20} />
                
                Create New Content
              </Link>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card text-center"
            >
              <FileText size={32} className="text-cyber-neon mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-cyber-neon mb-1">{stats.totalContent}</h3>
              <p className="text-dark-300">Total Content</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card text-center"
            >
              <Eye size={32} className="text-green-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-green-400 mb-1">{stats.published}</h3>
              <p className="text-dark-300">Published</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card text-center"
            >
              <Edit size={32} className="text-yellow-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-yellow-400 mb-1">{stats.drafts}</h3>
              <p className="text-dark-300">Drafts</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card text-center"
            >
              <BarChart3 size={32} className="text-cyber-violet mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-cyber-violet mb-1">{stats.totalViews}</h3>
              <p className="text-dark-300">Total Views</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex bg-cyber-dark/50 border border-cyber-glow rounded-full p-1 max-w-2xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'overview' 
                  ? 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30' 
                  : 'text-dark-400 hover:text-cyber-neon'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'content' 
                  ? 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30' 
                  : 'text-dark-400 hover:text-cyber-neon'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'materials' 
                  ? 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30' 
                  : 'text-dark-400 hover:text-cyber-neon'
              }`}
            >
              Materials
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'settings' 
                  ? 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30' 
                  : 'text-dark-400 hover:text-cyber-neon'
              }`}
            >
              Settings
            </button>
          </div>
        </motion.div>

        {/* Content Based on Active Tab */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Recent Activity */}
              <div className="glass-card">
                <h3 className="text-xl font-orbitron font-bold text-cyber-neon mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {content.slice(0, 5).map((item, index) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-cyber-dark/30 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'published' ? 'bg-green-400' : 'bg-yellow-400'
                      }`} />
                      <div className="flex-1">
                        <h4 className="text-cyber-neon font-semibold">{item.title}</h4>
                        <p className="text-dark-300 text-sm">{item.subject} • {item.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-dark-400 text-sm">{item.createdAt}</p>
                        <p className="text-cyber-violet text-sm">{item.views} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Content List */}
              <div className="glass-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-orbitron font-bold text-cyber-neon">
                    All Content
                  </h3>
                  <div className="flex gap-2">
                    <select className="px-4 py-2 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100">
                      <option>All Subjects</option>
                      <option>Mathematics</option>
                      <option>Information Technology</option>
                    </select>
                    <select className="px-4 py-2 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100">
                      <option>All Status</option>
                      <option>Published</option>
                      <option>Draft</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {content.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-cyber-dark/30 rounded-lg hover:bg-cyber-glow/10 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-cyber-neon to-cyber-violet rounded-lg flex items-center justify-center">
                        {item.type === 'lecture' ? <Users size={24} className="text-cyber-dark" /> : <BookOpen size={24} className="text-cyber-dark" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-cyber-neon">{item.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status === 'published' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-dark-300 text-sm">{item.subject} • {item.type} • {item.sections} sections</p>
                      </div>

                      <div className="flex items-center gap-2 text-dark-400 text-sm">
                        <Eye size={16} />
                        {item.views}
                      </div>

                      <div className="flex gap-2">
                        <Link 
                          href={`/admin/edit/${item.id}`}
                          className="p-2 bg-cyber-neon/10 border border-cyber-neon text-cyber-neon rounded-lg hover:bg-cyber-neon/20 transition-all duration-300"
                        >
                          <Edit size={16} />
                        </Link>
                        <Link 
                          href={`/materials/mathematics/${item.type}/${item.id}`}
                          className="p-2 bg-cyber-violet/10 border border-cyber-violet text-cyber-violet rounded-lg hover:bg-cyber-violet/20 transition-all duration-300"
                        >
                          <Eye size={16} />
                        </Link>
                        <button className="p-2 bg-red-500/10 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-300">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="glass-card text-center py-16">
              <Upload size={64} className="text-cyber-neon mx-auto mb-6" />
              <h3 className="text-2xl font-orbitron font-bold text-cyber-neon mb-4">
                Material Management
              </h3>
              <p className="text-dark-300 mb-8">
                Upload and manage PDFs, documents, and other educational materials
              </p>
              <button className="px-6 py-3 bg-cyber-neon/10 border border-cyber-neon text-cyber-neon rounded-lg font-semibold hover:bg-cyber-neon/20 transition-all duration-300">
                Upload Materials
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-card">
              <h3 className="text-xl font-orbitron font-bold text-cyber-neon mb-6">
                System Settings
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-cyber-neon font-semibold mb-2">Site Title</label>
                  <input 
                    type="text" 
                    defaultValue="Cyber Tmsah"
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>
                <div>
                  <label className="block text-cyber-neon font-semibold mb-2">Default Instructor</label>
                  <input 
                    type="text" 
                    defaultValue="Dr. Zeyad Eltmsah"
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>
                <div>
                  <label className="block text-cyber-neon font-semibold mb-2">Default Assistant</label>
                  <input 
                    type="text" 
                    defaultValue="Eng. Youssef Waleed"
                    className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-100 focus:outline-none focus:border-cyber-neon"
                  />
                </div>
                <button className="px-6 py-3 bg-cyber-neon/10 border border-cyber-neon text-cyber-neon rounded-lg font-semibold hover:bg-cyber-neon/20 transition-all duration-300">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
