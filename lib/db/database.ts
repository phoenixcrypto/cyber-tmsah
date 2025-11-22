import fs from 'fs'
import path from 'path'
import os from 'os'

// Use /tmp directory in serverless environments (Vercel, AWS Lambda, etc.)
// In local development, use project directory
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production'
const DB_DIR = isServerless 
  ? path.join(os.tmpdir(), 'cyber-tmsah-db')
  : path.join(process.cwd(), 'lib', 'db', 'data')

// Ensure DB directory exists
try {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }
} catch (error) {
  console.error('Error creating DB directory:', error)
  // Fallback to /tmp if initial directory creation fails
  if (!isServerless) {
    const fallbackDir = path.join(os.tmpdir(), 'cyber-tmsah-db')
    if (!fs.existsSync(fallbackDir)) {
      fs.mkdirSync(fallbackDir, { recursive: true })
    }
  }
}

/**
 * Generic database interface for JSON file storage
 */
export class Database<T> {
  private filePath: string

  constructor(fileName: string) {
    // Use the DB_DIR that was set above, with fallback to /tmp
    const dbDir = fs.existsSync(DB_DIR) ? DB_DIR : path.join(os.tmpdir(), 'cyber-tmsah-db')
    this.filePath = path.join(dbDir, `${fileName}.json`)
    this.ensureFileExists()
  }

  private ensureFileExists(): void {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8')
      }
    } catch (error) {
      console.error(`Error ensuring file exists for ${this.filePath}:`, error)
      // If we can't write to the intended location, try /tmp as fallback
      const fallbackPath = path.join(os.tmpdir(), 'cyber-tmsah-db', path.basename(this.filePath))
      try {
        const fallbackDir = path.dirname(fallbackPath)
        if (!fs.existsSync(fallbackDir)) {
          fs.mkdirSync(fallbackDir, { recursive: true })
        }
        if (!fs.existsSync(fallbackPath)) {
          fs.writeFileSync(fallbackPath, JSON.stringify([], null, 2), 'utf-8')
        }
        this.filePath = fallbackPath
      } catch (fallbackError) {
        console.error('Fallback path also failed:', fallbackError)
        throw error
      }
    }
  }

  /**
   * Read all data from file
   */
  readAll(): T[] {
    try {
      if (!fs.existsSync(this.filePath)) {
        this.ensureFileExists()
        return []
      }
      const data = fs.readFileSync(this.filePath, 'utf-8')
      if (!data || data.trim() === '') {
        return []
      }
      return JSON.parse(data) as T[]
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error)
      console.error('Error details:', {
        filePath: this.filePath,
        exists: fs.existsSync(this.filePath),
        errorMessage: error instanceof Error ? error.message : String(error),
      })
      return []
    }
  }

  /**
   * Write data to file
   */
  writeAll(data: T[]): void {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
      console.error(`Error writing ${this.filePath}:`, error)
      console.error('Error details:', {
        filePath: this.filePath,
        dirExists: fs.existsSync(path.dirname(this.filePath)),
        errorMessage: error instanceof Error ? error.message : String(error),
        errorCode: (error as any)?.code,
      })
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

