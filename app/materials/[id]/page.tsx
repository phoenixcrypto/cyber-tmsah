'use client'

import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, User, Calendar, FileText, Download, Play } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function SubjectPage() {
  const params = useParams()
  const subjectId = params.id as string

  // Subject data mapping
  const subjectData = {
    'applied-physics': {
      title: 'Applied Physics',
      description: 'Physics principles and applications in technology',
      instructor: 'Dr. Ahmed Bakr',
      color: 'from-blue-500 to-blue-600',
      lectures: [
        {
          id: 1,
          title: 'Introduction to Applied Physics',
          description: 'Basic concepts and principles of physics in technology applications',
          duration: '90 minutes',
          date: '2024-01-15',
          type: 'lecture',
          status: 'published'
        },
        {
          id: 2,
          title: 'Mechanics and Motion',
          description: 'Understanding motion, forces, and mechanical systems',
          duration: '90 minutes',
          date: '2024-01-22',
          type: 'lecture',
          status: 'published'
        },
        {
          id: 3,
          title: 'Thermodynamics',
          description: 'Heat, energy, and thermodynamic processes',
          duration: '90 minutes',
          date: '2024-01-29',
          type: 'lecture',
          status: 'published'
        },
        {
          id: 4,
          title: 'Electricity and Magnetism',
          description: 'Fundamentals of electrical and magnetic phenomena',
          duration: '90 minutes',
          date: '2024-02-05',
          type: 'lecture',
          status: 'coming-soon'
        }
      ]
    },
    'mathematics': {
      title: 'Mathematics',
      description: 'Mathematical foundations and problem solving',
      instructor: 'Dr. Simon Ezzat',
      color: 'from-green-500 to-green-600',
      lectures: [
        {
          id: 1,
          title: 'Calculus Fundamentals',
          description: 'Introduction to differential and integral calculus',
          duration: '90 minutes',
          date: '2024-01-16',
          type: 'lecture',
          status: 'published'
        },
        {
          id: 2,
          title: 'Linear Algebra',
          description: 'Vectors, matrices, and linear transformations',
          duration: '90 minutes',
          date: '2024-01-23',
          type: 'lecture',
          status: 'published'
        },
        {
          id: 3,
          title: 'Probability and Statistics',
          description: 'Basic probability theory and statistical analysis',
          duration: '90 minutes',
          date: '2024-01-30',
          type: 'lecture',
          status: 'published'
        }
      ]
    },
    'entrepreneurship': {
      title: 'Entrepreneurship & Creative Thinking',
      description: 'Business innovation and creative problem solving',
      instructor: 'Dr. Abeer Hassan',
      color: 'from-purple-500 to-purple-600',
      lectures: [
        {
          id: 1,
          title: 'Introduction to Entrepreneurship',
          description: 'Understanding entrepreneurship and business opportunities',
          duration: '90 minutes',
          date: '2024-01-17',
          type: 'lecture',
          status: 'published'
        },
        {
          id: 2,
          title: 'Creative Problem Solving',
          description: 'Techniques for innovative thinking and problem solving',
          duration: '90 minutes',
          date: '2024-01-24',
          type: 'lecture',
          status: 'published'
        }
      ]
    },
    'information-technology': {
      title: 'Information Technology',
      description: 'IT fundamentals and modern technologies',
      instructor: 'Dr. Shaima Ahmed',
      color: 'from-cyan-500 to-cyan-600',
      lectures: [
        {
          id: 1,
          title: 'IT Fundamentals',
          description: 'Introduction to information technology concepts',
          duration: '90 minutes',
          date: '2024-01-18',
          type: 'lecture',
          status: 'published'
        },
        {
          id: 2,
          title: 'Computer Networks',
          description: 'Network protocols, architecture, and security',
          duration: '90 minutes',
          date: '2024-01-25',
          type: 'lecture',
          status: 'published'
        }
      ]
    },
    'database-systems': {
      title: 'Database Systems',
      description: 'Database design, implementation and management',
      instructor: 'Dr. Abeer Hassan',
      color: 'from-orange-500 to-orange-600',
      lectures: [
        {
          id: 1,
          title: 'Database Design Principles',
          description: 'Entity-relationship modeling and database design',
          duration: '90 minutes',
          date: '2024-01-19',
          type: 'lecture',
          status: 'published'
        },
        {
          id: 2,
          title: 'SQL Fundamentals',
          description: 'Structured Query Language basics and advanced queries',
          duration: '90 minutes',
          date: '2024-01-26',
          type: 'lecture',
          status: 'published'
        }
      ]
    },
    'english-language': {
      title: 'English Language',
      description: 'English communication and technical writing',
      instructor: 'Dr. Nashwa',
      color: 'from-red-500 to-red-600',
      lectures: [
        {
          id: 1,
          title: 'Technical Writing',
          description: 'Professional writing skills for technical documentation',
          duration: '90 minutes',
          date: '2024-01-20',
          type: 'lecture',
          status: 'published'
        },
        {
          id: 2,
          title: 'Communication Skills',
          description: 'Effective communication in professional environments',
          duration: '90 minutes',
          date: '2024-01-27',
          type: 'lecture',
          status: 'published'
        }
      ]
    },
    'information-systems': {
      title: 'Information Systems',
      description: 'IS analysis, design and implementation',
      instructor: 'Dr. Hind Ziada',
      color: 'from-indigo-500 to-indigo-600',
      lectures: [
        {
          id: 1,
          title: 'Systems Analysis',
          description: 'Analyzing business requirements and system specifications',
          duration: '90 minutes',
          date: '2024-01-21',
          type: 'lecture',
          status: 'published'
        },
        {
          id: 2,
          title: 'System Design',
          description: 'Designing efficient and scalable information systems',
          duration: '90 minutes',
          date: '2024-01-28',
          type: 'lecture',
          status: 'published'
        }
      ]
    }
  }

  const subject = subjectData[subjectId as keyof typeof subjectData]

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-dark-100 mb-4">Subject Not Found</h1>
          <Link href="/materials" className="btn-primary">
            Back to Materials
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/materials" 
            className="inline-flex items-center gap-2 text-cyber-neon hover:text-cyber-green transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Materials
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center shadow-lg`}>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100">
                {subject.title}
              </h1>
              <p className="text-lg text-dark-300">{subject.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-dark-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Instructor: {subject.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{subject.lectures.length} lectures</span>
            </div>
          </div>
        </div>

        {/* Lectures List */}
        <div className="space-y-4">
          {subject.lectures.map((lecture, index) => (
            <div 
              key={lecture.id}
              className="enhanced-card p-6 hover:scale-[1.02] transition-all duration-300 animate-slide-up-delayed"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-dark-100">
                      {lecture.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lecture.status === 'published' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {lecture.status === 'published' ? 'Available' : 'Coming Soon'}
                    </span>
                  </div>
                  
                  <p className="text-dark-300 mb-4">
                    {lecture.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-dark-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{lecture.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{lecture.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="capitalize">{lecture.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {lecture.status === 'published' ? (
                    <>
                      <button className="btn-primary flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch
                      </button>
                      <button className="btn-secondary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </>
                  ) : (
                    <button className="btn-tertiary flex items-center gap-2" disabled>
                      <Clock className="w-4 h-4" />
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 text-center">
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-dark-100 mb-2">
              More Content Coming Soon
            </h3>
            <p className="text-dark-300">
              Additional lectures and materials will be added regularly. Check back for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}