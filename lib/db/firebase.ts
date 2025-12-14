/**
 * Firebase Admin SDK Setup
 * Initialize Firebase Admin for server-side operations
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getAuth, Auth } from 'firebase-admin/auth'

let app: App | undefined
let db: Firestore | undefined
let auth: Auth | undefined

/**
 * Initialize Firebase Admin
 */
function initializeFirebase(): void {
  // Check if already initialized
  if (getApps().length > 0) {
    const existingApp = getApps()[0]
    if (!existingApp) {
      throw new Error('Firebase app not found')
    }
    app = existingApp
    db = getFirestore(existingApp)
    auth = getAuth(existingApp)
    return
  }

  // Check for environment variables
  const projectId = process.env['FIREBASE_PROJECT_ID']
  const clientEmail = process.env['FIREBASE_CLIENT_EMAIL']
  const privateKey = process.env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    // Try to use service account JSON file if available
    const serviceAccountPath = process.env['FIREBASE_SERVICE_ACCOUNT_PATH']
    
    if (serviceAccountPath) {
      try {
        const serviceAccount = require(serviceAccountPath)
        app = initializeApp({
          credential: cert(serviceAccount),
        })
      } catch (error) {
        console.error('❌ Failed to load Firebase service account:', error)
        throw new Error('Firebase service account not configured properly')
      }
    } else {
      console.error('❌ Firebase Admin SDK not configured. Please set:')
      console.error('   FIREBASE_PROJECT_ID')
      console.error('   FIREBASE_CLIENT_EMAIL')
      console.error('   FIREBASE_PRIVATE_KEY')
      console.error('   OR FIREBASE_SERVICE_ACCOUNT_PATH')
      throw new Error('Firebase Admin SDK not configured')
    }
  } else {
    // Initialize with environment variables
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  }

  db = getFirestore(app)
  auth = getAuth(app)
}

/**
 * Get Firestore instance
 */
export function getFirestoreDB(): Firestore {
  if (!db) {
    try {
      initializeFirebase()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('❌ Firebase initialization failed:', errorMessage)
      throw new Error(`Firebase not initialized: ${errorMessage}. Please check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.`)
    }
  }
  if (!db) {
    throw new Error('Firestore not initialized. Please check Firebase configuration.')
  }
  return db
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    try {
      initializeFirebase()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('❌ Firebase initialization failed:', errorMessage)
      throw new Error(`Firebase not initialized: ${errorMessage}. Please check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.`)
    }
  }
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Please check Firebase configuration.')
  }
  return auth
}

/**
 * Get Firebase App instance
 */
export function getFirebaseApp(): App {
  if (!app) {
    try {
      initializeFirebase()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('❌ Firebase initialization failed:', errorMessage)
      throw new Error(`Firebase not initialized: ${errorMessage}. Please check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.`)
    }
  }
  if (!app) {
    throw new Error('Firebase App not initialized. Please check Firebase configuration.')
  }
  return app
}

// Don't initialize on module load - initialize lazily when needed
// This prevents errors during build time or when env vars are not set

export default {
  db: getFirestoreDB,
  auth: getFirebaseAuth,
  app: getFirebaseApp,
}

