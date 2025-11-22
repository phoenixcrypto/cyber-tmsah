import { z } from 'zod'

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
})

/**
 * User creation schema
 */
export const createUserSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
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

