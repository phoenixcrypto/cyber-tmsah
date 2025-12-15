'use client'

import { memo } from 'react'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  icon: LucideIcon
  description?: string
}

function PageHeader({ title, icon: Icon, description }: PageHeaderProps) {
  return (
    <div className="page-header-professional">
      <div className="page-header-content">
        <div className="page-header-icon-container">
          <Icon className="page-header-icon" />
        </div>
        <div className="page-header-text">
          <h1 className="page-header-title">{title}</h1>
          {description && (
            <p className="page-header-description">{description}</p>
          )}
        </div>
      </div>
      <div className="page-header-divider"></div>
    </div>
  )
}

export default memo(PageHeader)
