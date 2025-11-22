import fs from 'fs'
import path from 'path'

const DB_DIR = path.join(process.cwd(), 'lib', 'db', 'data')

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

/**
 * Generic database interface for JSON file storage
 */
export class Database<T> {
  private filePath: string

  constructor(fileName: string) {
    this.filePath = path.join(DB_DIR, `${fileName}.json`)
    this.ensureFileExists()
  }

  private ensureFileExists(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8')
    }
  }

  /**
   * Read all data from file
   */
  readAll(): T[] {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8')
      return JSON.parse(data) as T[]
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error)
      return []
    }
  }

  /**
   * Write data to file
   */
  writeAll(data: T[]): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
      console.error(`Error writing ${this.filePath}:`, error)
      throw error
    }
  }

  /**
   * Find item by ID
   */
  findById(id: string): T | undefined {
    const data = this.readAll()
    return data.find((item: any) => item.id === id)
  }

  /**
   * Find items by filter
   */
  find(filter: (item: T) => boolean): T[] {
    const data = this.readAll()
    return data.filter(filter)
  }

  /**
   * Add new item
   */
  add(item: T): T {
    const data = this.readAll()
    data.push(item)
    this.writeAll(data)
    return item
  }

  /**
   * Update item by ID
   */
  update(id: string, updates: Partial<T>): T | null {
    const data = this.readAll()
    const index = data.findIndex((item: any) => item.id === id)
    
    if (index === -1) {
      return null
    }

    data[index] = { ...data[index], ...updates } as T
    this.writeAll(data)
    return data[index]
  }

  /**
   * Delete item by ID
   */
  delete(id: string): boolean {
    const data = this.readAll()
    const filtered = data.filter((item: any) => item.id !== id)
    
    if (filtered.length === data.length) {
      return false
    }

    this.writeAll(filtered)
    return true
  }

  /**
   * Get count
   */
  count(): number {
    return this.readAll().length
  }
}

