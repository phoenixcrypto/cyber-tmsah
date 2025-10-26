export interface Material {
  id: string
  title: string
  description: string
  type: 'lecture' | 'assignment' | 'exam' | 'resource'
  content: string
  attachments?: string[]
  dueDate?: string
  points?: number
}

export interface ScheduleItem {
  id: string
  title: string
  time: string
  location: string
  instructor: string
  type: 'lecture' | 'lab' | 'tutorial'
  section: string
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  points: number
}

// Mock data for materials
export const materials: Material[] = [
  {
    id: '1',
    title: 'مقدمة في البرمجة',
    description: 'تعلم أساسيات البرمجة والمفاهيم الأساسية',
    type: 'lecture',
    content: 'هذا المحتوى التعليمي يغطي أساسيات البرمجة...',
    attachments: ['intro-programming.pdf', 'examples.zip'],
    points: 100
  },
  {
    id: '2',
    title: 'الواجب الأول - البرمجة',
    description: 'تطبيق المفاهيم المكتسبة في البرمجة',
    type: 'assignment',
    content: 'قم بإنشاء برنامج بسيط باستخدام المفاهيم التي تعلمتها...',
    dueDate: '2024-02-15',
    points: 50
  },
  {
    id: '3',
    title: 'امتحان منتصف الفصل',
    description: 'امتحان شامل على المواد المغطاة',
    type: 'exam',
    content: 'الامتحان سيشمل جميع المواضيع المغطاة حتى الآن...',
    dueDate: '2024-03-01',
    points: 200
  }
]

// Mock data for schedule
export const scheduleData: ScheduleItem[] = [
  {
    id: '1',
    title: 'مقدمة في البرمجة',
    time: '09:00 - 10:30',
    location: 'قاعة 101',
    instructor: 'د. أحمد محمد',
    type: 'lecture',
    section: 'القسم الأول'
  },
  {
    id: '2',
    title: 'مختبر البرمجة',
    time: '11:00 - 12:30',
    location: 'مختبر الحاسوب 1',
    instructor: 'م. سارة أحمد',
    type: 'lab',
    section: 'القسم الأول'
  },
  {
    id: '3',
    title: 'هياكل البيانات',
    time: '14:00 - 15:30',
    location: 'قاعة 102',
    instructor: 'د. محمد علي',
    type: 'lecture',
    section: 'القسم الثاني'
  }
]

// Mock data for tasks
export const tasks: Task[] = [
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
  }
]

// Utility functions
export function getMaterialById(id: string): Material | undefined {
  return materials.find(material => material.id === id)
}

export function getMaterialsByType(type: Material['type']): Material[] {
  return materials.filter(material => material.type === type)
}

export function getScheduleBySection(section: string): ScheduleItem[] {
  return scheduleData.filter(item => item.section === section)
}

export function getTasksByStatus(status: Task['status']): Task[] {
  return tasks.filter(task => task.status === status)
}

export function getTasksByPriority(priority: Task['priority']): Task[] {
  return tasks.filter(task => task.priority === priority)
}

export function getUpcomingTasks(): Task[] {
  const today = new Date()
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    return dueDate >= today && task.status !== 'completed'
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}

export function getOverdueTasks(): Task[] {
  const today = new Date()
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    return dueDate < today && task.status !== 'completed'
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}

export function getCompletedTasks(): Task[] {
  return tasks.filter(task => task.status === 'completed')
}

export function getTotalPoints(): number {
  return tasks.reduce((total, task) => total + task.points, 0)
}

export function getCompletedPoints(): number {
  return tasks
    .filter(task => task.status === 'completed')
    .reduce((total, task) => total + task.points, 0)
}

export function getProgressPercentage(): number {
  const total = getTotalPoints()
  const completed = getCompletedPoints()
  return total > 0 ? Math.round((completed / total) * 100) : 0
}