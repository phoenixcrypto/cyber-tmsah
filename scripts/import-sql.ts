/**
 * Script to import SQL file into database
 * Usage: tsx scripts/import-sql.ts [sql-file-path]
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function importSQL(sqlFilePath: string) {
  try {
    console.log('📖 Reading SQL file...')
    const sql = readFileSync(sqlFilePath, 'utf-8')
    
    console.log('📊 Executing SQL...')
    
    // Split SQL by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement)
          console.log('✅ Executed statement')
        } catch (error) {
          console.error('❌ Error executing statement:', error)
          console.log('Statement:', statement.substring(0, 100) + '...')
        }
      }
    }
    
    console.log('✅ SQL import completed!')
  } catch (error) {
    console.error('❌ Error importing SQL:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Get SQL file path from command line or use default
const sqlFile = process.argv[2] || join(process.cwd(), 'database', 'schema.sql')

console.log(`📁 SQL File: ${sqlFile}`)
importSQL(sqlFile)

