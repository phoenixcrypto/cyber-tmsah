import Link from 'next/link'
import { BookOpen, FileText, Download, Calendar, User, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function MaterialsPage() {
  const materials = [
    {
      id: '1',
      title: 'مقدمة في البرمجة',
      description: 'تعلم أساسيات البرمجة والمفاهيم الأساسية',
      type: 'lecture',
      instructor: 'د. أحمد محمد',
      date: '2024-02-01',
      attachments: ['intro-programming.pdf', 'examples.zip'],
      points: 100
    },
    {
      id: '2',
      title: 'الواجب الأول - البرمجة',
      description: 'تطبيق المفاهيم المكتسبة في البرمجة',
      type: 'assignment',
      instructor: 'د. أحمد محمد',
      date: '2024-02-15',
      attachments: ['assignment-1.pdf'],
      points: 50
    },
    {
      id: '3',
      title: 'امتحان منتصف الفصل',
      description: 'امتحان شامل على المواد المغطاة',
      type: 'exam',
      instructor: 'د. أحمد محمد',
      date: '2024-03-01',
      attachments: ['midterm-exam.pdf'],
      points: 200
    },
    {
      id: '4',
      title: 'هياكل البيانات',
      description: 'تعلم هياكل البيانات والخوارزميات',
      type: 'lecture',
      instructor: 'د. محمد علي',
      date: '2024-02-05',
      attachments: ['data-structures.pdf', 'algorithms.zip'],
      points: 120
    },
    {
      id: '5',
      title: 'قواعد البيانات',
      description: 'مقدمة في قواعد البيانات ونظم إدارة قواعد البيانات',
      type: 'lecture',
      instructor: 'د. فاطمة حسن',
      date: '2024-02-10',
      attachments: ['database-intro.pdf', 'sql-examples.zip'],
      points: 150
    },
    {
      id: '6',
      title: 'أنظمة التشغيل',
      description: 'تعلم أساسيات أنظمة التشغيل وإدارتها',
      type: 'lecture',
      instructor: 'د. نور الدين',
      date: '2024-02-12',
      attachments: ['operating-systems.pdf'],
      points: 130
    }
  ]

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

        {/* Filter and Search */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded-lg bg-cyber-neon/20 border border-cyber-neon/30 text-cyber-neon hover:bg-cyber-neon/30 transition-all duration-300 text-sm font-medium">
                جميع المواد
              </button>
              <button className="px-4 py-2 rounded-lg bg-cyber-dark/50 border border-cyber-neon/20 text-dark-200 hover:bg-cyber-neon/10 hover:text-cyber-neon transition-all duration-300 text-sm font-medium">
                المحاضرات
              </button>
              <button className="px-4 py-2 rounded-lg bg-cyber-dark/50 border border-cyber-neon/20 text-dark-200 hover:bg-cyber-neon/10 hover:text-cyber-neon transition-all duration-300 text-sm font-medium">
                الواجبات
              </button>
              <button className="px-4 py-2 rounded-lg bg-cyber-dark/50 border border-cyber-neon/20 text-dark-200 hover:bg-cyber-neon/10 hover:text-cyber-neon transition-all duration-300 text-sm font-medium">
                الامتحانات
              </button>
            </div>
            
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="البحث في المواد..."
                className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg text-dark-100 placeholder-dark-400 focus:border-cyber-neon focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material, index) => {
            const TypeIcon = getTypeIcon(material.type)
            return (
              <Link
                key={material.id}
                href={`/materials/${material.id}`}
                className="group block"
              >
                <div className="enhanced-card p-6 h-full hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                     style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${getTypeColor(material.type)} rounded-xl flex items-center justify-center`}>
                      <TypeIcon className="w-6 h-6 text-dark-100" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-cyber-neon/20 text-cyber-neon font-medium">
                        {getTypeText(material.type)}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-cyber-violet/20 text-cyber-violet font-medium">
                        {material.points} نقطة
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-dark-100 mb-3 line-clamp-2 group-hover:text-cyber-neon transition-colors">
                    {material.title}
                  </h3>
                  
                  <p className="text-dark-300 mb-4 line-clamp-3 group-hover:text-dark-200 transition-colors">
                    {material.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-dark-300">
                      <User className="w-4 h-4 text-cyber-neon" />
                      <span className="text-sm">{material.instructor}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-dark-300">
                      <Calendar className="w-4 h-4 text-cyber-violet" />
                      <span className="text-sm">{formatDate(material.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-dark-300">
                      <Download className="w-4 h-4 text-cyber-green" />
                      <span className="text-sm">{material.attachments.length} مرفق</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-cyber-neon font-medium">
                      عرض التفاصيل
                    </span>
                    <ArrowRight className="w-4 h-4 text-cyber-neon group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Empty State */}
        {materials.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <BookOpen className="w-16 h-16 text-cyber-neon mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-dark-100 mb-4">
              لا توجد مواد متاحة
            </h3>
            <p className="text-dark-300">
              سيتم إضافة المواد التعليمية قريباً. ابق متابعاً للتحديثات!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}