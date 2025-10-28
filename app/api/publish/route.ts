import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { action, subjectId, lectureData } = await request.json()

    if (action === 'publish_lecture') {
      // Update the subject page with new lecture
      const subjectPagePath = path.join(process.cwd(), 'app', 'materials', '[id]', 'page.tsx')
      
      if (fs.existsSync(subjectPagePath)) {
        let content = fs.readFileSync(subjectPagePath, 'utf8')
        
        // Find the lectures array for the specific subject
        const subjectPattern = new RegExp(`'${subjectId}':\\s*{[\\s\\S]*?lectures:\\s*\\[[\\s\\S]*?\\]`, 'g')
        const match = content.match(subjectPattern)
        
        if (match) {
          // Add new lecture to the array
          const newLecture = `        {
          id: ${lectureData.id},
          title: '${lectureData.title}',
          description: '${lectureData.description}',
          duration: '${lectureData.duration}',
          date: '${lectureData.date}',
          type: '${lectureData.type}',
          status: '${lectureData.status}'
        }`
          
          // Insert before the closing bracket
          const updatedMatch = match[0].replace(/(\s*\]\s*)/, `,\n${newLecture}$1`)
          content = content.replace(subjectPattern, updatedMatch)
          
          fs.writeFileSync(subjectPagePath, content, 'utf8')
        }
      }

      // Create a new lecture page for this specific lecture
      const lecturePageDir = path.join(process.cwd(), 'app', 'materials', subjectId)
      const lecturePagePath = path.join(lecturePageDir, `${lectureData.id}`, 'page.tsx')
      
      // Create directory if it doesn't exist
      fs.mkdirSync(path.dirname(lecturePagePath), { recursive: true })
      
      // Create the lecture page content
      const lecturePageContent = `'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, User, FileText, Download, Share2, BookOpen, Copy, MessageCircle, Send } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function LecturePage() {
  const params = useParams()
  const subjectId = params.id as string
  const lectureId = params.lectureId as string
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.share-menu-container')) {
        setShowShareMenu(false)
      }
    }

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareMenu])

  // Lecture content
  const lectureContent = {
    id: lectureId,
    title: '${lectureData.title}',
    subject: '${subjectId}',
    instructor: 'Dr. Instructor',
    duration: '${lectureData.duration}',
    date: '${lectureData.date}',
    content: \`${lectureData.content.replace(/`/g, '\\`')}\`,
    attachments: [
      {
        name: 'Lecture Slides',
        type: 'PDF',
        size: '2.4 MB',
        url: '#'
      }
    ],
    relatedLectures: []
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = \`Check out this lecture: \${lectureContent.title} - \${lectureContent.subject}\`

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(currentUrl)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
        setShowShareMenu(false)
      },
      color: 'text-blue-400'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        const whatsappUrl = \`https://wa.me/?text=\${encodeURIComponent(shareText + ' ' + currentUrl)}\`
        window.open(whatsappUrl, '_blank')
        setShowShareMenu(false)
      },
      color: 'text-green-400'
    },
    {
      name: 'Telegram',
      icon: Send,
      action: () => {
        const telegramUrl = \`https://t.me/share/url?url=\${encodeURIComponent(currentUrl)}&text=\${encodeURIComponent(shareText)}\`
        window.open(telegramUrl, '_blank')
        setShowShareMenu(false)
      },
      color: 'text-blue-300'
    },
    {
      name: 'Messenger',
      icon: MessageCircle,
      action: () => {
        const messengerUrl = \`https://www.facebook.com/dialog/send?link=\${encodeURIComponent(currentUrl)}&app_id=YOUR_APP_ID\`
        window.open(messengerUrl, '_blank')
        setShowShareMenu(false)
      },
      color: 'text-blue-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={\`/materials/\${subjectId}\`}
            className="flex items-center gap-2 text-dark-300 hover:text-cyber-neon transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to {lectureContent.subject}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-4">
            {lectureContent.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-dark-300 text-sm mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{lectureContent.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{lectureContent.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{lectureContent.date}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <div className="relative share-menu-container">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="btn-secondary flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                {copySuccess ? 'Copied!' : 'Share'}
              </button>

              {showShareMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-cyber-dark border border-cyber-neon/20 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {shareOptions.map((option, index) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={index}
                          onClick={option.action}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-cyber-neon/10 rounded-lg transition-colors"
                        >
                          <Icon className={\`w-4 h-4 \${option.color}\`} />
                          <span className="text-dark-200">{option.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lecture Content */}
        <div className="enhanced-card p-8 mb-8">
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: lectureContent.content.replace(/\\n/g, '<br>') }}
          />
        </div>

        {/* Attachments */}
        {lectureContent.attachments && lectureContent.attachments.length > 0 && (
          <div className="enhanced-card p-6 mb-8">
            <h2 className="text-xl font-semibold text-dark-100 mb-4">Attachments</h2>
            <div className="space-y-3">
              {lectureContent.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-cyber-dark/50 rounded-lg hover:bg-cyber-neon/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyber-neon group-hover:scale-110 transition-transform" />
                    <span className="text-dark-200 font-medium">{attachment.name}</span>
                  </div>
                  <span className="text-dark-300 text-sm">{attachment.size} ({attachment.type})</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related Lectures */}
        {lectureContent.relatedLectures && lectureContent.relatedLectures.length > 0 && (
          <div className="enhanced-card p-6 mb-8">
            <h2 className="text-xl font-semibold text-dark-100 mb-4">Related Lectures</h2>
            <div className="space-y-3">
              {lectureContent.relatedLectures.map((related, index) => (
                <Link
                  key={index}
                  href={\`/materials/\${subjectId}/\${related.id}\`}
                  className="flex items-center justify-between p-3 bg-cyber-dark/50 rounded-lg hover:bg-cyber-neon/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-cyber-violet group-hover:scale-110 transition-transform" />
                    <span className="text-dark-200 font-medium">{related.title}</span>
                  </div>
                  <span className="text-dark-300 text-sm">{related.date}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}`
      
      fs.writeFileSync(lecturePagePath, lecturePageContent, 'utf8')

      return NextResponse.json({ success: true, message: 'Lecture published successfully!' })
    }

    return NextResponse.json({ success: false, message: 'Invalid action' })
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json({ success: false, message: 'Failed to publish lecture' })
  }
}
