import { CheckSquare, Clock, AlertCircle, CheckCircle, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function TasksPage() {
  const tasks = [
    {
      id: '1',
      title: 'إكمال الواجب الأول',
      description: 'إنهاء جميع التمارين في الواجب الأول',
      dueDate: '2024-02-15',
      priority: 'high',
      status: 'pending',
      points: 50
    },
    {
      id: '2',
      title: 'مراجعة المحاضرة الثالثة',
      description: 'مراجعة المحاضرة الثالثة وحل التمارين',
      dueDate: '2024-02-20',
      priority: 'medium',
      status: 'in-progress',
      points: 30
    },
    {
      id: '3',
      title: 'تحضير العرض التقديمي',
      description: 'تحضير العرض التقديمي للمشروع النهائي',
      dueDate: '2024-03-01',
      priority: 'high',
      status: 'pending',
      points: 100
    },
    {
      id: '4',
      title: 'كتابة التقرير النهائي',
      description: 'كتابة التقرير النهائي للمشروع',
      dueDate: '2024-03-15',
      priority: 'medium',
      status: 'completed',
      points: 80
    },
    {
      id: '5',
      title: 'مراجعة المواد للامتحان',
      description: 'مراجعة جميع المواد للامتحان النهائي',
      dueDate: '2024-04-01',
      priority: 'high',
      status: 'pending',
      points: 120
    },
    {
      id: '6',
      title: 'إعداد العرض التقديمي',
      description: 'إعداد العرض التقديمي للعرض النهائي',
      dueDate: '2024-04-15',
      priority: 'low',
      status: 'in-progress',
      points: 60
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-red-600'
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
      case 'low':
        return 'bg-gradient-to-r from-green-500 to-green-600'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-cyber-green to-cyber-neon'
      case 'in-progress':
        return 'bg-gradient-to-r from-cyber-blue to-cyber-violet'
      case 'pending':
        return 'bg-gradient-to-r from-cyber-violet to-cyber-blue'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'in-progress':
        return Clock
      case 'pending':
        return AlertCircle
      default:
        return CheckSquare
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عالي'
      case 'medium':
        return 'متوسط'
      case 'low':
        return 'منخفض'
      default:
        return 'غير محدد'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل'
      case 'in-progress':
        return 'قيد التنفيذ'
      case 'pending':
        return 'معلق'
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

  const isOverdue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    return due < today
  }

  const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0)
  const completedPoints = tasks
    .filter(task => task.status === 'completed')
    .reduce((sum, task) => sum + task.points, 0)
  const progressPercentage = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100 mb-6">
            إدارة المهام
          </h1>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            نظم مهامك وواجباتك واتبع تقدمك في التعلم
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-8 animate-slide-up">
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-right">
                <h3 className="text-xl font-semibold text-dark-100 mb-2">
                  التقدم الإجمالي
                </h3>
                <p className="text-dark-300">
                  {completedPoints} من {totalPoints} نقطة
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 relative">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-cyber-dark/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                      className="text-cyber-neon transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-cyber-neon">
                      {progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 animate-slide-up">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-lg bg-cyber-neon/20 border border-cyber-neon/30 text-cyber-neon hover:bg-cyber-neon/30 transition-all duration-300 text-sm font-medium">
              جميع المهام
            </button>
            <button className="px-4 py-2 rounded-lg bg-cyber-dark/50 border border-cyber-neon/20 text-dark-200 hover:bg-cyber-neon/10 hover:text-cyber-neon transition-all duration-300 text-sm font-medium">
              المعلقة
            </button>
            <button className="px-4 py-2 rounded-lg bg-cyber-dark/50 border border-cyber-neon/20 text-dark-200 hover:bg-cyber-neon/10 hover:text-cyber-neon transition-all duration-300 text-sm font-medium">
              قيد التنفيذ
            </button>
            <button className="px-4 py-2 rounded-lg bg-cyber-dark/50 border border-cyber-neon/20 text-dark-200 hover:bg-cyber-neon/10 hover:text-cyber-neon transition-all duration-300 text-sm font-medium">
              المكتملة
            </button>
          </div>
          
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            إضافة مهمة جديدة
          </button>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => {
            const StatusIcon = getStatusIcon(task.status)
            const isTaskOverdue = isOverdue(task.dueDate)
            
            return (
              <div
                key={task.id}
                className="enhanced-card p-6 hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${getStatusColor(task.status)} rounded-xl flex items-center justify-center`}>
                    <StatusIcon className="w-6 h-6 text-dark-100" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)} text-white font-medium`}>
                      {getPriorityText(task.priority)}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-cyber-neon/20 text-cyber-neon font-medium">
                      {task.points} نقطة
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-dark-100 mb-3 line-clamp-2">
                  {task.title}
                </h3>
                
                <p className="text-dark-300 mb-4 line-clamp-3">
                  {task.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-dark-300">
                    <Clock className="w-4 h-4 text-cyber-neon" />
                    <span className={`text-sm ${isTaskOverdue ? 'text-red-400' : ''}`}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-dark-300">
                    <CheckSquare className="w-4 h-4 text-cyber-violet" />
                    <span className="text-sm">{getStatusText(task.status)}</span>
                  </div>
                </div>
                
                {isTaskOverdue && task.status !== 'completed' && (
                  <div className="mt-4 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm font-medium">
                      متأخر عن الموعد المحدد
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <CheckSquare className="w-16 h-16 text-cyber-neon mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-dark-100 mb-4">
              لا توجد مهام متاحة
            </h3>
            <p className="text-dark-300">
              سيتم إضافة المهام قريباً. ابق متابعاً للتحديثات!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}