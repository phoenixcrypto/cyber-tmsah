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
      lectures: []
    },
    'mathematics': {
      title: 'Mathematics',
      description: 'Mathematical foundations and problem solving',
      instructor: 'Dr. Simon Ezzat',
      color: 'from-green-500 to-green-600',
      lectures: []
    },
    'entrepreneurship': {
      title: 'Entrepreneurship & Creative Thinking',
      description: 'Business innovation and creative problem solving',
      instructor: 'Dr. Abeer Hassan',
      color: 'from-purple-500 to-purple-600',
      lectures: []
    },
    'information-technology': {
      title: 'Information Technology',
      description: 'IT fundamentals and modern technologies',
      instructor: 'Dr. Shaima Ahmed',
      color: 'from-cyan-500 to-cyan-600',
      lectures: []
    },
    'database-systems': {
      title: 'Database Systems',
      description: 'Database design, implementation and management',
      instructor: 'Dr. Abeer Hassan',
      color: 'from-orange-500 to-orange-600',
      lectures: []
    },
    'english-language': {
      title: 'English Language',
      description: 'English communication and technical writing',
      instructor: 'Dr. Nashwa',
      color: 'from-red-500 to-red-600',
      lectures: []
    },
    'information-systems': {
      title: 'Information Systems',
      description: 'IS analysis, design and implementation',
      instructor: 'Dr. Hind Ziada',
      color: 'from-indigo-500 to-indigo-600',
      lectures: []
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
          {subject.lectures.length > 0 ? (subject.lectures as any[]).map((lecture, index) => (
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
                      <Link 
                        href={`/materials/${subjectId}/${lecture.id}`}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Read Article
                      </Link>
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
          )) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-dark-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-200 mb-2">
                No lectures available
              </h3>
              <p className="text-dark-400 mb-6">
                Lectures for this subject will be published soon.
              </p>
              <Link
                href="/admin/content"
                className="btn-primary"
              >
                Manage Content
              </Link>
            </div>
          )}
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