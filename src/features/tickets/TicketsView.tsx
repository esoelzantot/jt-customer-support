import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useLocation, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Mascot } from '@/components/brand/Mascot'
import { matches } from '@/features/guides/search'
import type { LocalizedText, TicketCategory, TicketSubtype } from '@/features/guides/types'
import { useGuideCollection } from '@/features/guides/useGuideCollection'
import { useLocalized } from '@/features/guides/useLocalized'
import { CategoryBlock } from './CategoryBlock'
import { TicketsSidebar } from './TicketsSidebar'

const both = (t?: LocalizedText) => (t ? `${t.ar} ${t.en ?? ''}` : '')
const subtypeText = (s: TicketSubtype) => [s.title, s.whenToUse, s.note].map(both).join(' ')

function Skeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="h-24 w-2/3 animate-pulse rounded-3xl bg-ink/5" />
      <div className="grid gap-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-3xl bg-white ring-1 ring-line" />
        ))}
      </div>
    </div>
  )
}

/**
 * Tracks which category the reader is in.
 * - Active = the last section whose top has passed the reading line under the sticky bars.
 * - At the very bottom of the page the last section wins (short last sections can't reach the line).
 * - `pin(id)` (on click) locks the choice until the user scrolls by hand, so the clicked item
 *   is highlighted even when the page can't scroll that section to the top.
 */
function useScrollSpy(ids: string[]) {
  const [spied, setSpied] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)

  useEffect(() => {
    if (!ids.length) return
    // Cheap (one rect read per category), so it runs directly on scroll; React bails out when unchanged.
    const compute = () => {
      const line = 180
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(`cat-${id}`)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setSpied(atBottom ? ids[ids.length - 1] : current)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [ids])

  // Any manual scroll intent releases the pin.
  useEffect(() => {
    if (!pinned) return
    const release = () => setPinned(null)
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) release()
    }
    window.addEventListener('wheel', release, { passive: true })
    window.addEventListener('touchmove', release, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchmove', release)
      window.removeEventListener('keydown', onKey)
    }
  }, [pinned])

  const active = pinned && ids.includes(pinned) ? pinned : spied
  return [active, setPinned] as const
}

export default function TicketsView() {
  const { t } = useTranslation()
  const l = useLocalized()
  const { status, data } = useGuideCollection('ticketCategories')
  const [params, setParams] = useSearchParams()
  const { hash } = useLocation()
  const query = params.get('q') ?? ''
  const deferredQuery = useDeferredValue(query)
  const inputRef = useRef<HTMLInputElement>(null)
  const [flashId, setFlashId] = useState<string | null>(null)

  const setQuery = (value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set('q', value)
        else next.delete('q')
        return next
      },
      { replace: true, preventScrollReset: true },
    )

  // "/" focuses the in-page filter.
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

  // Deep link (#ticket-id from global search): scroll to it and flash it once data is in.
  useEffect(() => {
    const id = decodeURIComponent(hash.slice(1))
    if (status !== 'ready' || !id) return
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const start = window.setTimeout(() => setFlashId(id), 0)
    const stop = window.setTimeout(() => setFlashId(null), 2000)
    return () => {
      window.clearTimeout(start)
      window.clearTimeout(stop)
    }
  }, [hash, status])

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

  const ids = useMemo(() => filtered.map((x) => x.category.id), [filtered])
  const [activeId, pinActive] = useScrollSpy(ids)
  const total = filtered.reduce((n, x) => n + x.subtypes.length, 0)
  const counts = useMemo(() => Object.fromEntries(filtered.map((x) => [x.category.id, x.subtypes.length])), [filtered])

  // Keep the active category chip visible in the horizontal strip (mobile/tablet).
  const chipsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!activeId || !chipsRef.current) return
    chipsRef.current.querySelector<HTMLElement>(`[data-chip="${activeId}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [activeId])

  const jump = (id: string) => {
    pinActive(id)
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 lg:grid lg:grid-cols-[19rem_1fr] lg:gap-10">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:block">
        <TicketsSidebar categories={data} counts={counts} activeId={activeId} onJump={jump} />
      </aside>

      <div className="min-w-0">
        {/* Filter bar */}
        <div className="sticky top-[6.75rem] z-30 -mx-4 bg-cream/85 px-4 pt-2 pb-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-16 lg:mx-0 lg:px-0">
          <label className="group relative block">
            <span className="sr-only">{t('tickets.searchLabel')}</span>
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute inset-y-0 start-4 my-auto size-5 text-ink-300 group-focus-within:text-brand-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('tickets.searchPlaceholder')}
              className="w-full rounded-2xl bg-white py-3.5 ps-12 pe-12 shadow-card ring-1 ring-line outline-none transition placeholder:text-ink-300 focus:ring-2 focus:ring-brand-600"
            />
            <kbd className="pointer-events-none absolute inset-y-0 end-4 my-auto hidden h-6 place-items-center rounded-md border border-line px-1.5 font-sans text-xs font-semibold text-ink-300 sm:grid">/</kbd>
          </label>

          {/* Category chips (mobile/tablet) */}
          <div ref={chipsRef} className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none] lg:hidden">
            {filtered.map(({ category: c, subtypes }) => (
              <button
                key={c.id}
                data-chip={c.id}
                type="button"
                onClick={() => jump(c.id)}
                className={clsx(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition',
                  activeId === c.id ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-ink-700 ring-line',
                )}
              >
                <span aria-hidden>{c.icon}</span>
                <span dir="auto">{l(c.title)}</span>
                <span className="text-xs opacity-70" dir="ltr">{subtypes.length}</span>
              </button>
            ))}
          </div>

          {status === 'ready' && query && (
            <p className="mt-3 text-sm text-ink-500" aria-live="polite">
              {t('tickets.results', { count: total })}
            </p>
          )}
        </div>

        <div className="mt-4">
          {status === 'loading' ? (
            <Skeleton />
          ) : status === 'error' && data.length === 0 ? (
            <p role="alert" className="rounded-3xl bg-brand-50 p-6 text-center font-semibold text-brand-700">{t('tickets.loadError')}</p>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center rounded-[2rem] bg-white py-14 text-center ring-1 ring-line">
              <Mascot interactive={false} className="w-28" />
              <p className="mt-6 text-lg font-bold">{t('tickets.noResults')}</p>
              <button type="button" onClick={() => setQuery('')} className="mt-4 rounded-full bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700">
                {t('tickets.clear')}
              </button>
            </div>
          ) : (
            <div className="space-y-20">
              <AnimatePresence initial={false}>
                {filtered.map(({ category, subtypes }) => (
                  <CategoryBlock key={category.id} category={category} number={data.indexOf(category) + 1} subtypes={subtypes} query={deferredQuery} flashId={flashId} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
