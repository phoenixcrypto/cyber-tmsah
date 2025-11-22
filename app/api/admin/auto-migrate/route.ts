import { NextRequest, NextResponse } from 'next/server'
import { getAllPages } from '@/lib/db/pages'
import { getAllUsers } from '@/lib/db/users'
import { initializeDefaultAdmin } from '@/lib/db/users'
import { addPage, getPageBySlug } from '@/lib/db/pages'
import { extractAboutContent, extractContactContent, extractPrivacyContent, extractTermsContent, extractContributeContent, extractRoadmapContent, extractExpertiseGuideContent } from './page-content-extractors'

/**
 * POST /api/admin/auto-migrate
 * Auto-migrate all data on first run
 */
export async function POST(_request: NextRequest) {
  try {
    const results = {
      users: { migrated: false, message: '' },
      pages: { migrated: 0, skipped: 0, errors: [] as string[] },
    }

    // 1. Initialize default admin user
    try {
      await initializeDefaultAdmin()
      const users = getAllUsers()
      if (users.length > 0) {
        results.users.migrated = true
        results.users.message = `Default admin user initialized (${users.length} users total)`
      }
    } catch (error) {
      console.error('Error initializing admin:', error)
      results.users.message = `Error: ${error instanceof Error ? error.message : String(error)}`
    }

    // 2. Auto-import all pages if they don't exist
    const pagesToImport = [
      {
        slug: 'about',
        title: 'من نحن',
        titleEn: 'About Us',
        content: extractAboutContent(),
        contentEn: '<p>About Us page content</p>',
        metaDescription: 'تعرف على منصة سايبر تمساح وفريق العمل',
        metaDescriptionEn: 'Learn about Cyber TMSAH platform and team',
        status: 'published' as const,
        order: 1,
      },
      {
        slug: 'contact',
        title: 'اتصل بنا',
        titleEn: 'Contact Us',
        content: extractContactContent(),
        contentEn: '<p>Contact Us page content</p>',
        metaDescription: 'تواصل معنا في منصة سايبر تمساح',
        metaDescriptionEn: 'Contact us at Cyber TMSAH platform',
        status: 'published' as const,
        order: 2,
      },
      {
        slug: 'privacy',
        title: 'سياسة الخصوصية',
        titleEn: 'Privacy Policy',
        content: extractPrivacyContent(),
        contentEn: '<p>Privacy Policy content</p>',
        metaDescription: 'سياسة الخصوصية لمنصة سايبر تمساح',
        metaDescriptionEn: 'Privacy Policy for Cyber TMSAH platform',
        status: 'published' as const,
        order: 3,
      },
      {
        slug: 'terms',
        title: 'شروط الاستخدام',
        titleEn: 'Terms of Service',
        content: extractTermsContent(),
        contentEn: '<p>Terms of Service content</p>',
        metaDescription: 'شروط وأحكام استخدام منصة سايبر تمساح',
        metaDescriptionEn: 'Terms and conditions for using Cyber TMSAH platform',
        status: 'published' as const,
        order: 4,
      },
      {
        slug: 'contribute',
        title: 'ساهم معنا',
        titleEn: 'Contribute',
        content: extractContributeContent(),
        contentEn: '<p>Contribute page content</p>',
        metaDescription: 'ساهم في تطوير منصة سايبر تمساح',
        metaDescriptionEn: 'Contribute to Cyber TMSAH platform',
        status: 'published' as const,
        order: 5,
      },
      {
        slug: 'roadmap',
        title: 'خريطة الطريق',
        titleEn: 'Roadmap',
        content: extractRoadmapContent(),
        contentEn: '<p>Roadmap page content</p>',
        metaDescription: 'خريطة الطريق لتعلم الأمن السيبراني',
        metaDescriptionEn: 'Roadmap for learning cybersecurity',
        status: 'published' as const,
        order: 6,
      },
      {
        slug: 'expertise-guide',
        title: 'دليل الخبراء',
        titleEn: 'Expertise Guide',
        content: extractExpertiseGuideContent(),
        contentEn: '<p>Expertise Guide page content</p>',
        metaDescription: 'دليل الخبراء في الأمن السيبراني',
        metaDescriptionEn: 'Expertise guide for cybersecurity',
        status: 'published' as const,
        order: 7,
      },
    ]

    for (const pageData of pagesToImport) {
      try {
        const existing = getPageBySlug(pageData.slug)
        if (existing) {
          results.pages.skipped++
          continue
        }
        addPage(pageData)
        results.pages.migrated++
      } catch (error) {
        const errorMsg = `Error importing ${pageData.slug}: ${error instanceof Error ? error.message : String(error)}`
        results.pages.errors.push(errorMsg)
        console.error(errorMsg)
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Auto-migration completed: ${results.pages.migrated} pages imported, ${results.pages.skipped} skipped, ${results.pages.errors.length} errors`,
    })
  } catch (error) {
    console.error('Error in auto-migration:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء النقل التلقائي', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/auto-migrate
 * Check migration status
 */
export async function GET(_request: NextRequest) {
  try {
    const pages = getAllPages()
    const users = getAllUsers()
    
    return NextResponse.json({
      success: true,
      status: {
        pages: pages.length,
        users: users.length,
        needsMigration: pages.length === 0 || users.length === 0,
      },
    })
  } catch (error) {
    console.error('Error checking migration status:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء فحص حالة النقل' },
      { status: 500 }
    )
  }
}

