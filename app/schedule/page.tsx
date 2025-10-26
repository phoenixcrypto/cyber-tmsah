import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function SchedulePage() {
  const scheduleData = [
    {
      id: '1',
      title: 'Applied Physics',
      time: '09:00 - 10:30',
      location: 'Hall 101',
      instructor: 'Dr. Ahmed Mohamed',
      type: 'lecture',
      section: 'Section 1'
    },
    {
      id: '2',
      title: 'Mathematics',
      time: '11:00 - 12:30',
      location: 'Hall 102',
      instructor: 'Dr. Sara Ahmed',
      type: 'lecture',
      section: 'Section 1'
    },
    {
      id: '3',
      title: 'Entrepreneurship and Creative Thinking Skills',
      time: '14:00 - 15:30',
      location: 'Hall 103',
      instructor: 'Dr. Mohamed Ali',
      type: 'lecture',
      section: 'Section 2'
    },
    {
      id: '4',
      title: 'Information Technology',
      time: '16:00 - 17:30',
      location: 'Computer Lab 1',
      instructor: 'Dr. Fatma Hassan',
      type: 'lab',
      section: 'Section 2'
    },
    {
      id: '5',
      title: 'Database Systems',
      time: '18:00 - 19:30',
      location: 'Computer Lab 2',
      instructor: 'Eng. Ali Mahmoud',
      type: 'lab',
      section: 'Section 3'
    },
    {
      id: '6',
      title: 'English',
      time: '08:00 - 09:30',
      location: 'Hall 104',
      instructor: 'Dr. Nour El-Din',
      type: 'lecture',
      section: 'Section 3'
    },
    {
      id: '7',
      title: 'Information System',
      time: '10:00 - 11:30',
      location: 'Computer Lab 3',
      instructor: 'Eng. Mariam Ahmed',
      type: 'lab',
      section: 'Section 4'
    }
  ]

  const sections = [...new Set(scheduleData.map(item => item.section))]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-gradient-to-r from-cyber-neon to-cyber-green'
      case 'lab':
        return 'bg-gradient-to-r from-cyber-violet to-cyber-blue'
      case 'tutorial':
        return 'bg-gradient-to-r from-cyber-green to-cyber-neon'
      default:
        return 'bg-gradient-to-r from-cyber-blue to-cyber-violet'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture':
        return BookOpen
      case 'lab':
        return Calendar
      case 'tutorial':
        return User
      default:
        return Calendar
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-dark to-cyber-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-dark-100 mb-6">
            الجدول الأكاديمي
          </h1>
          <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto">
            جدول المحاضرات والمختبرات للفصل الدراسي الحالي
          </p>
        </div>

        {/* Section Filter */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-wrap gap-2 justify-center">
            {sections.map((section, index) => (
              <button
                key={section}
                className="px-4 py-2 rounded-lg bg-cyber-dark/50 border border-cyber-neon/20 text-dark-200 hover:bg-cyber-neon/10 hover:text-cyber-neon transition-all duration-300 text-sm font-medium"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduleData.map((item, index) => {
            const TypeIcon = getTypeIcon(item.type)
            return (
              <div
                key={item.id}
                className="enhanced-card p-6 hover:scale-105 transition-all duration-300 animate-slide-up-delayed"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${getTypeColor(item.type)} rounded-xl flex items-center justify-center`}>
                    <TypeIcon className="w-6 h-6 text-dark-100" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-cyber-neon/20 text-cyber-neon font-medium">
                    {item.type === 'lecture' ? 'محاضرة' : item.type === 'lab' ? 'مختبر' : 'تطبيق'}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-dark-100 mb-3 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-dark-300">
                    <Clock className="w-4 h-4 text-cyber-neon" />
                    <span className="text-sm">{item.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-dark-300">
                    <MapPin className="w-4 h-4 text-cyber-violet" />
                    <span className="text-sm">{item.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-dark-300">
                    <User className="w-4 h-4 text-cyber-green" />
                    <span className="text-sm">{item.instructor}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-dark-300">
                    <Calendar className="w-4 h-4 text-cyber-blue" />
                    <span className="text-sm">{item.section}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {scheduleData.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <Calendar className="w-16 h-16 text-cyber-neon mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-dark-100 mb-4">
              لا توجد محاضرات متاحة
            </h3>
            <p className="text-dark-300">
              سيتم إضافة الجدول الأكاديمي قريباً. ابق متابعاً للتحديثات!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}