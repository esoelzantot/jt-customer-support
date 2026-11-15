import { createContext, useContext } from 'react'
import type { User } from 'firebase/auth'

export type AuthState = {
  user: User | null
  /** True when `admins/{uid}` exists for the signed-in user. */
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
