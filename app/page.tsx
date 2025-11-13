'use client'

import Link from 'next/link'
import { Calendar, BookOpen, Info, ArrowRight, Users, Award, Target } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: 'Academic Schedule',
      description: 'View comprehensive lecture and laboratory schedules for all sections',
      href: '/schedule',
      color: 'from-cyber-neon to-cyber-green'
    },
    {
      icon: BookOpen,
      title: 'Learning Materials',
      description: 'Access course materials and resources for all subjects',
      href: '/materials',
      color: 'from-cyber-violet to-cyber-blue'
    },
    {
      icon: Info,
      title: 'About Platform',
      description: 'Learn more about our academic platform and team',
      href: '/about',
      color: 'from-cyber-green to-cyber-neon'
    }
  ]

  const stats = [
    { label: 'Subjects', value: '7', icon: BookOpen },
    { label: 'Sections', value: '15', icon: Users },
    { label: 'Professors', value: '6', icon: Award },
    { label: 'Platform', value: '100%', icon: Target }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyber-neon via-cyber-violet to-cyber-green rounded-2xl flex items-center justify-center shadow-lg shadow-cyber-neon/30">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-orbitron font-bold text-dark-100">
              Cyber <span className="gradient-text">TMSAH</span>
            </h1>
          </div>
          <p className="text-xl sm:text-2xl text-dark-300 max-w-3xl mx-auto mb-8">
            Advanced Academic Learning Platform
          </p>
          <p className="text-lg text-dark-400 max-w-2xl mx-auto">
            Comprehensive educational platform integrating cutting-edge technology with academic excellence for superior learning experiences
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="enhanced-card p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyber-neon via-cyber-violet to-cyber-green rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyber-neon/30">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-cyber-neon mb-2">{stat.value}</div>
                <div className="text-sm text-dark-300">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link
                key={index}
                href={feature.href}
                className="group block"
              >
                <div className={`enhanced-card p-8 h-full min-h-[280px] flex flex-col justify-between hover:scale-105 transition-all duration-300 animate-slide-up-delayed`}
                     style={{ animationDelay: `${index * 0.15}s` }}>
                  <div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-dark-100 mb-3 group-hover:text-cyber-neon transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-dark-300 group-hover:text-dark-200 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-cyber-neon group-hover:translate-x-1 transition-transform">
                    <span className="font-medium">Explore</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-dark-100 mb-4">
              Quick Access
            </h2>
            <p className="text-dark-300 mb-6">
              Get started by exploring our schedule, materials, or learning more about the platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedule" className="btn-primary">
                <Calendar className="w-5 h-5" />
                View Schedule
              </Link>
              <Link href="/materials" className="btn-secondary">
                <BookOpen className="w-5 h-5" />
                Browse Materials
              </Link>
              <Link href="/about" className="btn-tertiary">
                <Info className="w-5 h-5" />
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
