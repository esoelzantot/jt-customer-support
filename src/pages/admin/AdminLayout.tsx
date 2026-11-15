import { Link, NavLink, Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Logo } from '@/components/brand/Logo'
import { LanguageSwitch } from '@/components/layout/LanguageSwitch'
import { useAuth } from '@/features/auth/authContext'
import { RequireAdmin } from '@/features/auth/RequireAdmin'
import { GUIDE_SECTIONS } from '@/features/guides/sections'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'flex items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-bold transition',
    isActive ? 'bg-white text-brand-700 shadow-lg shadow-brand-950/20' : 'text-white/85 hover:bg-white/10 hover:text-white',
  )

function DashboardIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden {...props}>
      <rect x="3" y="3" width="7" height="9" rx="2" />
      <rect x="14" y="3" width="7" height="5" rx="2" />
      <rect x="14" y="12" width="7" height="9" rx="2" />
      <rect x="3" y="16" width="7" height="5" rx="2" />
    </svg>
  )
}

export function AdminLayout() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()

  return (
    <RequireAdmin>
      <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_1fr]">
        <aside className="relative overflow-hidden bg-gradient-to-b from-brand-600 to-brand-900 text-white lg:sticky lg:top-0 lg:h-dvh">
          <div aria-hidden className="bg-speed-lines absolute inset-0 opacity-60" />
          <div className="relative flex h-full flex-col gap-4 p-4 lg:p-5">
            <div className="flex items-center justify-between gap-3">
              <Link to="/admin" className="text-base">
                <Logo tone="white" />
              </Link>
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold">{t('admin.badge')}</span>
            </div>

            <nav aria-label={t('admin.nav')} className="-mx-1 overflow-x-auto [scrollbar-width:none]">
              <ul className="flex gap-1 px-1 lg:flex-col">
                <li>
                  <NavLink to="/admin" end className={linkClass}>
                    <DashboardIcon className="size-5" />
                    {t('admin.dashboard.title')}
                  </NavLink>
                </li>
                {GUIDE_SECTIONS.map(({ slug, key, Icon }) => (
                  <li key={slug}>
                    <NavLink to={`/admin/${slug}`} className={linkClass}>
                      <Icon className="size-5" />
                      {t(`sections.${key}.title`)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto hidden space-y-3 border-t border-white/15 pt-4 text-sm lg:block">
              <p className="truncate opacity-80" dir="ltr">{user?.email}</p>
              <div className="flex flex-wrap gap-2">
                <Link to="/" className="rounded-full bg-white/10 px-3 py-1.5 font-bold hover:bg-white/20">
                  {t('admin.viewSite')}
                </Link>
                <button onClick={signOut} className="rounded-full bg-white/10 px-3 py-1.5 font-bold hover:bg-white/20">
                  {t('admin.signOut')}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="flex items-center justify-end gap-2 border-b border-brand-600/10 bg-white/70 px-4 py-3 backdrop-blur sm:px-8">
            <Link to="/" className="rounded-full px-3 py-1.5 text-sm font-bold text-ink/70 hover:text-brand-700 lg:hidden">
              {t('admin.viewSite')}
            </Link>
            <button onClick={signOut} className="rounded-full px-3 py-1.5 text-sm font-bold text-ink/70 hover:text-brand-700 lg:hidden">
              {t('admin.signOut')}
            </button>
            <LanguageSwitch />
          </header>
          <main className="flex-1 px-4 py-8 sm:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </RequireAdmin>
  )
}
