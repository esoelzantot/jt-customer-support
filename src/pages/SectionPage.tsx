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
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center">
      <Mascot interactive={false} className="w-36" />
      <p className="mt-6 text-lg font-semibold text-ink-500">{t('sections.comingSoon')}</p>
    </section>
  )
}

export function SectionPage() {
  const { section: slug = '' } = useParams()
  const { t } = useTranslation()
  const section = findSection(slug)

  if (!section) return <NotFoundPage />
  const { Icon, key } = section
  const View = VIEWS[key]

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.25rem] bg-brand-600 text-white shadow-brand"
        >
          <div aria-hidden className="bg-speed-lines absolute inset-0" />
          <div aria-hidden className="absolute -bottom-24 -start-16 size-72 rounded-full bg-brand-950/30 blur-3xl" />
          <div className="relative flex items-center gap-5 px-6 py-9 sm:px-10 sm:py-12 md:pe-56">
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
              className="hidden size-16 shrink-0 place-items-center rounded-2xl bg-white text-brand-600 shadow-lg sm:grid sm:size-20"
            >
              <Icon className="size-9 sm:size-10" />
            </motion.span>
            <div className="min-w-0">
              <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-white/75">
                <Link to="/" className="hover:text-white hover:underline">{t('nav.home')}</Link>
                <span aria-hidden>/</span>
                <span className="text-white">{t(`sections.${key}.title`)}</span>
              </nav>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">{t(`sections.${key}.title`)}</h1>
              <p className="mt-3 max-w-2xl leading-7 text-white/85">{t(`sections.${key}.description`)}</p>
            </div>
          </div>

          {/* Mascot peeking up from the bottom edge */}
          <motion.img
            src={rabbitUrl}
            alt=""
            aria-hidden
            draggable={false}
            initial={{ y: '75%', rotate: 10 }}
            animate={{ y: '30%', rotate: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 12, delay: 0.35 }}
            whileHover={{ y: '12%', rotate: -5 }}
            className="absolute bottom-0 end-10 hidden w-40 drop-shadow-2xl md:block lg:end-14 lg:w-44"
          />
        </motion.header>
      </div>

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
