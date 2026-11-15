import type { PointerEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import type { GuideSection } from './sections'

const MotionLink = motion.create(Link)

/** Bento card for a guide section. `featured` renders the large red variant. */
export function SectionCard({ section, index, featured }: { section: GuideSection; index: number; featured?: boolean }) {
  const { t } = useTranslation()
  const { slug, key, Icon } = section
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mx}% ${my}%, ${featured ? 'rgb(255 255 255 / 0.18)' : 'rgb(236 28 42 / 0.08)'}, transparent 70%)`

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 100)
    my.set(((e.clientY - r.top) / r.height) * 100)
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(featured && 'md:row-span-2')}
    >
      <MotionLink
        to={`/guides/${slug}`}
        onPointerMove={onMove}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={clsx(
          'group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-7 sm:p-8',
          featured ? 'min-h-80 bg-brand-600 text-white shadow-brand' : 'min-h-56 bg-white text-ink shadow-card ring-1 ring-line hover:shadow-lift',
        )}
      >
        {featured && <div aria-hidden className="bg-speed-lines absolute inset-0" />}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />

        <div className="relative flex items-start justify-between gap-4">
          <span
            className={clsx(
              'grid size-14 place-items-center rounded-2xl transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-[8deg] group-hover:scale-110',
              featured ? 'bg-white text-brand-600' : 'bg-brand-50 text-brand-600',
            )}
          >
            <Icon className="size-7" />
          </span>
          <span className={clsx('text-display text-sm', featured ? 'text-white/60' : 'text-ink-300')} dir="ltr" lang="en">
            0{index + 1}
          </span>
        </div>

        <div className="relative mt-auto pt-10">
          <h3 className={clsx('font-bold', featured ? 'text-3xl sm:text-4xl' : 'text-2xl')}>{t(`sections.${key}.title`)}</h3>
          <p className={clsx('mt-2 max-w-md leading-7', featured ? 'text-white/85' : 'text-ink-500')}>{t(`sections.${key}.description`)}</p>
          <span
            className={clsx(
              'mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              featured ? 'bg-white text-brand-700' : 'bg-cream text-ink group-hover:bg-brand-600 group-hover:text-white',
            )}
          >
            {t('home.explore')}
            <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </MotionLink>
    </motion.li>
  )
}
