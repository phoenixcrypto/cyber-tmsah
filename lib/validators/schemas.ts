import { z } from 'zod'

/**
 * Login validation schema - using username instead of email
 */
export const loginSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
})

/**
 * User creation schema
 */
export const createUserSchema = z.object({
  username: z.string().min(2, 'اسم المستخدم يجب أن يكون حرفين على الأقل').optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional(),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    message: 'الصلاحية غير صحيحة',
  }),
})

/**
 * Schedule item schema
 */
export const scheduleItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'العنوان مطلوب'),
  time: z.string().min(1, 'الوقت مطلوب'),
  location: z.string().min(1, 'المكان مطلوب'),
  instructor: z.string().min(1, 'المحاضر مطلوب'),
  type: z.enum(['lecture', 'lab']),
  group: z.enum(['Group 1', 'Group 2']),
  sectionNumber: z.number().nullable(),
  day: z.enum(['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
})

/**
 * Material schema
 */
export const materialSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'العنوان (عربي) مطلوب'),
  titleEn: z.string().min(1, 'العنوان (إنجليزي) مطلوب'),
  description: z.string().min(1, 'الوصف (عربي) مطلوب'),
  descriptionEn: z.string().min(1, 'الوصف (إنجليزي) مطلوب'),
  icon: z.string().min(1, 'اسم الأيقونة مطلوب'),
  color: z.string().min(1, 'اللون مطلوب'),
  articlesCount: z.number().default(0),
  lastUpdated: z.string().optional(),
})

/**
 * Download software schema
 */
export const downloadSoftwareSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'الاسم مطلوب'),
  nameEn: z.string().min(1, 'الاسم بالإنجليزية مطلوب'),
  description: z.string(),
  descriptionEn: z.string(),
  icon: z.string().min(1, 'اسم الأيقونة مطلوب'),
  videoUrl: z.string().url('رابط الفيديو غير صحيح').or(z.literal('#')),
})

/**
 * Article schema
 */
export const articleSchema = z.object({
  id: z.string().optional(),
  materialId: z.string().min(1, 'معرف المادة مطلوب'),
  title: z.string().min(1, 'العنوان (عربي) مطلوب'),
  titleEn: z.string().min(1, 'العنوان (إنجليزي) مطلوب'),
  content: z.string().min(1, 'المحتوى (عربي) مطلوب'),
  contentEn: z.string().min(1, 'المحتوى (إنجليزي) مطلوب'),
  excerpt: z.string().optional(),
  excerptEn: z.string().optional(),
  author: z.string().min(1, 'المؤلف مطلوب'),
  status: z.enum(['published', 'draft']).default('draft'),
  publishedAt: z.string().optional(),
  views: z.number().default(0),
  tags: z.array(z.string()).optional(),
})

/**
 * Page schema
 */
export const pageSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1, 'الرابط مطلوب'),
  title: z.string().min(1, 'العنوان (عربي) مطلوب'),
  titleEn: z.string().min(1, 'العنوان (إنجليزي) مطلوب'),
  content: z.string().min(1, 'المحتوى (عربي) مطلوب'),
  contentEn: z.string().min(1, 'المحتوى (إنجليزي) مطلوب'),
  metaDescription: z.string().optional(),
  metaDescriptionEn: z.string().optional(),
  status: z.enum(['published', 'draft']).default('draft'),
  order: z.number().optional(),
})

