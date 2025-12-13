/**
 * Shared TypeScript types for Cyber TMSAH
 */

import { Prisma } from '@prisma/client'

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
  createdAt?: string
  updatedAt?: string
}

// User Types
export interface User {
  id: string
  username: string
  email: string | null
  name: string
  role: 'admin' | 'editor' | 'viewer'
  lastLogin: string | null
  createdAt?: string
  updatedAt?: string
}

// Prisma Update Types
export type ScheduleItemUpdateInput = Prisma.ScheduleItemUpdateInput
export type UserUpdateInput = Prisma.UserUpdateInput

// API Response Types
export interface ApiScheduleResponse {
  items: ScheduleItem[]
}

export interface ApiUserResponse {
  users: User[]
}

// Error with code (for Prisma errors)
export interface ErrorWithCode extends Error {
  code?: string
}

// Lucide Icons type helper
export type LucideIconName = keyof typeof import('lucide-react')
