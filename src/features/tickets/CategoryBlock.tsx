import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { RichText } from '@/features/guides/RichText'
import { isLatin } from '@/features/guides/search'
import type { TicketCategory, TicketSubtype } from '@/features/guides/types'
import { useLocalized } from '@/features/guides/useLocalized'
import { TicketCard } from './TicketCard'

type Props = { category: TicketCategory; number: number; subtypes: TicketSubtype[]; query: string }

export function CategoryBlock({ category, number, subtypes, query }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()
  const title = l(category.title)
  const latin = isLatin(title)
  const rules = category.rules ?? []

  return (
    <motion.section
      layout
      id={`cat-${category.id}`}
      aria-labelledby={`cat-${category.id}-title`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="scroll-mt-40"
    >
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2rem] bg-ink p-6 text-white sm:p-8"
      >
        <div aria-hidden className="absolute -end-20 -top-24 size-72 rounded-full bg-brand-600/40 blur-3xl" />
        <span aria-hidden className="text-display absolute -bottom-10 end-4 text-[9rem] leading-none text-white/[0.06]" dir="ltr">
          {String(number).padStart(2, '0')}
        </span>

        <div className="relative flex flex-wrap items-start gap-5">
          <motion.span
            whileHover={{ rotate: -10, scale: 1.08 }}
            className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-3xl shadow-lg shadow-brand-950/40"
          >
            <span aria-hidden>{category.icon ?? '🎫'}</span>
          </motion.span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-wider text-brand-300">
              {t('tickets.mainType')} · <span dir="ltr">{String(number).padStart(2, '0')}</span>
            </p>
            <h2
              id={`cat-${category.id}-title`}
              className={latin ? 'text-display mt-1 text-2xl sm:text-3xl rtl:text-right' : 'mt-1 text-2xl font-extrabold sm:text-3xl'}
              dir={latin ? 'ltr' : undefined}
              lang={latin ? 'en' : undefined}
            >
              {title}
            </h2>
            <RichText text={l(category.description)} className="mt-2 max-w-3xl text-white/75" />
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">{t('tickets.subtypesCount', { count: subtypes.length })}</span>
        </div>

        {rules.length > 0 && (
          <div className="relative mt-6 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
            <p className="text-sm font-extrabold text-brand-300">{t('tickets.rules')}</p>
            <ol className="mt-3 grid gap-2 md:grid-cols-3">
              {rules.map((rule, i) => (
                <li key={i} className="flex gap-3 rounded-xl bg-white/5 p-3 text-sm">
                  <span className="text-display grid size-6 shrink-0 place-items-center rounded-full bg-brand-600 text-xs" dir="ltr">
                    {i + 1}
                  </span>
                  <RichText text={l(rule)} className="min-w-0 flex-1 leading-6" />
                </li>
              ))}
            </ol>
          </div>
        )}
      </motion.header>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <AnimatePresence initial={false}>
          {subtypes.map((s, i) => (
            <TicketCard
              key={s.id}
              subtype={s}
              code={`${number}.${category.subtypes.indexOf(s) + 1}`}
              query={query}
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
