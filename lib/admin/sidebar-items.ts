import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Calendar,
  BookOpen,
  Download,
  BarChart3,
  Database,
  Shield,
  Bell,
  Newspaper,
  Palette,
  Globe,
  Image as ImageIcon,
  Mail,
  Activity,
  Search,
  Type,
  Layout,
  Link as LinkIcon,
} from 'lucide-react'
import { getAdminBasePath } from '@/lib/utils/admin-path'

export interface SidebarItem {
  label: string
  icon: typeof LayoutDashboard
  href: string
  badge?: number | (() => Promise<number>)
  children?: SidebarItem[]
}

export async function getSidebarItems(): Promise<SidebarItem[]> {
  const basePath = getAdminBasePath()
  
  // Fetch real counts for badges
  let usersCount = 0
  let notificationsCount = 0
  
  try {
    const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'] || 'http://localhost:3000'
    const [usersRes, notificationsRes] = await Promise.all([
      fetch(`${baseUrl}/api/admin/users`).catch(() => null),
      fetch(`${baseUrl}/api/admin/activities`).catch(() => null),
    ])
    
    if (usersRes?.ok) {
      const usersData = await usersRes.json()
      usersCount = usersData.data?.users?.length || 0
    }
    
    if (notificationsRes?.ok) {
      const notificationsData = await notificationsRes.json()
      const activities = notificationsData.data?.activities || []
      notificationsCount = activities.filter((a: { type?: string; success?: boolean }) => a.type === 'login' && !a.success).length
    }
  } catch (error) {
    console.error('Error fetching sidebar counts:', error)
  }

  return [
    {
      label: 'لوحة التحكم',
      icon: LayoutDashboard,
      href: basePath,
    },
    {
      label: 'المستخدمين',
      icon: Users,
      href: `${basePath}/users`,
      badge: usersCount,
    },
    {
      label: 'المحتوى',
      icon: FileText,
      href: `${basePath}/content`,
      children: [
        { label: 'المواد الدراسية', icon: BookOpen, href: `${basePath}/content/materials` },
        { label: 'المقالات', icon: FileText, href: `${basePath}/content/articles` },
        { label: 'الصفحات', icon: FileText, href: `${basePath}/content/pages` },
        { label: 'الأخبار', icon: Newspaper, href: `${basePath}/content/news` },
      ],
    },
    {
      label: 'الجدول الدراسي',
      icon: Calendar,
      href: `${basePath}/schedule`,
    },
    {
      label: 'التنزيلات',
      icon: Download,
      href: `${basePath}/downloads`,
    },
    {
      label: 'التصميم والثيم',
      icon: Palette,
      href: `${basePath}/design`,
      children: [
        { label: 'الألوان والثيم', icon: Palette, href: `${basePath}/design/theme` },
        { label: 'الخطوط', icon: Type, href: `${basePath}/design/fonts` },
        { label: 'التخطيط', icon: Layout, href: `${basePath}/design/layout` },
        { label: 'الصور والوسائط', icon: ImageIcon, href: `${basePath}/design/media` },
      ],
    },
    {
      label: 'الإعدادات',
      icon: Settings,
      href: `${basePath}/settings`,
      children: [
        { label: 'الإعدادات العامة', icon: Globe, href: `${basePath}/settings` },
        { label: 'SEO', icon: Search, href: `${basePath}/settings/seo` },
        { label: 'الشعار والهوية', icon: ImageIcon, href: `${basePath}/settings/branding` },
        { label: 'القوائم والروابط', icon: LinkIcon, href: `${basePath}/settings/menus` },
        { label: 'البريد الإلكتروني', icon: Mail, href: `${basePath}/settings/email` },
      ],
    },
    {
      label: 'الإحصائيات',
      icon: BarChart3,
      href: `${basePath}/analytics`,
    },
    {
      label: 'النشاطات',
      icon: Activity,
      href: `${basePath}/activity`,
    },
    {
      label: 'قاعدة البيانات',
      icon: Database,
      href: `${basePath}/database`,
    },
    {
      label: 'الأمان',
      icon: Shield,
      href: `${basePath}/security`,
    },
    {
      label: 'الإشعارات',
      icon: Bell,
      href: `${basePath}/notifications`,
      badge: notificationsCount,
    },
    {
      label: 'الملف الشخصي',
      icon: Users,
      href: `${basePath}/profile`,
    },
  ]
}

// Client-side version for use in components
export function getSidebarItemsSync(): SidebarItem[] {
  const basePath = getAdminBasePath()
  return [
    {
      label: 'لوحة التحكم',
      icon: LayoutDashboard,
      href: basePath,
    },
    {
      label: 'المستخدمين',
      icon: Users,
      href: `${basePath}/users`,
    },
    {
      label: 'المحتوى',
      icon: FileText,
      href: `${basePath}/content`,
      children: [
        { label: 'المواد الدراسية', icon: BookOpen, href: `${basePath}/content/materials` },
        { label: 'المقالات', icon: FileText, href: `${basePath}/content/articles` },
        { label: 'الصفحات', icon: FileText, href: `${basePath}/content/pages` },
        { label: 'الأخبار', icon: Newspaper, href: `${basePath}/content/news` },
      ],
    },
    {
      label: 'الجدول الدراسي',
      icon: Calendar,
      href: `${basePath}/schedule`,
    },
    {
      label: 'التنزيلات',
      icon: Download,
      href: `${basePath}/downloads`,
    },
    {
      label: 'التصميم والثيم',
      icon: Palette,
      href: `${basePath}/design`,
      children: [
        { label: 'الألوان والثيم', icon: Palette, href: `${basePath}/design/theme` },
        { label: 'الخطوط', icon: Type, href: `${basePath}/design/fonts` },
        { label: 'التخطيط', icon: Layout, href: `${basePath}/design/layout` },
        { label: 'الصور والوسائط', icon: ImageIcon, href: `${basePath}/design/media` },
      ],
    },
    {
      label: 'الإعدادات',
      icon: Settings,
      href: `${basePath}/settings`,
      children: [
        { label: 'الإعدادات العامة', icon: Globe, href: `${basePath}/settings` },
        { label: 'SEO', icon: Search, href: `${basePath}/settings/seo` },
        { label: 'الشعار والهوية', icon: ImageIcon, href: `${basePath}/settings/branding` },
        { label: 'القوائم والروابط', icon: LinkIcon, href: `${basePath}/settings/menus` },
        { label: 'البريد الإلكتروني', icon: Mail, href: `${basePath}/settings/email` },
      ],
    },
    {
      label: 'الإحصائيات',
      icon: BarChart3,
      href: `${basePath}/analytics`,
    },
    {
      label: 'النشاطات',
      icon: Activity,
      href: `${basePath}/activity`,
    },
    {
      label: 'قاعدة البيانات',
      icon: Database,
      href: `${basePath}/database`,
    },
    {
      label: 'الأمان',
      icon: Shield,
      href: `${basePath}/security`,
    },
    {
      label: 'الإشعارات',
      icon: Bell,
      href: `${basePath}/notifications`,
    },
    {
      label: 'الملف الشخصي',
      icon: Users,
      href: `${basePath}/profile`,
    },
  ]
}
