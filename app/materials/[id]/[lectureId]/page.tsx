'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, User, FileText, Download, Share2, BookOpen, Copy, MessageCircle, Send, Play } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { sanitizeHTML } from '@/lib/security'

interface Article {
  id: string
  title: string
  subject: string
  instructor: string
  duration: string
  date: string
  content: string
  attachments?: Array<{
    name: string
    type: string
    size: string
    url: string
  }>
  relatedLectures?: Array<{
    id: string
    title: string
    date: string
  }>
  youtubeUrl?: string
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  
  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = match && match[2] && match[2].length === 11 ? match[2] : null
  
  if (!videoId) return null
  
  return `https://www.youtube.com/embed/${videoId}`
}

export default function LecturePage() {
  const params = useParams()
  const subjectId = params.id as string
  const lectureId = params.lectureId as string
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [lectureContent, setLectureContent] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load article from Strapi
  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch article by ID from Strapi
        const response = await fetch(`/api/articles/by-subject?subjectId=${subjectId}&status=published`)
        
        if (!response.ok) {
          throw new Error('Failed to load article')
        }
        
        const articles = await response.json()
        const article = articles.find((a: Article) => a.id === lectureId)
        
        if (!article) {
          throw new Error('Article not found')
        }
        
        // Transform to lecture content format
        setLectureContent({
          id: article.id,
          title: article.title,
          subject: article.subjectName || subjectId,
          instructor: article.instructor,
          duration: article.duration,
          date: article.date,
          content: article.content,
          attachments: [],
          relatedLectures: [],
          youtubeUrl: (article as any).youtubeUrl || ''
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article')
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [subjectId, lectureId])

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


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyber-neon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-300">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !lectureContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-dark-100 mb-4">Article Not Found</h1>
          <p className="text-dark-300 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <Link href={`/materials/${subjectId}`} className="btn-primary">
            Back to {subjectId}
          </Link>
        </div>
      </div>
    )
  }

  // Share options
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out this lecture: ${lectureContent.title} - ${lectureContent.subject}`

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
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`
        window.open(whatsappUrl, '_blank')
        setShowShareMenu(false)
      },
      color: 'text-green-400'
    },
    {
      name: 'Telegram',
      icon: Send,
      action: () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`
        window.open(telegramUrl, '_blank')
        setShowShareMenu(false)
      },
      color: 'text-blue-300'
    },
    {
      name: 'Messenger',
      icon: MessageCircle,
      action: () => {
        const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(currentUrl)}&app_id=YOUR_APP_ID`
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
            href={`/materials/${subjectId}`} 
            className="inline-flex items-center gap-2 text-cyber-neon hover:text-cyber-green transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {lectureContent.subject || subjectId}
          </Link>
          
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-4">
              {lectureContent.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-dark-400 mb-4">
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
                            <Icon className={`w-4 h-4 ${option.color}`} />
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
        </div>

        {/* YouTube Video */}
        {lectureContent.youtubeUrl && getYouTubeEmbedUrl(lectureContent.youtubeUrl) && (
          <div className="enhanced-card p-6 mb-8">
            <h3 className="text-xl font-semibold text-dark-100 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-cyber-neon" />
              Video Explanation
            </h3>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={getYouTubeEmbedUrl(lectureContent.youtubeUrl) || ''}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <a
              href={lectureContent.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-neon hover:text-cyber-green text-sm mt-3 inline-flex items-center gap-1"
            >
              Watch on YouTube
            </a>
          </div>
        )}

        {/* Lecture Content */}
        <div className="enhanced-card p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            <div 
              className="text-dark-200 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHTML(lectureContent.content)
              }}
            />
          </div>
        </div>

        {/* Attachments */}
        <div className="enhanced-card p-6 mb-8">
          <h3 className="text-xl font-semibold text-dark-100 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyber-neon" />
            Attachments
          </h3>
          <div className="space-y-3">
            {lectureContent.attachments && lectureContent.attachments.length > 0 ? (
              lectureContent.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-cyber-dark/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-cyber-violet" />
                    <div>
                      <span className="text-dark-100 font-medium">{attachment.name}</span>
                      <span className="text-dark-400 text-sm ml-2">({attachment.type}, {attachment.size})</span>
                    </div>
                  </div>
                  <button className="btn-tertiary text-sm">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-dark-400">No attachments available</p>
            )}
          </div>
        </div>

        {/* Related Lectures */}
        {lectureContent.relatedLectures && lectureContent.relatedLectures.length > 0 && (
          <div className="enhanced-card p-6">
            <h3 className="text-xl font-semibold text-dark-100 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyber-neon" />
              Related Lectures
            </h3>
            <div className="space-y-3">
              {lectureContent.relatedLectures.map((lecture, index) => (
                <Link
                  key={index}
                  href={`/materials/${subjectId}/${lecture.id}`}
                  className="block p-3 bg-cyber-dark/30 rounded-lg hover:bg-cyber-dark/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-dark-100 font-medium">{lecture.title}</span>
                    <span className="text-dark-400 text-sm">{lecture.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
