import { NextRequest, NextResponse } from 'next/server'

interface DetectIconColorRequest {
  title: string
  description?: string
}

// Icon mapping based on keywords
const iconKeywords: Record<string, string[]> = {
  BookOpen: ['كتاب', 'مادة', 'دراسة', 'تعليم', 'تعلم', 'دورة', 'book', 'course', 'study', 'learn', 'education'],
  Shield: ['أمن', 'حماية', 'أمان', 'security', 'protection', 'safe', 'cyber', 'cybersecurity'],
  Lock: ['قفل', 'تشفير', 'حماية', 'lock', 'encryption', 'secure', 'privacy'],
  Key: ['مفتاح', 'مصادقة', 'key', 'authentication', 'access', 'login'],
  Code: ['كود', 'برمجة', 'تطوير', 'code', 'programming', 'development', 'developer', 'software'],
  Database: ['قاعدة بيانات', 'بيانات', 'database', 'data', 'storage', 'sql'],
  Network: ['شبكة', 'اتصال', 'network', 'connection', 'internet', 'web'],
  Server: ['خادم', 'سيرفر', 'server', 'hosting', 'cloud'],
  Terminal: ['طرفية', 'سطر أوامر', 'terminal', 'command', 'cli', 'bash'],
  FileCode: ['ملف', 'كود', 'file', 'code', 'script', 'programming'],
  Bug: ['خطأ', 'خلل', 'bug', 'error', 'debug', 'testing'],
  AlertTriangle: ['تحذير', 'تنبيه', 'alert', 'warning', 'danger', 'risk'],
  CheckCircle: ['نجاح', 'موافقة', 'check', 'success', 'approved', 'verified'],
  XCircle: ['إلغاء', 'رفض', 'cancel', 'reject', 'delete', 'remove'],
  Zap: ['سرعة', 'طاقة', 'zap', 'fast', 'power', 'energy', 'lightning'],
  Cpu: ['معالج', 'cpu', 'processor', 'hardware', 'computer'],
  HardDrive: ['قرص', 'تخزين', 'hard drive', 'storage', 'disk', 'ssd'],
  Wifi: ['واي فاي', 'لاسلكي', 'wifi', 'wireless', 'connection'],
  Globe: ['عالم', 'إنترنت', 'موقع', 'globe', 'world', 'internet', 'website', 'web'],
  Cloud: ['سحابة', 'تخزين سحابي', 'cloud', 'storage', 'online'],
  GitBranch: ['جيت', 'إصدار', 'git', 'version', 'control', 'repository'],
}

// Color mapping based on keywords and themes
const colorKeywords: Record<string, string[]> = {
  'from-blue-500 to-cyan-500': ['أمن', 'حماية', 'تقني', 'security', 'tech', 'cyber', 'technical', 'blue'],
  'from-purple-500 to-pink-500': ['تصميم', 'إبداع', 'فني', 'design', 'creative', 'art', 'purple', 'pink'],
  'from-green-500 to-emerald-500': ['نجاح', 'بيئة', 'نمو', 'success', 'environment', 'growth', 'green', 'nature'],
  'from-orange-500 to-red-500': ['تحذير', 'خطر', 'نار', 'warning', 'danger', 'fire', 'orange', 'red', 'alert'],
  'from-yellow-500 to-amber-500': ['طاقة', 'ضوء', 'energy', 'light', 'yellow', 'bright', 'sun'],
  'from-indigo-500 to-blue-500': ['احترافي', 'جدي', 'professional', 'serious', 'indigo', 'business'],
  'from-pink-500 to-rose-500': ['أنثوي', 'ناعم', 'feminine', 'soft', 'pink', 'rose', 'gentle'],
  'from-teal-500 to-cyan-500': ['حديث', 'عصري', 'modern', 'fresh', 'teal', 'cyan', 'contemporary'],
}

// Function to detect icon based on title and description
function detectIcon(title: string, description: string = ''): string {
  const text = `${title} ${description}`.toLowerCase()
  
  // Count matches for each icon
  const iconScores: Record<string, number> = {}
  
  for (const [icon, keywords] of Object.entries(iconKeywords)) {
    let score = 0
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += 1
      }
    }
    if (score > 0) {
      iconScores[icon] = score
    }
  }
  
  // Return icon with highest score, or default
  if (Object.keys(iconScores).length === 0) {
    return 'BookOpen' // Default
  }
  
  const sortedIcons = Object.entries(iconScores).sort((a, b) => b[1] - a[1])
  return sortedIcons[0]?.[0] || 'BookOpen'
}

// Function to detect color based on title and description
function detectColor(title: string, description: string = ''): string {
  const text = `${title} ${description}`.toLowerCase()
  
  // Count matches for each color
  const colorScores: Record<string, number> = {}
  
  for (const [color, keywords] of Object.entries(colorKeywords)) {
    let score = 0
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += 1
      }
    }
    if (score > 0) {
      colorScores[color] = score
    }
  }
  
  // Return color with highest score, or default
  if (Object.keys(colorScores).length === 0) {
    return 'from-blue-500 to-cyan-500' // Default
  }
  
  const sortedColors = Object.entries(colorScores).sort((a, b) => b[1] - a[1])
  return sortedColors[0]?.[0] || 'from-blue-500 to-cyan-500'
}

export async function POST(request: NextRequest) {
  try {
    const body: DetectIconColorRequest = await request.json()
    const { title, description = '' } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'العنوان مطلوب لتحديد الأيقونة واللون' },
        { status: 400 }
      )
    }

    const icon = detectIcon(title.trim(), description.trim())
    const color = detectColor(title.trim(), description.trim())

    return NextResponse.json({
      success: true,
      icon,
      color,
    })
  } catch (error) {
    console.error('Error detecting icon and color:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديد الأيقونة واللون' },
      { status: 500 }
    )
  }
}

