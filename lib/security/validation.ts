import { z } from 'zod'

// Username validation
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be less than 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')

// Email validation
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .toLowerCase()

// Full name validation
export const fullNameSchema = z
  .string()
  .min(2, 'Full name must be at least 2 characters')
  .max(100, 'Full name must be less than 100 characters')
  .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, 'Full name can only contain letters and spaces')

// Section number validation
export const sectionNumberSchema = z
  .number()
  .int('Section number must be an integer')
  .min(1, 'Section number must be between 1 and 15')
  .max(15, 'Section number must be between 1 and 15')

// Group validation
export const groupSchema = z.enum(['Group 1', 'Group 2'])

// Registration validation schema
export const registrationSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: fullNameSchema,
  sectionNumber: sectionNumberSchema,
  groupName: groupSchema,
  universityEmail: z.string().email().optional().or(z.literal('')),
  verificationToken: z.string().optional(), // Token from code verification
})

// Login validation schema
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
}

// Validate section and group match
export function validateSectionGroupMatch(
  sectionNumber: number,
  groupName: string
): { valid: boolean; error?: string } {
  if (groupName === 'Group 1') {
    if (sectionNumber < 1 || sectionNumber > 7) {
      return {
        valid: false,
        error: 'Group 1 only includes Sections 1-7. Please select a valid section number.',
      }
    }
  } else if (groupName === 'Group 2') {
    if (sectionNumber < 8 || sectionNumber > 15) {
      return {
        valid: false,
        error: 'Group 2 only includes Sections 8-15. Please select a valid section number.',
      }
    }
  }
  
  return { valid: true }
}

