import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

const env = import.meta.env

const firebaseConfig: FirebaseOptions = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
}

const missing = (['apiKey', 'projectId', 'appId'] as const).filter((key) => !firebaseConfig[key])
if (missing.length) {
  console.warn(`[firebase] Missing config: ${missing.join(', ')}. Copy .env.example to .env.local and fill it in.`)
}

const isFirstInit = getApps().length === 0
export const app = isFirstInit ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)

// Offline-capable Firestore cache shared across tabs. On HMR re-runs the
// instance already exists, so reuse it instead of re-initialising.
export const db: Firestore = isFirstInit
  ? initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })
  : getFirestore(app)

export const storage = getStorage(app)

if (isFirstInit && env.DEV && env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectStorageEmulator(storage, '127.0.0.1', 9199)
}
