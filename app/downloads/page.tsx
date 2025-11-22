'use client'

import { Play, Download, FileText, Trash2, Briefcase } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import PageHeader from '@/components/PageHeader'

interface Software {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  icon: LucideIcon
  videoUrl: string
}

const softwareList: Software[] = [
  {
    id: 'edrawmax',
    name: 'Wondershare EdrawMax',
    nameEn: 'Wondershare EdrawMax',
    description: 'برنامج احترافي لرسم مخططات ERD وقواعد البيانات',
    descriptionEn: 'Professional software for drawing ERD diagrams and databases',
    icon: FileText,
    videoUrl: '#' // سيتم إضافة رابط الفيديو لاحقاً
  },
  {
    id: 'revo',
    name: 'Revo Uninstaller',
    nameEn: 'Revo Uninstaller',
    description: 'أداة قوية لإزالة البرامج والملفات المتبقية من النظام',
    descriptionEn: 'Powerful tool for uninstalling programs and removing leftover files from the system',
    icon: Trash2,
    videoUrl: '#' // سيتم إضافة رابط الفيديو لاحقاً
  },
  {
    id: 'office',
    name: 'Microsoft Office',
    nameEn: 'Microsoft Office',
    description: 'حزمة برامج مايكروسوفت المكتبية (Word, Excel, PowerPoint)',
    descriptionEn: 'Microsoft Office suite (Word, Excel, PowerPoint)',
    icon: Briefcase,
    videoUrl: '#' // سيتم إضافة رابط الفيديو لاحقاً
  }
]

export default function DownloadsPage() {
  const { t, language } = useLanguage()

  const handleWatch = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Unified Page Header */}
        <PageHeader
          title={t('downloads.title')}
          icon={Download}
          description={t('downloads.description')}
        />

        {/* Software Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {softwareList.map((item, index) => {
            const SoftwareIcon = item.icon
            return (
              <div
                key={item.id}
                className="enhanced-card p-6 border-2 border-cyber-neon/20 bg-gradient-to-br from-cyber-dark/80 via-cyber-dark/60 to-cyber-dark/80 hover:border-cyber-neon/40 transition-all duration-300 hover:scale-[1.02] group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Software Icon */}
                <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-cyber-dark/50 to-cyber-dark/30 border border-cyber-neon/20 flex items-center justify-center group-hover:border-cyber-neon/40 transition-all duration-300">
                  <div className="flex items-center justify-center w-full h-full">
                    <SoftwareIcon className="w-20 h-20 text-cyber-neon opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  </div>
                </div>

                {/* Software Name */}
                <h3 className="text-lg font-bold text-dark-100 mb-2 text-center group-hover:text-cyber-neon transition-colors">
                  {language === 'ar' ? item.name : item.nameEn}
                </h3>

                {/* Software Description */}
                <p className="text-sm text-dark-300 mb-4 text-center min-h-[60px]">
                  {language === 'ar' ? item.description : item.descriptionEn}
                </p>

                {/* Watch Button */}
                <button
                  onClick={() => handleWatch(item.videoUrl)}
                  className="w-full bg-gradient-to-r from-cyber-neon via-cyber-green to-cyber-neon bg-size-200 bg-pos-0 hover:bg-pos-100 text-dark-100 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-cyber-neon/30 active:scale-95"
                >
                  <Play className="w-5 h-5" />
                  {t('downloads.watch')}
                </button>
              </div>
            )
          })}
        </div>

        {/* Empty State (if no software) */}
        {softwareList.length === 0 && (
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
      </div>
    </div>
  )
}

