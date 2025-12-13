'use client'

import { Play, Download, FileText, Link as LinkIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import PageHeader from '@/components/PageHeader'
import * as Icons from 'lucide-react'
import { seedDownloads } from '@/lib/seed-data/downloads'

interface Software {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  icon: string // Icon name as string
  videoUrl?: string
  downloadUrl?: string
  category?: string
}

const softwareList: Software[] = seedDownloads

export default function DownloadsPage() {
  const { t, language } = useLanguage()
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const res = await fetch('/api/downloads')
        const data = await res.json()
        const downloads = (data.downloads || data.software || []) as Software[]
        const normalized = downloads.map((item) => ({
          ...item,
          icon: item.icon || 'FileText',
        }))
        setSoftware(normalized.length > 0 ? normalized : softwareList)
      } catch (error) {
        console.error('Error fetching software:', error)
        setSoftware(softwareList)
      } finally {
        setLoading(false)
      }
    }
    fetchSoftware()
  }, [])

  const handleWatch = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const getIcon = (iconName: string): LucideIcon => {
    // Type-safe icon lookup
    const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[iconName]
    if (IconComponent && typeof IconComponent === 'function') {
      return IconComponent
    }
    return FileText
  }

  return (
    <div className="page-container">
      <PageHeader
        title={t('downloads.title')}
        icon={Download}
        description={t('downloads.description')}
      />

        {loading ? (
          <div className="text-center py-20 text-dark-300">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {software.map((item, index) => {
                const SoftwareIcon = getIcon(item.icon)
                return (
                  <div
                    key={item.id}
                    className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80 hover:border-cyber-neon/40 transition-all duration-300 hover:scale-[1.02] group animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-cyber-dark/50 to-cyber-dark/30 border border-cyber-neon/20 flex items-center justify-center group-hover:border-cyber-neon/40 transition-all duration-300">
                      <div className="flex items-center justify-center w-full h-full">
                        <SoftwareIcon className="w-20 h-20 text-cyber-neon opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-dark-100 mb-2 text-center group-hover:text-cyber-neon transition-colors">
                      {language === 'ar' ? item.name : item.nameEn}
                    </h3>

                    <p className="text-sm text-dark-300 mb-4 text-center min-h-[60px]">
                      {language === 'ar' ? item.description : item.descriptionEn}
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleWatch(item.videoUrl || '#')}
                        className="w-full bg-gradient-to-r from-cyber-neon via-cyber-green to-cyber-neon bg-size-200 bg-pos-0 hover:bg-pos-100 text-dark-100 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-cyber-neon/30 active:scale-95"
                      >
                        <Play className="w-5 h-5" />
                        {t('downloads.watch')}
                      </button>

                      {item.downloadUrl && (
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full border border-cyber-neon/40 text-dark-100 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:border-cyber-neon"
                        >
                          <LinkIcon className="w-5 h-5" />
                          {language === 'ar' ? 'تحميل البرنامج' : 'Download Software'}
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {software.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <Download className="w-16 h-16 text-cyber-neon mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-dark-100 mb-4">
                  {language === 'ar' ? 'لا توجد برامج متاحة حالياً' : 'No software available at the moment'}
                </h3>
                <p className="text-dark-300">
                  {language === 'ar' ? 'سيتم إضافة البرامج قريباً' : 'Software will be added soon'}
                </p>
              </div>
            )}
          </>
        )}
    </div>
  )
}
