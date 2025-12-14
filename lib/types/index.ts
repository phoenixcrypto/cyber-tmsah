/**
 * Shared TypeScript types for Cyber TMSAH
 */

// Schedule Item Types
export interface ScheduleItem {
  id: string
  title: string
  time: string
  location: string
  instructor: string
  type: 'lecture' | 'lab'
  group: 'Group 1' | 'Group 2'
  sectionNumber: number | null
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  createdAt?: string | Date
  updatedAt?: string | Date
}

// User Types
export interface User {
  id: string
  username: string
  email: string | null
  name: string
  role: 'admin' | 'editor' | 'viewer'
  lastLogin: string | null | Date
  createdAt?: string | Date
  updatedAt?: string | Date
}

// Update Input Types (Firestore compatible)
export interface ScheduleItemUpdateInput {
  title?: string
  time?: string
  location?: string
  instructor?: string
  type?: 'lecture' | 'lab'
  group?: 'Group1' | 'Group2'
  sectionNumber?: number | null
  day?: string
}

export interface UserUpdateInput {
  username?: string
  email?: string | null
  name?: string
  role?: 'admin' | 'editor' | 'viewer'
  password?: string
  lastLogin?: Date | null
}

// API Response Types
export interface ApiScheduleResponse {
  items: ScheduleItem[]
}

export interface ApiUserResponse {
  users: User[]
}

// Error with code (for Firebase errors)
export interface ErrorWithCode extends Error {
  code?: string
}

// Lucide Icons type helper
export type LucideIconName = keyof typeof import('lucide-react')
