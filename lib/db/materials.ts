import { Database } from './database'

export interface Material {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  icon: string // Icon name from lucide-react
  color: string // Tailwind color class
  articlesCount: number
  lastUpdated: string
  createdAt?: string
  updatedAt?: string
}

const materialsDB = new Database<Material>('materials')

/**
 * Get all materials
 */
export function getAllMaterials(): Material[] {
  return materialsDB.readAll()
}

/**
 * Get material by ID
 */
export function getMaterialById(id: string): Material | undefined {
  return materialsDB.findById(id)
}

/**
 * Add new material
 */
export function addMaterial(material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'> | Material): Material {
  const newMaterial: Material = {
    ...material,
    id: 'id' in material && material.id ? material.id : `material-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return materialsDB.add(newMaterial)
}

/**
 * Update material
 */
export function updateMaterial(id: string, updates: Partial<Omit<Material, 'id' | 'createdAt'>>): Material | null {
  return materialsDB.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
    lastUpdated: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
  })
}

/**
 * Delete material
 */
export function deleteMaterial(id: string): boolean {
  return materialsDB.delete(id)
}

