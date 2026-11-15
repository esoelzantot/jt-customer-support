import { motion } from 'motion/react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/features/auth/authContext'
import { GUIDE_SECTIONS, type GuideSection } from '@/features/guides/sections'
import { useGuideCollection } from '@/features/guides/useGuideCollection'

function StatCard({ section, index }: { section: GuideSection; index: number }) {
  const { t } = useTranslation()
  const { status, data } = useGuideCollection(section.collection)
  const { Icon, key, slug, accent } = section

  return (
    <motion.li initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
      <Link
        to={`/admin/${slug}`}
        className={`group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br ${accent} p-5 text-white shadow-lg shadow-brand-900/15 transition hover:-translate-y-1`}
      >
        <div aria-hidden className="bg-speed-lines absolute inset-0 opacity-50" />
        <span className="relative grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
          <Icon className="size-7" />
        </span>
        <div className="relative">
          <p className="text-sm font-bold opacity-85">{t(`sections.${key}.title`)}</p>
          <p className="text-display text-3xl" dir="ltr">{status === 'loading' ? '…' : data.length}</p>
        </div>
      </Link>
    </motion.li>
  )
}

export function AdminDashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-extrabold">{t('admin.dashboard.title')}</h1>
      <p className="mt-1 text-ink/60">{t('admin.dashboard.welcome', { email: user?.email })}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {GUIDE_SECTIONS.map((s, i) => (
          <StatCard key={s.slug} section={s} index={i} />
        ))}
      </ul>
    </div>
  )
}
