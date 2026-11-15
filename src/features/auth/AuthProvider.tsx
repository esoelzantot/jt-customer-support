import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { AuthContext, type AuthState } from './authContext'

type Session = { user: User | null; isAdmin: boolean }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (!user) return setSession({ user: null, isAdmin: false })
        try {
          const snap = await getDoc(doc(db, 'admins', user.uid))
          setSession({ user, isAdmin: snap.exists() })
        } catch {
          setSession({ user, isAdmin: false })
        }
      }),
    [],
  )

  const value = useMemo<AuthState>(
    () => ({
      user: session?.user ?? null,
      isAdmin: session?.isAdmin ?? false,
      loading: session === null,
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password)
      },
      signOut: () => fbSignOut(auth),
    }),
    [session],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
