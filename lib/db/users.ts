import { Database } from './database'
import { hashPassword } from '../auth/bcrypt'

export interface User {
  id: string
  email: string
  name: string
  password: string // hashed
  role: 'admin' | 'editor' | 'viewer'
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

const usersDB = new Database<User>('users')

/**
 * Initialize default admin user if no users exist
 */
export async function initializeDefaultAdmin(): Promise<void> {
  try {
    const users = usersDB.readAll()
    
    if (users.length === 0) {
      // Default admin credentials
      const defaultPassword = 'Admin@2026!'
      const hashedPassword = await hashPassword(defaultPassword)
      
      const defaultAdmin: User = {
        id: 'admin-001',
        email: 'admin@cyber-tmsah.site',
        name: 'مدير النظام',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      usersDB.add(defaultAdmin)
      console.log('✅ Default admin user created!')
      console.log('📧 Email: admin@cyber-tmsah.site')
      console.log('🔑 Password: Admin@2026!')
      console.log('⚠️  Please change the password after first login!')
    }
  } catch (error) {
    console.error('Error initializing default admin:', error)
    // Don't throw - allow the app to continue
  }
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): User | undefined {
  const users = usersDB.readAll()
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

/**
 * Get user by ID
 */
export function getUserById(id: string): User | undefined {
  return usersDB.findById(id)
}

/**
 * Create new user
 */
export async function createUser(userData: Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<User> {
  const hashedPassword = await hashPassword(userData.password)
  
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  return usersDB.add(newUser)
}

/**
 * Update user
 */
export function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'password'>>): User | null {
  return usersDB.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Update user password
 */
export async function updateUserPassword(id: string, newPassword: string): Promise<User | null> {
  const hashedPassword = await hashPassword(newPassword)
  return usersDB.update(id, {
    password: hashedPassword,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Update last login
 */
export function updateLastLogin(id: string): void {
  usersDB.update(id, {
    lastLogin: new Date().toISOString(),
  })
}

/**
 * Get all users
 */
export function getAllUsers(): User[] {
  return usersDB.readAll()
}

/**
 * Delete user
 */
export function deleteUser(id: string): boolean {
  return usersDB.delete(id)
}

