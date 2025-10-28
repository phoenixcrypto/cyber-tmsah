'use client'

import { useState } from 'react'
import { FileText, Lock, BookOpen } from 'lucide-react'

export default function ContentManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  const handleLogin = () => {
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
              Content Management
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
              Access Content Management
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
          <p className="text-lg text-dark-300 mb-8">
            Choose your content management system
          </p>
          
          {/* System Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="enhanced-card p-8 text-center hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-cyber-neon to-cyber-violet rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-dark-100 mb-4">
                Professional CMS
              </h2>
              <p className="text-dark-300 mb-6">
                Advanced content management system like Blogger with rich text editor, analytics, and professional features
              </p>
              <a
                href="/admin/professional-cms"
                className="btn-primary w-full"
              >
                Use Professional CMS
              </a>
            </div>
            
            <div className="enhanced-card p-8 text-center hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-cyber-violet to-cyber-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-dark-100 mb-4">
                Simple CMS
              </h2>
              <p className="text-dark-300 mb-6">
                Basic content management for quick article creation and publishing
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary w-full"
              >
                Use Simple CMS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}