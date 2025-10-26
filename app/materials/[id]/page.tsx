'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Users, Clock, Calendar, FileText, Video, Download } from 'lucide-react'


// Material data with lectures and sessions
const materialData = {
  'mathematics': {
    title: 'Mathematics',
    icon: '📐',
    description: 'Fundamentals of algebra, calculus, and mathematical analysis',
    hasSessions: true,
    instructor: 'Dr. Simon Ezzat',
    assistants: [
      { id: 'math-ta-1', name: 'Eng. Ehab Mohamed' },
      { id: 'math-ta-2', name: 'Eng. Ahmed Nashaat' },
      { id: 'math-ta-3', name: 'Eng. Yasmine' }
    ],
    lectures: [
      {
        id: 'math-lecture-1',
        title: 'Introduction to Calculus',
        date: '2025-01-15',
        duration: '2 hours',
        description: 'Basic concepts of differential and integral calculus',
        content: 'math-lecture-1-content',
        materials: ['calculus-basics.pdf', 'practice-problems.pdf']
      },
      {
        id: 'math-lecture-2',
        title: 'Limits and Continuity',
        date: '2025-01-22',
        duration: '2 hours',
        description: 'Understanding limits and continuous functions',
        content: 'math-lecture-2-content',
        materials: ['limits-theory.pdf', 'examples.pdf']
      }
    ],
    sessions: [
      {
        id: 'math-session-1',
        title: 'Calculus Problem Solving',
        date: '2025-01-17',
        duration: '1.5 hours',
        description: 'Practical exercises and problem solving techniques',
        content: 'math-session-1-content',
        materials: ['problem-sets.pdf', 'solutions.pdf']
      },
      {
        id: 'math-session-2',
        title: 'Advanced Calculus Applications',
        date: '2025-01-24',
        duration: '1.5 hours',
        description: 'Real-world applications of calculus concepts',
        content: 'math-session-2-content',
        materials: ['applications.pdf', 'case-studies.pdf']
      }
    ]
  },
  'information-technology': {
    title: 'Information Technology',
    icon: '🔧',
    description: 'IT infrastructure, systems administration, and technical support',
    hasSessions: true,
    instructor: 'Dr. Shaimaa Ahmed',
    assistants: [
      { id: 'it-ta-1', name: 'Eng. Mohamed Ammar' },
      { id: 'it-ta-2', name: 'Eng. Yasmine' }
    ],
    lectures: [
      {
        id: 'it-lecture-1',
        title: 'Computer Networks Fundamentals',
        date: '2025-01-16',
        duration: '2 hours',
        description: 'Introduction to network protocols and architecture',
        content: 'it-lecture-1-content',
        materials: ['networks-basics.pdf', 'protocols.pdf']
      }
    ],
    sessions: [
      {
        id: 'it-session-1',
        title: 'Network Configuration Lab',
        date: '2025-01-19',
        duration: '2 hours',
        description: 'Hands-on network configuration and troubleshooting',
        content: 'it-session-1-content',
        materials: ['lab-manual.pdf', 'config-examples.pdf']
      }
    ]
  },
  'applied-physics': {
    title: 'Applied Physics',
    icon: '⚡',
    description: 'Physics principles applied to technology and engineering',
    hasSessions: true,
    instructor: 'Dr. Ahmed Bakr',
    assistants: [
      { id: 'physics-ta-1', name: 'Eng. Omnia Ibrahim' },
      { id: 'physics-ta-2', name: 'Eng. Ahmed Nashaat' }
    ],
    lectures: [
      {
        id: 'physics-lecture-1',
        title: 'Electromagnetic Theory',
        date: '2025-01-18',
        duration: '2 hours',
        description: 'Fundamentals of electromagnetic fields and waves',
        content: 'physics-lecture-1-content',
        materials: ['em-theory.pdf', 'equations.pdf']
      }
    ],
    sessions: [
      {
        id: 'physics-session-1',
        title: 'Electromagnetic Experiments',
        date: '2025-01-21',
        duration: '2 hours',
        description: 'Laboratory experiments with electromagnetic phenomena',
        content: 'physics-session-1-content',
        materials: ['lab-procedures.pdf', 'measurements.pdf']
      }
    ]
  },
  'database-systems': {
    title: 'Database Systems',
    icon: '🗄️',
    description: 'SQL fundamentals, database design, and data management',
    hasSessions: true,
    instructor: 'Dr. Abeer Hassan',
    assistants: [
      { id: 'db-ta-1', name: 'Eng. Naglaa Saeed' },
      { id: 'db-ta-2', name: 'Eng. Karim Adel' }
    ],
    lectures: [
      {
        id: 'db-lecture-1',
        title: 'Database Design Principles',
        date: '2025-01-20',
        duration: '2 hours',
        description: 'Entity-Relationship modeling and normalization',
        content: 'db-lecture-1-content',
        materials: ['design-principles.pdf', 'er-diagrams.pdf']
      }
    ],
    sessions: [
      {
        id: 'db-session-1',
        title: 'SQL Query Practice',
        date: '2025-01-23',
        duration: '2 hours',
        description: 'Hands-on SQL query writing and optimization',
        content: 'db-session-1-content',
        materials: ['sql-exercises.pdf', 'sample-database.pdf']
      }
    ]
  },
  'information-systems': {
    title: 'Information Systems',
    icon: '💻',
    description: 'Information systems design, analysis, and management',
    hasSessions: true,
    instructor: 'Dr. Hend Zyada',
    assistants: [
      { id: 'is-ta-1', name: 'Eng. Mahmoud Mohamed' },
      { id: 'is-ta-2', name: 'Eng. Dina Ali' },
      { id: 'is-ta-3', name: 'Eng. Mariam Ashraf' }
    ],
    lectures: [
      {
        id: 'is-lecture-1',
        title: 'System Analysis and Design',
        date: '2025-01-25',
        duration: '2 hours',
        description: 'Systems development lifecycle and methodologies',
        content: 'is-lecture-1-content',
        materials: ['system-analysis.pdf', 'methodologies.pdf']
      }
    ],
    sessions: [
      {
        id: 'is-session-1',
        title: 'Requirements Gathering Workshop',
        date: '2025-01-28',
        duration: '2 hours',
        description: 'Practical techniques for gathering system requirements',
        content: 'is-session-1-content',
        materials: ['requirements-template.pdf', 'interview-guide.pdf']
      }
    ]
  }
}

interface MaterialDetailPageProps {
  params: {
    id: string
  }
}

export default function MaterialDetailPage({ params }: MaterialDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'lectures' | 'sessions'>('lectures')
  
  const material = materialData[params.id as keyof typeof materialData]
  
  if (!material) {
    return (
      <div className="min-h-screen bg-cyber-dark text-dark-100 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-orbitron font-bold text-cyber-neon mb-4">
              Material Not Found
            </h1>
            <Link href="/materials" className="text-cyber-violet hover:text-cyber-neon">
              ← Back to Materials
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentItems = activeTab === 'lectures' ? material.lectures : material.sessions

  return (
    <div className="min-h-screen bg-cyber-dark text-dark-100 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="breadcrumbs mb-8">
          <Link href="/" className="breadcrumb-item">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <Link href="/materials" className="breadcrumb-item">Materials</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{material.title}</span>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/materials"
              className="p-2 bg-cyber-dark/50 border border-cyber-glow rounded-lg hover:bg-cyber-glow/20 transition-all duration-300"
            >
              <ArrowLeft size={20} className="text-cyber-neon" />
            </Link>
            <div className="text-6xl">{material.icon}</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-cyber-neon mb-2">
                {material.title}
              </h1>
              <p className="text-dark-300 text-lg">{material.description}</p>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="glass-card">
              <div className="flex items-center gap-3 mb-4">
                <Users size={24} className="text-cyber-neon" />
                <h3 className="text-xl font-orbitron font-bold text-cyber-neon">
                  Course Instructor
                </h3>
              </div>
              <p className="text-dark-300 text-lg font-semibold">{material.instructor}</p>
              <p className="text-dark-400 text-sm mt-2">Responsible for lectures and theoretical content</p>
            </div>

            <div className="glass-card">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen size={24} className="text-cyber-violet" />
                <h3 className="text-xl font-orbitron font-bold text-cyber-violet">
                  Teaching Assistants ({material.assistants.length})
                </h3>
              </div>
              <div className="space-y-3">
                {material.assistants.map((assistant, index) => (
                  <div key={assistant.id} className="p-3 bg-cyber-dark/30 rounded-lg border border-cyber-glow/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-dark-300 font-semibold">{assistant.name}</p>
                      <span className="text-cyber-violet text-xs bg-cyber-violet/10 px-2 py-1 rounded-full">
                        TA {index + 1}
                      </span>
                    </div>
                    {/* Additional TA info (optional in data source) */}
                  </div>
                ))}
              </div>
              <p className="text-dark-400 text-sm mt-3">Responsible for sessions and practical work</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex bg-cyber-dark/50 border border-cyber-glow rounded-full p-1 max-w-md">
            <button
              onClick={() => setActiveTab('lectures')}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'lectures' 
                  ? 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30' 
                  : 'text-dark-400 hover:text-cyber-neon'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Users size={20} />
                Lectures ({material.lectures.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'sessions' 
                  ? 'bg-cyber-violet/20 text-cyber-violet border border-cyber-violet/30' 
                  : 'text-dark-400 hover:text-cyber-violet'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen size={20} />
                Sessions ({material.sessions.length})
              </div>
            </button>
          </div>
        </motion.div>

        {/* Content List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {currentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card group cursor-pointer"
              whileHover={{ 
                scale: 1.02,
                y: -5,
                boxShadow: '0 20px 40px rgba(0, 255, 136, 0.2)'
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    activeTab === 'lectures' 
                      ? 'bg-gradient-to-r from-cyber-neon to-cyber-violet' 
                      : 'bg-gradient-to-r from-cyber-violet to-cyber-neon'
                  }`}>
                    {activeTab === 'lectures' ? <Users size={24} className="text-cyber-dark" /> : <BookOpen size={24} className="text-cyber-dark" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-orbitron font-bold text-cyber-neon group-hover:text-cyber-violet transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-dark-300">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-cyber-neon/20 text-cyber-neon text-sm rounded-full border border-cyber-neon/30">
                    {activeTab === 'lectures' ? 'Lecture' : 'Session'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-dark-300">
                  <Calendar size={16} className="mr-2 text-cyber-violet" />
                  <span className="text-sm">{item.date}</span>
                </div>
                
                <div className="flex items-center text-dark-300">
                  <Clock size={16} className="mr-2 text-cyber-violet" />
                  <span className="text-sm">{item.duration}</span>
                </div>

                <div className="flex items-center text-dark-300">
                  <FileText size={16} className="mr-2 text-cyber-violet" />
                  <span className="text-sm">{item.materials.length} Materials</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link 
                  href={`/materials/${params.id}/${activeTab}/${item.id}`}
                  className="flex-1 bg-cyber-neon/10 border border-cyber-neon text-cyber-neon px-4 py-3 rounded-lg text-center font-semibold hover:bg-cyber-neon/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  View Content
                </Link>
                
                <div className="flex gap-2">
                  {item.materials.map((material, idx) => (
                    <a 
                      key={idx}
                      href={`/materials/${material}`}
                      download
                      className="bg-cyber-violet/10 border border-cyber-violet text-cyber-violet px-3 py-3 rounded-lg hover:bg-cyber-violet/20 transition-all duration-300"
                    >
                      <Download size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
