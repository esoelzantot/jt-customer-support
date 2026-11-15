import { Outlet } from 'react-router'
import { AuthProvider } from '@/features/auth/AuthProvider'

/** Lazy-loaded entry for everything under /admin: keeps Firebase Auth out of the public bundle. */
export function AdminRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
