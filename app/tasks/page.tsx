import { CheckSquare, Clock, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-neon via-cyber-violet to-cyber-green rounded-xl flex items-center justify-center shadow-lg shadow-cyber-neon/30">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100">
              إدارة المهام
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            نظم مهامك وواجباتك واتبع تقدمك في التعلم
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center py-20 animate-slide-up">
          <div className="w-32 h-32 bg-gradient-to-r from-cyber-neon to-cyber-green rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckSquare className="w-16 h-16 text-cyber-dark" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-cyber-violet to-cyber-green mb-6">
            قريباً جداً
          </h2>
          
          <h3 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-4">
            نظام إدارة المهام قيد التطوير
          </h3>
          
          <p className="text-lg text-dark-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            نحن نعمل على تطوير نظام متقدم لإدارة المهام والواجبات. 
            سيكون متاحاً قريباً مع ميزات رائعة لتنظيم دراستك ومتابعة تقدمك.
          </p>
          
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h4 className="text-xl font-semibold text-dark-100 mb-4">
              الميزات القادمة:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-cyber-green" />
                <span className="text-dark-300">تنظيم المهام حسب الأولوية</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-cyber-green" />
                <span className="text-dark-300">تتبع التقدم والإنجاز</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-cyber-green" />
                <span className="text-dark-300">تذكيرات المواعيد النهائية</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-cyber-green" />
                <span className="text-dark-300">نظام النقاط والجوائز</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center justify-center gap-2 text-cyber-neon">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-medium">متاح قريباً</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}