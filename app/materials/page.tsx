import { BookOpen, FileText, Download, Calendar, User, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function MaterialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100 mb-6">
            المواد التعليمية
          </h1>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            استكشف جميع المواد التعليمية والمحاضرات المتاحة
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center py-20 animate-slide-up">
          <div className="w-32 h-32 bg-gradient-to-r from-cyber-violet to-cyber-blue rounded-full flex items-center justify-center mx-auto mb-8">
            <BookOpen className="w-16 h-16 text-dark-100" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-cyber-violet to-cyber-green mb-6">
            قريباً جداً
          </h2>
          
          <h3 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-4">
            مكتبة المواد التعليمية قيد التطوير
          </h3>
          
          <p className="text-lg text-dark-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            نحن نعمل على إنشاء مكتبة شاملة للمواد التعليمية والمحاضرات. 
            ستحتوي على محتوى متنوع ومفيد لجميع الطلاب.
          </p>
          
          <div className="glass-card p-8 max-w-3xl mx-auto">
            <h4 className="text-xl font-semibold text-dark-100 mb-6">
              الميزات القادمة:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
              <div className="flex flex-col items-center gap-3 p-4 bg-cyber-dark/50 rounded-lg">
                <FileText className="w-8 h-8 text-cyber-neon" />
                <span className="text-dark-300">المحاضرات التفاعلية</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 bg-cyber-dark/50 rounded-lg">
                <Download className="w-8 h-8 text-cyber-violet" />
                <span className="text-dark-300">تحميل الملفات</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 bg-cyber-dark/50 rounded-lg">
                <Calendar className="w-8 h-8 text-cyber-green" />
                <span className="text-dark-300">جدولة المحتوى</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 bg-cyber-dark/50 rounded-lg">
                <User className="w-8 h-8 text-cyber-blue" />
                <span className="text-dark-300">ملفات الأساتذة</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 bg-cyber-dark/50 rounded-lg">
                <BookOpen className="w-8 h-8 text-cyber-neon" />
                <span className="text-dark-300">المراجع العلمية</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 bg-cyber-dark/50 rounded-lg">
                <ArrowRight className="w-8 h-8 text-cyber-violet" />
                <span className="text-dark-300">نظام التقييم</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center justify-center gap-2 text-cyber-neon">
              <BookOpen className="w-5 h-5" />
              <span className="text-lg font-medium">متاح قريباً</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}