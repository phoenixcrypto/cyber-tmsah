import Link from 'next/link'
import { ArrowLeft, BookOpen, Download, Calendar, User, FileText, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function MaterialDetailPage({ params }: { params: { id: string } }) {
  const material = {
    id: params.id,
    title: 'مقدمة في البرمجة',
    description: 'تعلم أساسيات البرمجة والمفاهيم الأساسية',
    type: 'lecture',
    instructor: 'د. أحمد محمد',
    date: '2024-02-01',
    content: `
      <h2>مقدمة في البرمجة</h2>
      <p>البرمجة هي عملية كتابة تعليمات للحاسوب لتنفيذ مهام محددة. في هذا الدرس سنتعلم:</p>
      <ul>
        <li>مفهوم البرمجة وأهميتها</li>
        <li>أنواع لغات البرمجة</li>
        <li>أساسيات البرمجة</li>
        <li>أمثلة عملية</li>
      </ul>
      
      <h3>مفهوم البرمجة</h3>
      <p>البرمجة هي فن وعلم كتابة التعليمات للحاسوب بطريقة منطقية ومنظمة. المبرمج يكتب الكود باستخدام لغة برمجة معينة، ثم يتم تحويل هذا الكود إلى لغة يفهمها الحاسوب.</p>
      
      <h3>أنواع لغات البرمجة</h3>
      <p>هناك عدة أنواع من لغات البرمجة:</p>
      <ul>
        <li><strong>لغات البرمجة عالية المستوى:</strong> مثل Python, Java, C++</li>
        <li><strong>لغات البرمجة منخفضة المستوى:</strong> مثل Assembly</li>
        <li><strong>لغات البرمجة الوظيفية:</strong> مثل Haskell, Lisp</li>
        <li><strong>لغات البرمجة الكائنية:</strong> مثل Java, C#</li>
      </ul>
      
      <h3>أساسيات البرمجة</h3>
      <p>أساسيات البرمجة تشمل:</p>
      <ul>
        <li>المتغيرات والثوابت</li>
        <li>أنواع البيانات</li>
        <li>الهياكل الشرطية</li>
        <li>الحلقات التكرارية</li>
        <li>الدوال والإجراءات</li>
      </ul>
      
      <h3>أمثلة عملية</h3>
      <p>إليك مثال بسيط في لغة Python:</p>
      <pre><code># برنامج بسيط لطباعة رسالة ترحيب
name = input("ما اسمك؟ ")
print(f"مرحباً {name}!")

# برنامج لحساب مجموع عددين
a = int(input("أدخل الرقم الأول: "))
b = int(input("أدخل الرقم الثاني: "))
sum = a + b
print(f"المجموع هو: {sum}")</code></pre>
      
      <h3>الخلاصة</h3>
      <p>البرمجة مهارة مهمة في العصر الحديث. تعلم البرمجة يساعد على:</p>
      <ul>
        <li>تطوير التفكير المنطقي</li>
        <li>حل المشاكل بطريقة منهجية</li>
        <li>إنشاء تطبيقات مفيدة</li>
        <li>فتح آفاق مهنية جديدة</li>
      </ul>
    `,
    attachments: [
      { name: 'intro-programming.pdf', size: '2.5 MB', type: 'PDF' },
      { name: 'examples.zip', size: '1.2 MB', type: 'ZIP' },
      { name: 'slides.pptx', size: '3.8 MB', type: 'PPTX' }
    ],
    points: 100,
    duration: '90 دقيقة'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-gradient-to-r from-cyber-neon to-cyber-green'
      case 'assignment':
        return 'bg-gradient-to-r from-cyber-violet to-cyber-blue'
      case 'exam':
        return 'bg-gradient-to-r from-red-500 to-red-600'
      case 'resource':
        return 'bg-gradient-to-r from-cyber-green to-cyber-neon'
      default:
        return 'bg-gradient-to-r from-cyber-blue to-cyber-violet'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture':
        return BookOpen
      case 'assignment':
        return FileText
      case 'exam':
        return Calendar
      case 'resource':
        return Download
      default:
        return BookOpen
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'محاضرة'
      case 'assignment':
        return 'واجب'
      case 'exam':
        return 'امتحان'
      case 'resource':
        return 'مصدر تعليمي'
      default:
        return 'غير محدد'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const TypeIcon = getTypeIcon(material.type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/materials"
            className="inline-flex items-center gap-2 text-cyber-neon hover:text-cyber-violet transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة إلى المواد
          </Link>
          
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${getTypeColor(material.type)} rounded-xl flex items-center justify-center`}>
                  <TypeIcon className="w-6 h-6 text-dark-100" />
                </div>
                <div>
                  <span className="text-sm px-3 py-1 rounded-full bg-cyber-neon/20 text-cyber-neon font-medium">
                    {getTypeText(material.type)}
                  </span>
                  <span className="text-sm px-3 py-1 rounded-full bg-cyber-violet/20 text-cyber-violet font-medium mr-2">
                    {material.points} نقطة
                  </span>
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-dark-100 mb-4">
                {material.title}
              </h1>
              
              <p className="text-lg text-dark-300 mb-6">
                {material.description}
              </p>
            </div>
          </div>
        </div>

        {/* Material Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-cyber-neon" />
              <div>
                <p className="text-sm text-dark-400">المحاضر</p>
                <p className="text-dark-100 font-medium">{material.instructor}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-cyber-violet" />
              <div>
                <p className="text-sm text-dark-400">تاريخ النشر</p>
                <p className="text-dark-100 font-medium">{formatDate(material.date)}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyber-green" />
              <div>
                <p className="text-sm text-dark-400">المدة</p>
                <p className="text-dark-100 font-medium">{material.duration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="enhanced-card p-8 mb-8 animate-slide-up-delayed">
          <h2 className="text-2xl font-semibold text-dark-100 mb-6">
            محتوى المادة
          </h2>
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: material.content }}
          />
        </div>

        {/* Attachments */}
        <div className="enhanced-card p-8 animate-slide-up-delayed">
          <h2 className="text-2xl font-semibold text-dark-100 mb-6">
            المرفقات
          </h2>
          
          <div className="space-y-4">
            {material.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-cyber-dark/50 rounded-lg border border-cyber-neon/20 hover:border-cyber-neon/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-cyber-neon" />
                  <div>
                    <p className="text-dark-100 font-medium">{attachment.name}</p>
                    <p className="text-sm text-dark-400">{attachment.size} • {attachment.type}</p>
                  </div>
                </div>
                
                <button className="btn-secondary text-sm px-4 py-2">
                  تحميل
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}