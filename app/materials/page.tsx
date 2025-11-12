'use client'

import Link from 'next/link'
import { BookOpen, Calculator, Atom, Database, Globe, Users, ArrowRight } from 'lucide-react'

interface Subject {
  id: string
  title: string
  description: string
  icon: any
  color: string
  articlesCount: number
  lastUpdated: string
}

// Static data - no API calls
const subjectsData: Subject[] = [
  {
    id: 'applied-physics',
    title: 'Applied Physics',
    description: 'Physics principles and applications in technology',
    icon: Atom,
    color: 'from-blue-500 to-blue-600',
    articlesCount: 0,
    lastUpdated: 'No articles yet'
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Mathematical foundations and problem solving',
    icon: Calculator,
    color: 'from-green-500 to-green-600',
    articlesCount: 0,
    lastUpdated: 'No articles yet'
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship & Creative Thinking',
    description: 'Business innovation and creative problem solving',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    articlesCount: 0,
    lastUpdated: 'No articles yet'
  },
  {
    id: 'information-technology',
    title: 'Information Technology',
    description: 'IT fundamentals and modern technologies',
    icon: Globe,
    color: 'from-cyan-500 to-cyan-600',
    articlesCount: 0,
    lastUpdated: 'No articles yet'
  },
  {
    id: 'database-systems',
    title: 'Database Systems',
    description: 'Database design, implementation and management',
    icon: Database,
    color: 'from-orange-500 to-orange-600',
    articlesCount: 0,
    lastUpdated: 'No articles yet'
  },
  {
    id: 'english-language',
    title: 'English Language',
    description: 'English communication and technical writing',
    icon: BookOpen,
    color: 'from-red-500 to-red-600',
    articlesCount: 0,
    lastUpdated: 'No articles yet'
  },
  {
    id: 'information-systems',
    title: 'Information Systems',
    description: 'IS analysis, design and implementation',
    icon: BookOpen,
    color: 'from-indigo-500 to-indigo-600',
    articlesCount: 0,
    lastUpdated: 'No articles yet'
  }
]

export default function MaterialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-xl flex items-center justify-center shadow-lg shadow-cyber-neon/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              Learning Materials
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            Access comprehensive course materials and resources for all subjects
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {subjectsData.map((subject, index) => {
            const Icon = subject.icon
            return (
              <Link
                key={subject.id}
                href={`/materials/${subject.id}`}
                className="group block"
              >
                <div className="enhanced-card p-6 h-full min-h-[240px] flex flex-col justify-between hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                     style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-cyber-neon group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-dark-100 mb-2 group-hover:text-cyber-neon transition-colors min-h-[56px]">
                      {subject.title}
                    </h3>
                    
                    <p className="text-dark-300 mb-4 group-hover:text-dark-200 transition-colors">
                      {subject.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-dark-400">
                    <span>
                      {subject.articlesCount} {subject.articlesCount === 1 ? 'article' : 'articles'}
                    </span>
                    <span>
                      {subject.lastUpdated !== 'No articles yet' ? `Updated ${subject.lastUpdated}` : 'No articles yet'}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
