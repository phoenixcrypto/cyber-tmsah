import Link from 'next/link'
import type { ReactNode } from 'react'

type Action = {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
}

interface SectionPlaceholderProps {
  title: string
  description: string
  hint?: string
  actions?: Action[]
  children?: ReactNode
}

export default function SectionPlaceholder({
  title,
  description,
  hint,
  actions = [],
  children,
}: SectionPlaceholderProps) {
  return (
    <section className="admin-section">
      <div className="admin-section-card">
        <div className="admin-section-header">
          <div>
            <h1 className="admin-page-title">{title}</h1>
            <p className="admin-page-description">{description}</p>
          </div>
          {actions.length > 0 && (
            <div className="admin-section-actions">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`admin-section-action admin-section-action-${action.variant || 'primary'}`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {children ? (
          children
        ) : (
          <div className="admin-empty-state">
            <div className="admin-empty-state-glow" />
            <p>هذه الصفحة قيد التطوير حالياً. يمكنك العودة لاحقاً أو التواصل معنا لإضافة أي متطلبات خاصة.</p>
            {hint && <span className="admin-empty-hint">{hint}</span>}
          </div>
        )}
      </div>
    </section>
  )
}


