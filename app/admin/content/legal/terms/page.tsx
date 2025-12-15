'use client'

import { redirect } from 'next/navigation'

export default function AdminTermsPage() {
  redirect('/admin/content/legal?type=terms')
}

