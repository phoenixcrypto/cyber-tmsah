import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth/bcrypt'

const prisma = new PrismaClient()

async function resetAdmin() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env['DATABASE_URL']) {
      console.error('❌ DATABASE_URL is not set in environment variables')
      console.log('')
      console.log('💡 To use this script locally, create a .env file with:')
      console.log('   DATABASE_URL="your-database-url"')
      console.log('   DEFAULT_ADMIN_USERNAME="zeyadeltmsah26"')
      console.log('   DEFAULT_ADMIN_PASSWORD="2610204ZEYAd@@"')
      console.log('')
      console.log('💡 Or use it on Vercel where environment variables are already set.')
      process.exit(1)
    }

    const username = process.env['DEFAULT_ADMIN_USERNAME'] || 'zeyadeltmsah26'
    const password = process.env['DEFAULT_ADMIN_PASSWORD'] || '2610204ZEYAd@@'
    const name = process.env['DEFAULT_ADMIN_NAME'] || 'Admin User'

    console.log('🔄 Resetting admin user...')
    console.log('📝 Username:', username)
    console.log('🔑 Password:', '*'.repeat(password.length))

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      // Update existing user
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          role: 'admin',
        },
      })
      console.log('✅ Admin user password updated!')
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          username,
          name,
          password: hashedPassword,
          role: 'admin',
        },
      })
      console.log('✅ Admin user created!')
    }

    // Verify the user
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    console.log('✅ User verified:', user)
    console.log('\n🎉 Admin user is ready!')
    console.log('📝 Username:', username)
    console.log('🔑 Password:', password)

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdmin()

