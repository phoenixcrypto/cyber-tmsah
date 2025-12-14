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
  let privateKey = process.env['FIREBASE_PRIVATE_KEY']
  
  // Process private key - handle different formats
  if (privateKey) {
    // Replace escaped newlines with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n')
    
    // If the key doesn't have newlines but should (PEM format), try to add them
    // This handles cases where Vercel strips newlines
    if (!privateKey.includes('\n') && privateKey.includes('BEGIN PRIVATE KEY')) {
      // Try to reconstruct the key with proper newlines
      // This is a fallback - ideally the key should already have \n
      privateKey = privateKey
        .replace(/-----BEGIN PRIVATE KEY-----/g, '-----BEGIN PRIVATE KEY-----\n')
        .replace(/-----END PRIVATE KEY-----/g, '\n-----END PRIVATE KEY-----')
        .replace(/\s{2,}/g, '\n') // Replace multiple spaces with newline
    }
    
    // Validate that the key looks correct
    if (!privateKey.includes('BEGIN PRIVATE KEY') || !privateKey.includes('END PRIVATE KEY')) {
      console.error('❌ FIREBASE_PRIVATE_KEY appears to be malformed')
      console.error('   Key should start with "-----BEGIN PRIVATE KEY-----" and end with "-----END PRIVATE KEY-----"')
      throw new Error('FIREBASE_PRIVATE_KEY is malformed. Please check the key format.')
    }
  }

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
    try {
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    } catch (certError) {
      const errorMessage = certError instanceof Error ? certError.message : String(certError)
      console.error('❌ Failed to initialize Firebase with provided credentials')
      console.error('   Error:', errorMessage)
      
      // Provide helpful error message
      if (errorMessage.includes('DECODER') || errorMessage.includes('unsupported')) {
        throw new Error(
          'FIREBASE_PRIVATE_KEY format is incorrect. ' +
          'In Vercel, make sure to use \\n for newlines (not actual newlines). ' +
          'Example: -----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----'
        )
      }
      
      throw certError
    }
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

