import { NextRequest, NextResponse } from 'next/server'
import { addPage, getPageBySlug } from '@/lib/db/pages'

/**
 * POST /api/admin/pages/import
 * Import existing static pages to database
 */
export async function POST(_request: NextRequest) {
  try {
    const staticPages = [
      {
        slug: 'about',
        title: 'من نحن',
        titleEn: 'About Us',
        content: '<p>محتوى صفحة من نحن</p>',
        contentEn: '<p>About Us page content</p>',
        metaDescription: 'تعرف على منصة سايبر تمساح وفريق العمل',
        metaDescriptionEn: 'Learn about Cyber TMSAH platform and team',
        status: 'published' as const,
        order: 1,
      },
      {
        slug: 'privacy',
        title: 'سياسة الخصوصية',
        titleEn: 'Privacy Policy',
        content: '<p>محتوى سياسة الخصوصية</p>',
        contentEn: '<p>Privacy Policy content</p>',
        metaDescription: 'سياسة الخصوصية لمنصة سايبر تمساح',
        metaDescriptionEn: 'Privacy Policy for Cyber TMSAH platform',
        status: 'published' as const,
        order: 2,
      },
      {
        slug: 'terms',
        title: 'شروط الاستخدام',
        titleEn: 'Terms of Service',
        content: '<p>محتوى شروط الاستخدام</p>',
        contentEn: '<p>Terms of Service content</p>',
        metaDescription: 'شروط وأحكام استخدام منصة سايبر تمساح',
        metaDescriptionEn: 'Terms and conditions for using Cyber TMSAH platform',
        status: 'published' as const,
        order: 3,
      },
      {
        slug: 'contact',
        title: 'اتصل بنا',
        titleEn: 'Contact Us',
        content: '<p>محتوى صفحة الاتصال</p>',
        contentEn: '<p>Contact page content</p>',
        metaDescription: 'تواصل معنا في منصة سايبر تمساح',
        metaDescriptionEn: 'Contact us at Cyber TMSAH platform',
        status: 'published' as const,
        order: 4,
      },
    ]

    const imported = []
    const skipped = []

    for (const pageData of staticPages) {
      // Check if page already exists
      const existing = getPageBySlug(pageData.slug)
      if (existing) {
        skipped.push(pageData.slug)
        continue
      }

      // Add page to database
      addPage(pageData)
      imported.push(pageData.slug)
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      message: `تم استيراد ${imported.length} صفحة، تم تخطي ${skipped.length} صفحة موجودة مسبقاً`,
    })
  } catch (error) {
    console.error('Error importing pages:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء استيراد الصفحات' },
      { status: 500 }
    )
  }
}

