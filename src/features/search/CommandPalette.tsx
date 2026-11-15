import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { GUIDE_SECTIONS } from '@/features/guides/sections'
import { isLatin, matches } from '@/features/guides/search'
import type { LocalizedText } from '@/features/guides/types'
import { useGuideCollection } from '@/features/guides/useGuideCollection'
import { useLocalized } from '@/features/guides/useLocalized'
import { Highlight } from '@/features/tickets/Highlight'

type Props = { open: boolean; initialQuery: string; onClose: () => void }

type Result = {
  id: string
  group: 'sections' | 'tickets' | 'financial'
  title: string
  meta?: string
  icon: string | React.ReactNode
  to: string
}

const both = (t?: LocalizedText) => (t ? `${t.ar} ${t.en ?? ''}` : '')

export default function CommandPalette({ open, initialQuery, onClose }: Props) {
  return <AnimatePresence>{open && <Palette key="palette" initialQuery={initialQuery} onClose={onClose} />}</AnimatePresence>
}

function Palette({ initialQuery, onClose }: Omit<Props, 'open'>) {
  const { t } = useTranslation()
  const l = useLocalized()
  const navigate = useNavigate()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState(initialQuery)
  const [active, setActive] = useState(0)
  const { status, data } = useGuideCollection('ticketCategories')
  const { data: inquiries } = useGuideCollection('financialInquiries')

  const results = useMemo<Result[]>(() => {
    const sections: Result[] = GUIDE_SECTIONS.filter((s) => matches(`${t(`sections.${s.key}.title`)} ${t(`sections.${s.key}.short`)}`, query)).map((s) => ({
      id: `section-${s.slug}`,
      group: 'sections',
      title: t(`sections.${s.key}.title`),
      meta: t(`sections.${s.key}.short`),
      icon: <s.Icon className="size-5" />,
      to: `/guides/${s.slug}`,
    }))
    const tickets: Result[] = data.flatMap((c) =>
      c.subtypes
        .filter((s) => matches(`${both(s.title)} ${both(s.whenToUse)} ${both(s.note)} ${both(c.title)}`, query))
        .map((s) => ({
          id: `ticket-${s.id}`,
          group: 'tickets' as const,
          title: l(s.title),
          meta: l(c.title),
          icon: c.icon ?? '🎫',
          to: `/guides/tickets#${s.id}`,
        })),
    )
    const financial: Result[] = inquiries
      .filter((q) => matches([q.title, q.group, q.details, ...q.employeeActions, ...(q.replies ?? []).map((r) => r.text)].map(both).join(' '), query))
      .map((q) => ({
        id: `financial-${q.id}`,
        group: 'financial' as const,
        title: l(q.title),
        meta: l(q.details),
        icon: q.icon ?? '💬',
        to: `/guides/financial#${q.id}`,
      }))
    return [...sections, ...tickets.slice(0, query ? 40 : 6), ...financial.slice(0, query ? 20 : 4)]
  }, [data, inquiries, query, t, l])

  const safeActive = Math.min(active, Math.max(results.length - 1, 0))

  useEffect(() => {
    inputRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${safeActive}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [safeActive])

  const go = (r?: Result) => {
    if (!r) return
    onClose()
    navigate(r.to)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[safeActive])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  let lastGroup: Result['group'] | null = null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={t('search.title')}
        initial={{ opacity: 0, y: -16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-ink/5"
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[safeActive] ? `${listId}-${safeActive}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            placeholder={t('search.placeholder')}
            className="h-16 min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-ink-300"
          />
          <kbd className="rounded-lg border border-line px-2 py-1 text-xs font-semibold text-ink-500">Esc</kbd>
        </div>

        <ul ref={listRef} id={listId} role="listbox" className="max-h-[min(60vh,28rem)] overflow-y-auto p-2">
          {status === 'loading' && results.length <= GUIDE_SECTIONS.length && (
            <li className="px-4 py-3 text-sm text-ink-500">{t('search.loading')}</li>
          )}
          {results.length === 0 && status !== 'loading' && <li className="px-4 py-10 text-center text-ink-500">{t('search.empty')}</li>}
          {results.map((r, i) => {
            const header = r.group !== lastGroup
            lastGroup = r.group
            const latin = isLatin(r.title)
            return (
              <li key={r.id} role="presentation">
                {header && <p className="px-3 pt-3 pb-1.5 text-xs font-semibold text-ink-500">{t(`search.groups.${r.group}`)}</p>}
                <div
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === safeActive}
                  data-index={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(r)}
                  className={clsx(
                    'relative flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors',
                    i === safeActive ? 'bg-brand-50' : 'hover:bg-cream',
                  )}
                >
                  {i === safeActive && <motion.span layoutId="palette-active" className="absolute inset-y-2 start-0 w-1 rounded-full bg-brand-600" />}
                  <span className={clsx('grid size-10 shrink-0 place-items-center rounded-xl text-lg', i === safeActive ? 'bg-white text-brand-600 shadow-card' : 'bg-cream text-ink-500')}>
                    {r.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={clsx('block truncate font-semibold', latin && 'rtl:text-right')} dir={latin ? 'ltr' : undefined}>
                      <Highlight text={r.title} query={query} />
                    </span>
                    {r.meta && (
                      <span className={clsx('block truncate text-sm text-ink-500', isLatin(r.meta) && 'rtl:text-right')} dir={isLatin(r.meta) ? 'ltr' : undefined}>
                        {r.meta}
                      </span>
                    )}
                  </span>
                  <svg viewBox="0 0 24 24" className={clsx('size-4 shrink-0 transition rtl:-scale-x-100', i === safeActive ? 'text-brand-600' : 'text-transparent')} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </div>
              </li>
            )
          })}
        </ul>

        <footer className="flex items-center gap-4 border-t border-line bg-cream/60 px-5 py-2.5 text-xs text-ink-500">
          <span><kbd className="font-semibold">↑↓</kbd> {t('search.hintNavigate')}</span>
          <span><kbd className="font-semibold">Enter</kbd> {t('search.hintOpen')}</span>
        </footer>
      </motion.div>
    </div>
  )
}
