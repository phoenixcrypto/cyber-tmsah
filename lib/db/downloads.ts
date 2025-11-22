import { Database } from './database'

export interface DownloadSoftware {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  icon: string // Icon name from lucide-react
  videoUrl: string
  createdAt?: string
  updatedAt?: string
}

const downloadsDB = new Database<DownloadSoftware>('downloads')

/**
 * Get all software
 */
export function getAllSoftware(): DownloadSoftware[] {
  return downloadsDB.readAll()
}

/**
 * Get software by ID
 */
export function getSoftwareById(id: string): DownloadSoftware | undefined {
  return downloadsDB.findById(id)
}

/**
 * Add new software
 */
export function addSoftware(software: Omit<DownloadSoftware, 'id' | 'createdAt' | 'updatedAt'> | DownloadSoftware): DownloadSoftware {
  const newSoftware: DownloadSoftware = {
    ...software,
    id: 'id' in software && software.id ? software.id : `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return downloadsDB.add(newSoftware)
}

/**
 * Update software
 */
export function updateSoftware(id: string, updates: Partial<Omit<DownloadSoftware, 'id' | 'createdAt'>>): DownloadSoftware | null {
  return downloadsDB.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Delete software
 */
export function deleteSoftware(id: string): boolean {
  return downloadsDB.delete(id)
}

