import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from './authContext'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth()
  const location = useLocation()
  const { t } = useTranslation()

  if (loading) return <Spinner className="min-h-dvh" />
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />

  if (!isAdmin) {
    return (
      <div className="grid min-h-dvh place-items-center px-4 text-center">
        <div>
          <p className="text-2xl font-extrabold">{t('admin.notAdmin.title')}</p>
          <p className="mt-2 text-ink/70">{t('admin.notAdmin.body', { email: user.email })}</p>
          <button onClick={signOut} className="mt-6 rounded-full bg-brand-600 px-6 py-2.5 font-bold text-white hover:bg-brand-700">
            {t('admin.signOut')}
          </button>
        </div>
      </div>
    )
  }

  return children
}
