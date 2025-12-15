/**
 * Advanced SEO Optimizer
 */

import { getArticles, getMaterials, getPages } from '@/lib/content/api'

export interface SEOData {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  ogType?: string
  canonical?: string
  schema?: any
}

/**
 * Generate SEO data for page
 */
export async function generateSEOData(
  type: 'home' | 'article' | 'material' | 'page',
  id?: string
): Promise<SEOData> {
  switch (type) {
    case 'home':
      return generateHomeSEO()
    
    case 'article':
      if (!id) throw new Error('Article ID is required')
      return generateArticleSEO(id)
    
    case 'material':
      if (!id) throw new Error('Material ID is required')
      return generateMaterialSEO(id)
    
    case 'page':
      if (!id) throw new Error('Page slug is required')
      return generatePageSEO(id)
    
    default:
      return generateHomeSEO()
  }
}

async function generateHomeSEO(): Promise<SEOData> {
  return {
    title: 'Cyber TMSAH | المنصة الأكاديمية الشاملة',
    description: 'منصة Cyber TMSAH الشاملة تجمع بين الجداول الدراسية التفاعلية والمصادر التعليمية المتخصصة ودليل الأمن السيبراني الشامل.',
    keywords: ['Cyber TMSAH', 'الأمن السيبراني', 'جدول المحاضرات', 'مصادر تعليمية'],
    ogType: 'website',
    canonical: '/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Cyber TMSAH',
      description: 'المنصة الأكاديمية الشاملة',
      url: process.env['NEXT_PUBLIC_BASE_URL'] || 'https://cyber-tmsah.site',
    },
  }
}

async function generateArticleSEO(id: string): Promise<SEOData> {
  const article = await import('@/lib/content/api').then((m) => m.getArticle(id))
  
  if (!article) {
    return generateHomeSEO()
  }

  return {
    title: `${article.title} | Cyber TMSAH`,
    description: article.excerpt || article.content?.substring(0, 155) || '',
    keywords: (article.tags as string[]) || [],
    ogType: 'article',
    canonical: `/articles/${id}`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      author: {
        '@type': 'Person',
        name: article.author,
      },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
    },
  }
}

async function generateMaterialSEO(id: string): Promise<SEOData> {
  const material = await import('@/lib/content/api').then((m) => m.getMaterial(id))
  
  if (!material) {
    return generateHomeSEO()
  }

  return {
    title: `${material.title} | Cyber TMSAH`,
    description: material.description?.substring(0, 155) || '',
    keywords: [material.title, 'مادة دراسية', 'تعليم'],
    ogType: 'website',
    canonical: `/materials/${id}`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: material.title,
      description: material.description,
    },
  }
}

async function generatePageSEO(slug: string): Promise<SEOData> {
  const page = await import('@/lib/content/api').then((m) => m.getPage(slug))
  
  if (!page) {
    return generateHomeSEO()
  }

  return {
    title: `${page.title} | Cyber TMSAH`,
    description: page.metaDescription || page.content?.substring(0, 155) || '',
    keywords: [page.title],
    ogType: 'website',
    canonical: `/${slug}`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.metaDescription,
    },
  }
}

/**
 * Generate sitemap
 */
export async function generateSitemap(): Promise<string> {
  const articles = await getArticles({ status: 'published' })
  const materials = await getMaterials()
  const pages = await getPages({ status: 'published' })
  
  const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'] || 'https://cyber-tmsah.site'
  
  const urls = [
    { loc: baseUrl, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/materials`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/schedule`, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseUrl}/downloads`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.6' },
  ]

  // Add articles
  articles.forEach((article: any) => {
    urls.push({
      loc: `${baseUrl}/articles/${article.id}`,
      changefreq: 'weekly',
      priority: '0.7',
    })
  })

  // Add materials
  materials.forEach((material: any) => {
    urls.push({
      loc: `${baseUrl}/materials/${material.id}`,
      changefreq: 'weekly',
      priority: '0.7',
    })
  })

  // Add pages
  pages.forEach((page: any) => {
    urls.push({
      loc: `${baseUrl}/${page.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
    })
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return sitemap
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt(): string {
  const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'] || 'https://cyber-tmsah.site'
  
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`
}

