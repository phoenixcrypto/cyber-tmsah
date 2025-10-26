// Content Management System
export interface ContentSection {
  id: string
  title: string
  content: string
}

export interface Material {
  name: string
  type: string
  size: string
}

export interface ContentItem {
  id: string
  title: string
  type: 'lecture' | 'session'
  subject: string
  instructor: string
  date: string
  duration: string
  description: string
  status: 'draft' | 'published'
  sections: ContentSection[]
  materials: Material[]
}

export interface TeachingAssistant {
  id: string
  name: string
  email?: string
  phone?: string
  specialization?: string
}

export interface Subject {
  name: string
  icon: string
  description: string
  hasSessions: boolean
  instructor: string
  assistants: TeachingAssistant[]
}

export interface ContentData {
  subjects: Record<string, Subject>
  content: Record<string, ContentItem>
}

// Sample data - in production this would come from a database
export const sampleContentData: ContentData = {
  subjects: {
    'mathematics': {
      name: 'Mathematics',
      icon: '📐',
      description: 'Fundamentals of algebra, calculus, and mathematical analysis',
      hasSessions: true,
      instructor: 'Dr. Simon Ezzat',
      assistants: [
        { id: 'math-ta-1', name: 'Eng. Ehab Mohamed' },
        { id: 'math-ta-2', name: 'Eng. Ahmed Nashaat' },
        { id: 'math-ta-3', name: 'Eng. Yasmine' }
      ]
    },
    'information-technology': {
      name: 'Information Technology',
      icon: '🔧',
      description: 'IT infrastructure, systems administration, and technical support',
      hasSessions: true,
      instructor: 'Dr. Shaimaa Ahmed',
      assistants: [
        { id: 'it-ta-1', name: 'Eng. Mohamed Ammar' },
        { id: 'it-ta-2', name: 'Eng. Yasmine' }
      ]
    },
    'applied-physics': {
      name: 'Applied Physics',
      icon: '⚡',
      description: 'Physics principles applied to technology and engineering',
      hasSessions: true,
      instructor: 'Dr. Ahmed Bakr',
      assistants: [
        { id: 'physics-ta-1', name: 'Eng. Omnia Ibrahim' },
        { id: 'physics-ta-2', name: 'Eng. Ahmed Nashaat' }
      ]
    },
    'database-systems': {
      name: 'Database Systems',
      icon: '🗄️',
      description: 'SQL fundamentals, database design, and data management',
      hasSessions: true,
      instructor: 'Dr. Abeer Hassan',
      assistants: [
        { id: 'db-ta-1', name: 'Eng. Naglaa Saeed' },
        { id: 'db-ta-2', name: 'Eng. Karim Adel' }
      ]
    },
    'information-systems': {
      name: 'Information Systems',
      icon: '💻',
      description: 'Information systems design, analysis, and management',
      hasSessions: true,
      instructor: 'Dr. Hend Zyada',
      assistants: [
        { id: 'is-ta-1', name: 'Eng. Mahmoud Mohamed' },
        { id: 'is-ta-2', name: 'Eng. Dina Ali' },
        { id: 'is-ta-3', name: 'Eng. Mariam Ashraf' }
      ]
    },
    'english': {
      name: 'English',
      icon: '📚',
      description: 'Academic writing, research papers, and communication skills',
      hasSessions: false,
      instructor: 'Dr. Nashwa',
      assistants: []
    },
    'entrepreneurship': {
      name: 'Entrepreneurship & Creative Thinking',
      icon: '💡',
      description: 'Business development, innovation, and creative problem solving',
      hasSessions: false,
      instructor: 'Dr. Abeer Hassan',
      assistants: []
    }
  },
  content: {
    'math-lecture-1': {
      id: 'math-lecture-1',
      title: 'Introduction to Calculus',
      type: 'lecture',
      subject: 'mathematics',
      instructor: 'Dr. Ahmed Hassan',
      date: '2025-01-15',
      duration: '2 hours',
      description: 'Basic concepts of differential and integral calculus',
      status: 'published',
      sections: [
        {
          id: 'section-1',
          title: 'What is Calculus?',
          content: 'Calculus is a branch of mathematics that deals with the study of change and motion. It is divided into two main branches: differential calculus and integral calculus.'
        },
        {
          id: 'section-2',
          title: 'Historical Development',
          content: 'The development of calculus is credited to two great mathematicians: Isaac Newton and Gottfried Wilhelm Leibniz. Both developed the fundamental concepts independently in the late 17th century.'
        }
      ],
      materials: [
        {
          name: 'calculus-basics.pdf',
          type: 'PDF',
          size: '2.3 MB'
        },
        {
          name: 'practice-problems.pdf',
          type: 'PDF',
          size: '1.8 MB'
        }
      ]
    },
    'math-session-1': {
      id: 'math-session-1',
      title: 'Calculus Problem Solving',
      type: 'session',
      subject: 'mathematics',
      instructor: 'Eng. Sarah Mohamed',
      date: '2025-01-17',
      duration: '1.5 hours',
      description: 'Practical exercises and problem solving techniques',
      status: 'published',
      sections: [
        {
          id: 'section-1',
          title: 'Problem Solving Strategy',
          content: 'When approaching calculus problems, follow these steps: 1. Read the problem carefully, 2. Determine which concepts apply, 3. Set up the problem, 4. Solve step by step, 5. Check your answer.'
        }
      ],
      materials: [
        {
          name: 'problem-sets.pdf',
          type: 'PDF',
          size: '3.1 MB'
        },
        {
          name: 'solutions.pdf',
          type: 'PDF',
          size: '2.5 MB'
        }
      ]
    }
  }
}

// Content management functions
export class ContentManager {
  private data: ContentData

  constructor(data: ContentData = sampleContentData) {
    this.data = data
  }

  // Get all subjects
  getSubjects(): Record<string, Subject> {
    return this.data.subjects
  }

  // Get subject by ID
  getSubject(id: string): Subject | undefined {
    return this.data.subjects[id]
  }

  // Get all content
  getContent(): Record<string, ContentItem> {
    return this.data.content
  }

  // Get content by ID
  getContentItem(id: string): ContentItem | undefined {
    return this.data.content[id]
  }

  // Get content by subject
  getContentBySubject(subjectId: string): ContentItem[] {
    return Object.values(this.data.content).filter(item => item.subject === subjectId)
  }

  // Get content by type (lecture/session)
  getContentByType(type: 'lecture' | 'session'): ContentItem[] {
    return Object.values(this.data.content).filter(item => item.type === type)
  }

  // Get published content
  getPublishedContent(): ContentItem[] {
    return Object.values(this.data.content).filter(item => item.status === 'published')
  }

  // Get draft content
  getDraftContent(): ContentItem[] {
    return Object.values(this.data.content).filter(item => item.status === 'draft')
  }

  // Add new content
  addContent(content: ContentItem): void {
    this.data.content[content.id] = content
  }

  // Update content
  updateContent(id: string, updates: Partial<ContentItem>): void {
    if (this.data.content[id]) {
      this.data.content[id] = { ...this.data.content[id], ...updates }
    }
  }

  // Delete content
  deleteContent(id: string): void {
    delete this.data.content[id]
  }

  // Publish content
  publishContent(id: string): void {
    if (this.data.content[id]) {
      this.data.content[id].status = 'published'
    }
  }

  // Unpublish content
  unpublishContent(id: string): void {
    if (this.data.content[id]) {
      this.data.content[id].status = 'draft'
    }
  }

  // Get content statistics
  getStats() {
    const content = Object.values(this.data.content)
    return {
      total: content.length,
      published: content.filter(item => item.status === 'published').length,
      drafts: content.filter(item => item.status === 'draft').length,
      lectures: content.filter(item => item.type === 'lecture').length,
      sessions: content.filter(item => item.type === 'session').length
    }
  }
}

// Export singleton instance
export const contentManager = new ContentManager()
