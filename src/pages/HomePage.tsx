import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { HeroVisual } from '@/features/home/HeroVisual'
import { SectionCard } from '@/features/guides/SectionCard'
import { GUIDE_SECTIONS } from '@/features/guides/sections'
import { isMac, openSearch } from '@/features/search/searchBus'

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }),
}

const POPULAR = ['Delayed Delivery', 'Change Delivery Address', 'Lost Item', 'Fake Update', 'Financial Issues']

export function HomePage() {
  const { t } = useTranslation()
  const steps = ['search', 'choose', 'copy'] as const

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16 lg:pb-24">
          <div>
            <motion.p variants={reveal} initial="hidden" animate="show" custom={0} className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 shadow-card ring-1 ring-line">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-brand-500 opacity-75" />
                <span className="relative size-2 rounded-full bg-brand-600" />
              </span>
              {t('home.eyebrow')}
            </motion.p>

            <motion.h1 variants={reveal} initial="hidden" animate="show" custom={1} className="mt-6 text-4xl leading-[1.25] font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl lg:leading-[1.2]">
              {t('home.title')}
              <br />
              <span className="relative inline-block text-brand-600">
                {t('home.titleAccent')}
                <svg aria-hidden viewBox="0 0 300 24" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-3 h-4 w-full text-brand-600/25">
                  <motion.path
                    d="M4 16 C 80 4, 200 4, 296 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.7, duration: 0.9, ease: 'easeOut' }}
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p variants={reveal} initial="hidden" animate="show" custom={2} className="mt-6 max-w-xl text-lg leading-8 text-ink-500">
              {t('home.subtitle')}
            </motion.p>

            {/* Search entry */}
            <motion.div variants={reveal} initial="hidden" animate="show" custom={3} className="mt-8 max-w-xl">
              <button
                type="button"
                onClick={() => openSearch()}
                className="group flex w-full items-center gap-3 rounded-2xl bg-white p-2 ps-5 text-start shadow-lift ring-1 ring-line transition hover:ring-brand-200"
              >
                <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <span className="min-w-0 flex-1 truncate text-ink-500">{t('home.searchPlaceholder')}</span>
                <kbd className="hidden rounded-lg border border-line bg-cream px-2 py-1 font-sans text-xs font-semibold text-ink-500 sm:block" dir="ltr">
                  {isMac() ? '⌘' : 'Ctrl'} K
                </kbd>
                <span className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-brand-700">{t('home.cta')}</span>
              </button>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-ink-500">{t('home.popular')}</span>
                {POPULAR.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => openSearch(name)}
                    dir="ltr"
                    className="rounded-full bg-white px-3 py-1 font-semibold text-ink-700 ring-1 ring-line transition hover:text-brand-700 hover:ring-brand-200"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* Sections bento */}
      <section id="sections" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-700">{t('home.sectionsEyebrow')}</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{t('nav.sections')}</h2>
          </div>
          <p className="max-w-md text-ink-500">{t('home.sectionsLead')}</p>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-2 md:grid-rows-2">
          {GUIDE_SECTIONS.map((section, i) => (
            <SectionCard key={section.slug} section={section} index={i} featured={i === 0} />
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="border-t border-line bg-white">
        <ol className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.li
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex gap-4"
            >
              <span className="text-display grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-lg text-brand-600" dir="ltr" lang="en">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold">{t(`home.steps.${step}.title`)}</h3>
                <p className="mt-1 leading-7 text-ink-500">{t(`home.steps.${step}.body`)}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>
    </>
  )
}
