'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Users, Clock, Calendar, FileText, Video, Download, ChevronLeft, ChevronRight } from 'lucide-react'

// Sample content data - this would come from a CMS or database
const contentData = {
  'math-lecture-1-content': {
    title: 'Introduction to Calculus',
    type: 'lecture',
    instructor: 'Dr. Ahmed Hassan',
    date: '2025-01-15',
    duration: '2 hours',
    description: 'Basic concepts of differential and integral calculus',
    content: [
      {
        id: 'section-1',
        title: 'What is Calculus?',
        type: 'text',
        content: `Calculus is a branch of mathematics that deals with the study of change and motion. It is divided into two main branches: differential calculus and integral calculus.`
      },
      {
        id: 'section-2',
        title: 'Historical Development',
        type: 'text',
        content: `The development of calculus is credited to two great mathematicians: Isaac Newton and Gottfried Wilhelm Leibniz. Both developed the fundamental concepts independently in the late 17th century.`
      }
    ],
    materials: [
      { name: 'calculus-basics.pdf', type: 'PDF', size: '2.3 MB' },
      { name: 'practice-problems.pdf', type: 'PDF', size: '1.8 MB' }
    ]
  },
  'math-session-1-content': {
    title: 'Calculus Problem Solving',
    type: 'session',
    instructor: 'Eng. Sarah Mohamed',
    date: '2025-01-17',
    duration: '1.5 hours',
    description: 'Practical exercises and problem solving techniques',
    content: [
      {
        id: 'section-1',
        title: 'Problem Solving Strategy',
        type: 'text',
        content: `When approaching calculus problems, follow these steps: 1. Read the problem carefully, 2. Determine which concepts apply, 3. Set up the problem, 4. Solve step by step, 5. Check your answer.`
      }
    ],
    materials: [
      { name: 'problem-sets.pdf', type: 'PDF', size: '3.1 MB' },
      { name: 'solutions.pdf', type: 'PDF', size: '2.5 MB' }
    ]
  }
}

interface ContentPageProps {
  params: {
    id: string
    type: string
    contentId: string
  }
}

export default function ContentPage({ params }: ContentPageProps) {
  const [currentSection, setCurrentSection] = useState(0)
  
  const content = contentData[`${params.contentId}-content` as keyof typeof contentData]
  
  if (!content) {
    return (
      <div className="min-h-screen bg-cyber-dark text-dark-100 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-orbitron font-bold text-cyber-neon mb-4">
              Content Not Found
            </h1>
            <Link href="/materials" className="text-cyber-violet hover:text-cyber-neon">
              ← Back to Materials
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentContent = content.content[currentSection]

  return (
    <div className="min-h-screen bg-cyber-dark text-dark-100 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="breadcrumbs mb-8">
          <Link href="/" className="breadcrumb-item">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <Link href="/materials" className="breadcrumb-item">Materials</Link>
          <span className="breadcrumb-separator">›</span>
          <Link href={`/materials/${params.id}`} className="breadcrumb-item">{params.id}</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{content.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card sticky top-24"
            >
              <div className="flex items-center gap-3 mb-6">
                {content.type === 'lecture' ? <Users size={24} className="text-cyber-neon" /> : <BookOpen size={24} className="text-cyber-violet" />}
                <h3 className="text-lg font-orbitron font-bold text-cyber-neon">
                  {content.type === 'lecture' ? 'Lecture' : 'Session'} Content
                </h3>
              </div>

              <div className="space-y-2">
                {content.content.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                      currentSection === index
                        ? 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30'
                        : 'text-dark-300 hover:text-cyber-neon hover:bg-cyber-glow/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-cyber-dark rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Materials */}
              <div className="mt-8">
                <h4 className="text-md font-orbitron font-bold text-cyber-violet mb-4">
                  Materials
                </h4>
                <div className="space-y-2">
                  {content.materials.map((material, index) => (
                    <a
                      key={index}
                      href={`/materials/${material.name}`}
                      download
                      className="flex items-center gap-2 p-2 bg-cyber-dark/30 rounded-lg hover:bg-cyber-glow/10 transition-all duration-300"
                    >
                      <FileText size={16} className="text-cyber-violet" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-dark-300 truncate">{material.name}</p>
                        <p className="text-xs text-dark-400">{material.type} • {material.size}</p>
                      </div>
                      <Download size={14} className="text-cyber-violet" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card"
            >
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Link 
                    href={`/materials/${params.id}`}
                    className="p-2 bg-cyber-dark/50 border border-cyber-glow rounded-lg hover:bg-cyber-glow/20 transition-all duration-300"
                  >
                    <ArrowLeft size={20} className="text-cyber-neon" />
                  </Link>
                  <div>
                    <h1 className="text-3xl font-orbitron font-bold text-cyber-neon mb-2">
                      {content.title}
                    </h1>
                    <p className="text-dark-300">{content.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-dark-300">
                    <Users size={16} className="mr-2 text-cyber-violet" />
                    <span className="text-sm">{content.instructor}</span>
                  </div>
                  
                  <div className="flex items-center text-dark-300">
                    <Calendar size={16} className="mr-2 text-cyber-violet" />
                    <span className="text-sm">{content.date}</span>
                  </div>

                  <div className="flex items-center text-dark-300">
                    <Clock size={16} className="mr-2 text-cyber-violet" />
                    <span className="text-sm">{content.duration}</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="prose prose-invert max-w-none"
              >
                <h2 className="text-2xl font-orbitron font-bold text-cyber-neon mb-6">
                  {currentContent.title}
                </h2>
                
                <div className="text-dark-300 leading-relaxed whitespace-pre-line">
                  {currentContent.content}
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-cyber-glow/30">
                <button
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-300 hover:text-cyber-neon hover:bg-cyber-glow/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="text-dark-400 text-sm">
                  {currentSection + 1} of {content.content.length}
                </span>

                <button
                  onClick={() => setCurrentSection(Math.min(content.content.length - 1, currentSection + 1))}
                  disabled={currentSection === content.content.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/50 border border-cyber-glow rounded-lg text-dark-300 hover:text-cyber-neon hover:bg-cyber-glow/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}