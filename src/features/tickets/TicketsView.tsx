import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Mascot } from '@/components/brand/Mascot'
import { matches } from '@/features/guides/search'
import type { LocalizedText, TicketCategory, TicketSubtype } from '@/features/guides/types'
import { useGuideCollection } from '@/features/guides/useGuideCollection'
import { useLocalized } from '@/features/guides/useLocalized'
import { CategoryBlock } from './CategoryBlock'

const both = (t?: LocalizedText) => (t ? `${t.ar} ${t.en ?? ''}` : '')
const subtypeText = (s: TicketSubtype) => [s.title, s.whenToUse, s.note].map(both).join(' ')

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function Skeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="h-40 animate-pulse rounded-[2rem] bg-ink/10" />
      <div className="grid gap-5 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-3xl bg-white" />
        ))}
      </div>
    </div>
  )
}

export default function TicketsView() {
  const { t } = useTranslation()
  const l = useLocalized()
  const { status, data } = useGuideCollection('ticketCategories')
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const active = params.get('c')
  const deferredQuery = useDeferredValue(query)
  const inputRef = useRef<HTMLInputElement>(null)

  const update = (key: 'q' | 'c', value: string | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true, preventScrollReset: true },
    )

  // "/" focuses search (unless already typing somewhere).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(el.tagName) && !el.isContentEditable) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  /** Categories with the sub-types matching the search (a category name/description match keeps all its sub-types). */
  const filtered = useMemo(
    () =>
      data
        .map((c: TicketCategory) => {
          const categoryHit = deferredQuery && matches(`${both(c.title)} ${both(c.description)}`, deferredQuery)
          const subtypes = categoryHit ? c.subtypes : c.subtypes.filter((s) => matches(`${subtypeText(s)} ${both(c.title)}`, deferredQuery))
          return { category: c, subtypes }
        })
        .filter((x) => x.subtypes.length > 0),
    [data, deferredQuery],
  )

  const visible = active ? filtered.filter((x) => x.category.id === active) : filtered
  const total = visible.reduce((n, x) => n + x.subtypes.length, 0)
  const countFor = (id: string) => filtered.find((x) => x.category.id === id)?.subtypes.length ?? 0

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      {/* Toolbar */}
      <div className="z-30 -mx-4 bg-cream/85 px-4 pt-6 pb-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:sticky lg:top-16">
        <label className="group relative block">
          <span className="sr-only">{t('tickets.searchLabel')}</span>
          <span className="pointer-events-none absolute inset-y-0 start-4 grid place-items-center text-ink/40 group-focus-within:text-brand-600">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => update('q', e.target.value)}
            placeholder={t('tickets.searchPlaceholder')}
            className="w-full rounded-2xl border-2 border-transparent bg-white py-3.5 ps-12 pe-14 text-base shadow-[0_10px_30px_-15px_rgb(129_23_27/0.35)] outline-none transition focus:border-brand-600"
          />
          <kbd className="pointer-events-none absolute inset-y-0 end-4 my-auto hidden h-7 place-items-center rounded-lg border border-ink/15 px-2 text-xs font-bold text-ink/40 sm:grid">
            /
          </kbd>
        </label>

        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="toolbar" aria-label={t('tickets.filter')}>
          {[{ id: null, label: t('tickets.all'), icon: '✦', count: filtered.reduce((n, x) => n + x.subtypes.length, 0) }, ...data.map((c) => ({ id: c.id, label: l(c.title), icon: c.icon ?? '🎫', count: countFor(c.id) }))].map(
            (chip) => {
              const selected = active === chip.id
              return (
                <button
                  key={chip.id ?? 'all'}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update('c', chip.id)}
                  className={clsx(
                    'relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition',
                    selected ? 'text-white' : 'bg-white text-ink/70 ring-1 ring-brand-600/10 hover:text-brand-700',
                    chip.count === 0 && !selected && 'opacity-40',
                  )}
                >
                  {selected && (
                    <motion.span layoutId="ticket-chip" className="absolute inset-0 rounded-full bg-brand-600 shadow-lg shadow-brand-600/30" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <span aria-hidden className="relative">{chip.icon}</span>
                  <span className="relative" dir="auto">{chip.label}</span>
                  <span className={clsx('relative rounded-full px-1.5 text-xs', selected ? 'bg-white/20' : 'bg-brand-50 text-brand-700')} dir="ltr">
                    {chip.count}
                  </span>
                </button>
              )
            },
          )}
        </div>

        {status === 'ready' && (
          <p className="mt-2 text-sm text-ink/50" aria-live="polite">
            {t('tickets.results', { count: total })}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="mt-6">
        {status === 'loading' ? (
          <Skeleton />
        ) : status === 'error' && data.length === 0 ? (
          <p role="alert" className="rounded-2xl bg-brand-50 p-6 text-center font-semibold text-brand-700">{t('tickets.loadError')}</p>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Mascot interactive={false} className="w-32" />
            <p className="mt-6 text-lg font-extrabold">{t('tickets.noResults')}</p>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="mt-4 rounded-full bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-700">
              {t('tickets.clear')}
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            <AnimatePresence initial={false}>
              {visible.map(({ category, subtypes }) => (
                <CategoryBlock key={category.id} category={category} number={data.indexOf(category) + 1} subtypes={subtypes} query={deferredQuery} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
