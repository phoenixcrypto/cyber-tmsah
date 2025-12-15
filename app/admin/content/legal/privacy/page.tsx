'use client'

import { redirect } from 'next/navigation'

export default function AdminPrivacyPage() {
  redirect('/admin/content/legal?type=privacy')
}

