'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronRight } from 'lucide-react'
import { getLatestArticles, type Article } from '@/lib/articles'

export default function NewsTicker() {
  const { t, language } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const tickerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    // Fetch latest articles
    const latestArticles = getLatestArticles(language, 5)
    setArticles(latestArticles)
  }, [language])

  // If no articles, don't render
  if (articles.length === 0) {
    return null
  }

  return (
    <div className="iNewsTicker-container">
      <div className="iNewsTicker" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <div className="iNewsTicker_icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="iNewsTicker_label">{t('newsTicker.label')}</span>
        </div>
        <div 
          ref={tickerRef}
          className={`iNewsTicker_posts ${isPaused ? 'paused' : ''}`}
        >
          {articles.map((article, index) => (
            <div key={`${article.id}-${index}`} className="iNewsTicker_post">
              <Link href={article.url} className="iNewsTicker_post-link">
                <span className="iNewsTicker_post-title">{article.title}</span>
                <span className="iNewsTicker_post-separator">•</span>
                <span className="iNewsTicker_post-subject">{article.subjectTitle}</span>
                <ChevronRight className="iNewsTicker_post-arrow" />
              </Link>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {articles.map((article, index) => (
            <div key={`${article.id}-${index}-dup`} className="iNewsTicker_post">
              <Link href={article.url} className="iNewsTicker_post-link">
                <span className="iNewsTicker_post-title">{article.title}</span>
                <span className="iNewsTicker_post-separator">•</span>
                <span className="iNewsTicker_post-subject">{article.subjectTitle}</span>
                <ChevronRight className="iNewsTicker_post-arrow" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

