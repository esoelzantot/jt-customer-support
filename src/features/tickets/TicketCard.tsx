import { useState } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { RichText } from '@/features/guides/RichText'
import { isLatin } from '@/features/guides/search'
import type { TicketSubtype } from '@/features/guides/types'
import { useLocalized } from '@/features/guides/useLocalized'
import { Highlight } from './Highlight'
import { RoutingBadge } from './RoutingBadge'

type Props = { subtype: TicketSubtype; code: string; query: string; index: number; flash?: boolean }

function CopyIcon({ done }: { done: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {done ? (
        <path d="m5 12 5 5L20 7" />
      ) : (
        <>
          <rect x="9" y="9" width="11" height="11" rx="2.5" />
          <path d="M5 15V6a2 2 0 0 1 2-2h9" />
        </>
      )}
    </svg>
  )
}

/** A sub-type rendered as a ticket: code stub, perforation, then the guidance. */
export function TicketCard({ subtype, code, query, index, flash }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()
  const [copied, setCopied] = useState(false)
  const title = l(subtype.title)
  const latin = isLatin(title)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(title)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <motion.article
      layout="position"
      id={subtype.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, delay: Math.min(index % 2, 1) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        'group relative flex scroll-mt-28 rounded-3xl bg-white shadow-card ring-1 ring-line transition-shadow duration-300 hover:shadow-lift',
        flash && 'animate-flash',
      )}
    >
      {/* Stub */}
      <div className="relative flex w-12 shrink-0 flex-col items-center justify-between overflow-hidden rounded-s-3xl bg-brand-50 py-5 text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white sm:w-14">
        <span className="text-display text-sm [writing-mode:vertical-rl]" dir="ltr" lang="en">
          {code}
        </span>
        <span
          aria-hidden
          className="h-14 w-5 opacity-50"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, currentColor 0 2px, transparent 2px 4px, currentColor 4px 5px, transparent 5px 8px)' }}
        />
      </div>

      {/* Perforation */}
      <span aria-hidden className="absolute -top-2.5 start-[2.4rem] size-5 rounded-full bg-cream ring-1 ring-line [clip-path:inset(50%_0_0_0)] sm:start-[2.9rem]" />
      <span aria-hidden className="absolute -bottom-2.5 start-[2.4rem] size-5 rounded-full bg-cream ring-1 ring-line [clip-path:inset(0_0_50%_0)] sm:start-[2.9rem]" />

      <div className="min-w-0 flex-1 border-s border-dashed border-line p-5 sm:p-6">
        <header className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className={clsx('text-xl leading-snug sm:text-[1.375rem]', latin ? 'text-display text-ink rtl:text-right' : 'font-bold')}
              dir={latin ? 'ltr' : undefined}
              lang={latin ? 'en' : undefined}
            >
              <Highlight text={title} query={query} />
            </h3>
            {subtype.subtitle && (
              <p className="mt-1 text-base font-semibold text-ink-500">
                <Highlight text={l(subtype.subtitle)} query={query} />
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={copy}
            aria-label={`${t('tickets.copy')}: ${title}`}
            title={t('tickets.copy')}
            className={clsx(
              'flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition',
              copied ? 'bg-emerald-50 text-emerald-700' : 'text-ink-500 hover:bg-brand-50 hover:text-brand-700',
            )}
          >
            <CopyIcon done={copied} />
            <span aria-live="polite" className="hidden sm:inline">{copied ? t('tickets.copied') : t('tickets.copy')}</span>
          </button>
        </header>

        {subtype.routing && <RoutingBadge routing={subtype.routing} className="mt-4" />}

        <p className="mt-4 text-sm font-semibold text-brand-700">{t('tickets.whenToUse')}</p>
        <RichText text={l(subtype.whenToUse)} className="mt-2 text-[1.0625rem] leading-8 text-ink-700 sm:text-lg sm:leading-9" />

        {subtype.note && (
          <aside className="mt-5 rounded-2xl bg-cream p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
              <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[0.7rem] font-bold text-white">!</span>
              {t('tickets.note')}
            </p>
            <RichText text={l(subtype.note)} className="mt-2 text-base leading-8 text-ink-700 sm:text-[1.0625rem]" />
          </aside>
        )}
      </div>
    </motion.article>
  )
}
