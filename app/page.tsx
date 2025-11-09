'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, LogIn, UserPlus } from 'lucide-react'

function HomeContent() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cyber-dark">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyber-neon/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-cyber-violet/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyber-green/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-orbitron font-bold text-dark-100 mb-6 leading-tight">
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-cyber-violet to-cyber-green">
                Cyber TMSAH
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-dark-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              An advanced university-level educational platform integrating cutting-edge technology with academic excellence for superior learning experiences
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/register"
                className="btn-primary text-lg px-8 py-4 rounded-xl font-semibold group flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/login"
                className="btn-secondary text-lg px-8 py-4 rounded-xl font-semibold group flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-slide-up">
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-neon via-cyber-green to-cyber-neon rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-cyber-neon/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">Accelerated Learning</h3>
              <p className="text-dark-300">Advanced techniques for efficient and effective learning</p>
            </div>
            
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-violet via-cyber-blue to-cyber-violet rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-cyber-violet/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">Secure & Reliable</h3>
              <p className="text-dark-300">Comprehensive protection for your data and information</p>
            </div>
            
            <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-green via-cyber-neon to-cyber-green rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-cyber-neon/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">Premium Experience</h3>
              <p className="text-dark-300">Modern, intuitive user interface designed for academic excellence</p>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyber-neon rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyber-neon rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-cyber-neon animate-pulse">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
