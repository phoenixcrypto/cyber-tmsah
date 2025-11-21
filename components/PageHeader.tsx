'use client'

import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  icon: LucideIcon
  description?: string
}

export default function PageHeader({ title, icon: Icon, description }: PageHeaderProps) {
  return (
    <div className="page-header-unified-2026">
      <div className="page-header-icon-wrapper">
        <Icon className="w-6 h-6" />
      </div>
      <h1 className="page-header-title-unified">{title}</h1>
      <div className="page-header-icon-wrapper">
        <Icon className="w-6 h-6" />
      </div>
      {description && (
        <p className="page-header-description-unified">{description}</p>
      )}
    </div>
  )
}

