import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Mascot } from '@/components/brand/Mascot'
import { SectionCard } from '@/features/guides/SectionCard'
import { GUIDE_SECTIONS } from '@/features/guides/sections'

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
}

export function HomePage() {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden">
      {/* Decorative brand blobs */}
      <div aria-hidden className="absolute -end-40 -top-40 -z-10 size-[36rem] rounded-full bg-brand-600/10 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -start-32 -z-10 size-[28rem] rounded-full bg-blush/60 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="text-center lg:text-start">
          <motion.span
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-block rounded-full bg-brand-600/10 px-4 py-1 text-sm font-bold text-brand-700"
          >
            {t('home.eyebrow')}
          </motion.span>

          <motion.h1
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={1}
            className="text-display mt-5 text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl"
          >
            {t('home.title')}{' '}
            <span className="relative inline-block text-brand-600">
              {t('home.titleAccent')}
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
                className="absolute inset-x-0 -bottom-1 h-2 origin-left rtl:origin-right rounded-full bg-brand-600/25"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto mt-5 max-w-xl text-lg text-ink/70 lg:mx-0"
          >
            {t('home.subtitle')}
          </motion.p>

          <motion.div variants={reveal} initial="hidden" animate="show" custom={3} className="mt-8">
            <motion.a
              href="#sections"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-block rounded-full bg-brand-600 px-8 py-3.5 text-base font-extrabold text-white shadow-xl shadow-brand-600/30 transition-colors hover:bg-brand-700"
            >
              {t('home.cta')}
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.2 }}
          className="relative mx-auto w-56 sm:w-72 lg:w-80"
        >
          <div aria-hidden className="absolute inset-x-0 top-[12%] -z-10 mx-auto aspect-square w-[95%] rounded-full bg-brand-600 bg-speed-lines" />
          <Mascot />
        </motion.div>
      </div>

      {/* Brand marquee */}
      <div aria-hidden className="overflow-hidden bg-brand-600 py-3 text-white" dir="ltr">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, half) => (
            <div key={half} className="flex gap-10">
              {Array.from({ length: 8 }).map((__, i) => (
                <span key={i} className="flex items-center gap-10 text-lg font-extrabold">
                  <span className="text-display">J&amp;T EXPRESS</span>
                  <span>سرعة · دقة</span>
                  <span className="text-display">15885</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div id="sections" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="text-display text-center text-3xl text-ink sm:text-4xl">{t('nav.sections')}</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {GUIDE_SECTIONS.map((section, i) => (
            <SectionCard key={section.slug} section={section} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
