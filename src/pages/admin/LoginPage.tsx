import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Logo } from '@/components/brand/Logo'
import { Mascot } from '@/components/brand/Mascot'
import { LanguageSwitch } from '@/components/layout/LanguageSwitch'
import { useAuth } from '@/features/auth/authContext'

export function LoginPage() {
  const { t } = useTranslation()
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (user) return <Navigate to={from} replace />

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
      navigate(from, { replace: true })
    } catch {
      setError(t('admin.login.error'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 to-brand-900 lg:grid lg:place-items-center">
        <div aria-hidden className="bg-speed-lines absolute inset-0" />
        <div className="relative w-72">
          <Mascot interactive={false} />
        </div>
        <p className="text-display absolute bottom-10 inset-x-0 text-center text-3xl text-white">{t('brand.tagline')}</p>
      </aside>

      <main className="flex flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo className="text-lg" />
          <LanguageSwitch />
        </div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="m-auto w-full max-w-sm py-10"
          noValidate
        >
          <h1 className="text-3xl font-extrabold">{t('admin.login.title')}</h1>
          <p className="mt-1 text-ink/60">{t('admin.login.subtitle')}</p>

          <label className="mt-8 block text-sm font-bold" htmlFor="email">{t('admin.login.email')}</label>
          <input
            id="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field mt-1.5"
          />

          <label className="mt-4 block text-sm font-bold" htmlFor="password">{t('admin.login.password')}</label>
          <input
            id="password"
            type="password"
            dir="ltr"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field mt-1.5"
          />

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || !email || !password}
            className="mt-6 w-full rounded-full bg-brand-600 py-3 font-extrabold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 disabled:opacity-50"
          >
            {pending ? t('admin.login.pending') : t('admin.login.submit')}
          </button>
        </motion.form>
      </main>
    </div>
  )
}
