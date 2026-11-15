import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { RichText } from '@/features/guides/RichText'
import { isLatin } from '@/features/guides/search'
import type { TicketCategory, TicketSubtype } from '@/features/guides/types'
import { useLocalized } from '@/features/guides/useLocalized'
import { TicketCard } from './TicketCard'

type Props = { category: TicketCategory; number: number; subtypes: TicketSubtype[]; query: string; flashId: string | null }

export function CategoryBlock({ category, number, subtypes, query, flashId }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()
  const title = l(category.title)
  const latin = isLatin(title)
  const rules = category.rules ?? []
  const num = String(number).padStart(2, '0')

  return (
    <motion.section
      layout="position"
      id={`cat-${category.id}`}
      data-category={category.id}
      aria-labelledby={`cat-${category.id}-title`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="scroll-mt-28"
    >
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="flex items-start gap-4 sm:gap-5">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.06 }}
            className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-600 text-2xl shadow-brand sm:size-16 sm:text-3xl"
          >
            <span aria-hidden>{category.icon ?? '🎫'}</span>
          </motion.span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-xs font-semibold text-ink-500">
              <span className="text-display text-brand-600" dir="ltr" lang="en">{num}</span>
              <span className="h-px w-6 bg-line" />
              {t('tickets.mainType')}
              <span className="rounded-full bg-white px-2 py-0.5 ring-1 ring-line">{t('tickets.subtypesCount', { count: subtypes.length })}</span>
            </p>
            <h2
              id={`cat-${category.id}-title`}
              className={latin ? 'text-display mt-1.5 text-2xl text-ink sm:text-3xl rtl:text-right' : 'mt-1.5 text-2xl font-bold sm:text-3xl'}
              dir={latin ? 'ltr' : undefined}
              lang={latin ? 'en' : undefined}
            >
              {title}
            </h2>
            <RichText text={l(category.description)} className="mt-2 max-w-3xl text-[1.0625rem] leading-8 text-ink-500 sm:text-lg" />
          </div>
        </div>

        {rules.length > 0 && (
          <div className="relative mt-6 overflow-hidden rounded-3xl bg-ink p-5 text-white sm:p-6">
            <div aria-hidden className="absolute -end-16 -top-20 size-56 rounded-full bg-brand-600/50 blur-3xl" />
            <p className="relative flex items-center gap-2 text-sm font-semibold">
              <span className="grid size-6 place-items-center rounded-full bg-brand-600 text-xs">!</span>
              {t('tickets.rules')}
            </p>
            <ol className="relative mt-4 grid gap-3 md:grid-cols-3">
              {rules.map((rule, i) => (
                <li key={i} className="flex gap-3 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                  <span className="text-display text-brand-400" dir="ltr" lang="en">0{i + 1}</span>
                  <RichText text={l(rule)} className="min-w-0 flex-1 text-base leading-7 text-white/90" />
                </li>
              ))}
            </ol>
          </div>
        )}
      </motion.header>

      <div className="mt-6 grid gap-5">
        <AnimatePresence initial={false}>
          {subtypes.map((s, i) => (
            <TicketCard
              key={s.id}
              subtype={s}
              code={`${number}.${category.subtypes.indexOf(s) + 1}`}
              query={query}
              index={i}
              flash={flashId === s.id}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
