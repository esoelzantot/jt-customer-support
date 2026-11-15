import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { motion } from 'motion/react'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import rabbitUrl from '@/assets/brand/mascot-rabbit.png'
import { Mascot } from '@/components/brand/Mascot'
import { Spinner } from '@/components/ui/Spinner'
import { findSection, type GuideSection } from '@/features/guides/sections'
import { NotFoundPage } from './NotFoundPage'

// Each section's view is its own chunk (and pulls Firestore in only when needed).
const VIEWS: Partial<Record<GuideSection['key'], LazyExoticComponent<ComponentType>>> = {
  tickets: lazy(() => import('@/features/tickets/TicketsView')),
}

function ComingSoon() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-14 text-center">
      <Mascot interactive={false} className="w-36" />
      <p className="mt-6 text-lg font-bold text-ink/70">{t('sections.comingSoon')}</p>
    </section>
  )
}

export function SectionPage() {
  const { section: slug = '' } = useParams()
  const { t } = useTranslation()
  const section = findSection(slug)

  if (!section) return <NotFoundPage />
  const { Icon, accent, key } = section
  const View = VIEWS[key]

  return (
    <>
      <header className={`relative overflow-hidden bg-gradient-to-br ${accent} text-white`}>
        <div aria-hidden className="bg-speed-lines absolute inset-0 opacity-60" />
        <div className="relative mx-auto flex max-w-7xl items-center gap-6 px-4 py-12 sm:px-6 lg:py-16">
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="grid size-16 shrink-0 place-items-center rounded-3xl bg-white/15 ring-1 ring-white/30 backdrop-blur sm:size-20"
          >
            <Icon className="size-9 sm:size-11" />
          </motion.span>
          <div className="min-w-0 md:pe-40">
            <nav className="text-sm opacity-80">
              <Link to="/" className="hover:underline">{t('nav.home')}</Link>
              <span className="mx-2">/</span>
              <span>{t(`sections.${key}.title`)}</span>
            </nav>
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-display mt-1 text-3xl sm:text-4xl lg:text-5xl">
              {t(`sections.${key}.title`)}
            </motion.h1>
            <p className="mt-2 max-w-2xl opacity-90">{t(`sections.${key}.description`)}</p>
          </div>
        </div>

        {/* Mascot peeking up from the bottom edge */}
        <motion.img
          src={rabbitUrl}
          alt=""
          aria-hidden
          draggable={false}
          initial={{ y: '70%', rotate: 8 }}
          animate={{ y: '28%', rotate: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 12, delay: 0.3 }}
          whileHover={{ y: '12%', rotate: -4 }}
          className="absolute bottom-0 end-8 hidden w-40 drop-shadow-2xl md:block lg:end-16 lg:w-44"
        />
      </header>

      {View ? (
        <Suspense fallback={<Spinner className="py-20" />}>
          <View />
        </Suspense>
      ) : (
        <ComingSoon />
      )}
    </>
  )
}
