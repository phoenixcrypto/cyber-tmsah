import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Calendar,
  BookOpen,
  Download,
  Newspaper,
  BarChart3,
  Database,
  Shield,
  Bell,
  HelpCircle,
} from 'lucide-react'
import { getAdminBasePath } from '@/lib/utils/admin-path'

export interface SidebarItem {
  label: string
  icon: typeof LayoutDashboard
  href: string
  badge?: number
  children?: SidebarItem[]
}

export function getSidebarItems(): SidebarItem[] {
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
      badge: 12,
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
      label: 'الإحصائيات',
      icon: BarChart3,
      href: `${basePath}/analytics`,
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
      badge: 5,
    },
    {
      label: 'الإعدادات',
      icon: Settings,
      href: `${basePath}/settings`,
    },
    {
      label: 'المساعدة',
      icon: HelpCircle,
      href: `${basePath}/help`,
    },
  ]
}


