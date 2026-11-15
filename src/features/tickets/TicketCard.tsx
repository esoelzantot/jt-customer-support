import { useState } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { RichText } from '@/features/guides/RichText'
import type { TicketSubtype } from '@/features/guides/types'
import { isLatin } from '@/features/guides/search'
import { useLocalized } from '@/features/guides/useLocalized'
import { Highlight } from './Highlight'

type Props = { subtype: TicketSubtype; code: string; query: string; index: number }

/** A sub-type rendered as a physical ticket: brand stub, perforation, and the guidance body. */
export function TicketCard({ subtype, code, query, index }: Props) {
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
      /* clipboard blocked: nothing to do */
    }
  }

  return (
    <motion.article
      layout
      id={subtype.id}
      initial={{ opacity: 0, y: 24, rotate: index % 2 ? 0.6 : -0.6 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative flex scroll-mt-40 overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_-12px_rgb(129_23_27/0.25)] ring-1 ring-brand-600/10"
    >
      {/* Stub */}
      <div className="relative flex w-14 shrink-0 flex-col items-center justify-between bg-gradient-to-b from-brand-600 to-brand-800 py-4 text-white sm:w-16">
        <div aria-hidden className="bg-speed-lines absolute inset-0 opacity-60" />
        <span className="text-display relative text-sm [writing-mode:vertical-rl]" dir="ltr">
          {code}
        </span>
        <span
          aria-hidden
          className="relative h-16 w-6 opacity-80"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 2px, transparent 2px 4px, #fff 4px 5px, transparent 5px 8px)' }}
        />
      </div>

      {/* Perforation notches */}
      <span aria-hidden className="absolute -top-3 start-[2.75rem] size-6 rounded-full bg-cream sm:start-[3.25rem]" />
      <span aria-hidden className="absolute -bottom-3 start-[2.75rem] size-6 rounded-full bg-cream sm:start-[3.25rem]" />

      {/* Body */}
      <div className="min-w-0 flex-1 border-s-2 border-dashed border-brand-600/20 p-5">
        <header className="flex items-start gap-3">
          <h3
            className={latin ? 'text-display min-w-0 flex-1 text-lg leading-snug text-ink rtl:text-right' : 'min-w-0 flex-1 text-lg font-extrabold'}
            dir={latin ? 'ltr' : undefined}
            lang={latin ? 'en' : undefined}
          >
            <Highlight text={title} query={query} />
          </h3>
          <button
            type="button"
            onClick={copy}
            aria-label={`${t('tickets.copy')}: ${title}`}
            className="relative shrink-0 rounded-full border border-brand-600/15 px-3 py-1 text-xs font-bold text-brand-700 transition hover:bg-brand-600 hover:text-white"
          >
            <span aria-live="polite">{copied ? `✓ ${t('tickets.copied')}` : t('tickets.copy')}</span>
          </button>
        </header>

        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-extrabold text-brand-700">
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 3 3 5-6" />
          </svg>
          {t('tickets.whenToUse')}
        </p>
        <RichText text={l(subtype.whenToUse)} className="mt-2 text-[0.95rem] text-ink/85" />

        {subtype.note && (
          <aside className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-blush/60 to-brand-50 p-4 ring-1 ring-brand-600/10">
            <span aria-hidden className="absolute inset-y-0 start-0 w-1 bg-brand-600" />
            <p className="flex items-center gap-1.5 text-xs font-extrabold text-brand-800">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
              </svg>
              {t('tickets.note')}
            </p>
            <RichText text={l(subtype.note)} className="mt-2 text-sm text-ink/85" />
          </aside>
        )}
      </div>
    </motion.article>
  )
}
