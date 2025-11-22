import { Database } from './database'

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

const scheduleDB = new Database<ScheduleItem>('schedule')

/**
 * Get all schedule items
 */
export function getAllScheduleItems(): ScheduleItem[] {
  return scheduleDB.readAll()
}

/**
 * Get schedule items by group
 */
export function getScheduleByGroup(group: 'Group 1' | 'Group 2'): ScheduleItem[] {
  return scheduleDB.find((item) => item.group === group)
}

/**
 * Get schedule items by section
 */
export function getScheduleBySection(sectionNumber: number): ScheduleItem[] {
  return scheduleDB.find((item) => item.sectionNumber === sectionNumber)
}

/**
 * Get schedule item by ID
 */
export function getScheduleItemById(id: string): ScheduleItem | undefined {
  return scheduleDB.findById(id)
}

/**
 * Add new schedule item
 */
export function addScheduleItem(item: Omit<ScheduleItem, 'id' | 'createdAt' | 'updatedAt'>): ScheduleItem {
  const newItem: ScheduleItem = {
    ...item,
    id: `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return scheduleDB.add(newItem)
}

/**
 * Update schedule item
 */
export function updateScheduleItem(id: string, updates: Partial<Omit<ScheduleItem, 'id' | 'createdAt'>>): ScheduleItem | null {
  return scheduleDB.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Delete schedule item
 */
export function deleteScheduleItem(id: string): boolean {
  return scheduleDB.delete(id)
}

/**
 * Bulk import schedule items (for initial data migration)
 */
export function bulkImportScheduleItems(items: Omit<ScheduleItem, 'id' | 'createdAt' | 'updatedAt'>[]): void {
  items.forEach((item) => {
    addScheduleItem(item)
  })
}

