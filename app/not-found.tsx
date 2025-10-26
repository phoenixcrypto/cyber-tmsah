'use client'

import Link from 'next/link'
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react'

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* 404 Icon */}
          <div className="w-32 h-32 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="w-16 h-16 text-cyber-dark" />
          </div>
          
          {/* Error Message */}
          <h1 className="text-6xl sm:text-8xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-cyber-violet to-cyber-green mb-6">
            404
          </h1>
          
          <h2 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-4">
            الصفحة غير موجودة
          </h2>
          
          <p className="text-lg text-dark-300 mb-8 leading-relaxed">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. 
            تحقق من الرابط أو استخدم الروابط أدناه للعودة إلى الصفحة الرئيسية.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/"
              className="btn-primary flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              الصفحة الرئيسية
            </Link>
            
            <button
              onClick={handleGoBack}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للخلف
            </button>
          </div>
          
          {/* Search Suggestion */}
          <div className="glass-card p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">
              هل تبحث عن شيء معين؟
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ابحث في الموقع..."
                className="flex-1 px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 placeholder-dark-400 focus:border-cyber-neon focus:outline-none transition-colors"
              />
              <button className="btn-primary px-4 py-2">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}