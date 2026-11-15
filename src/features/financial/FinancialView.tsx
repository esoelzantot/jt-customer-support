import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Mascot } from '@/components/brand/Mascot'
import { Highlight } from '@/features/tickets/Highlight'
import { matches } from '@/features/guides/search'
import type { FinancialInquiry, LocalizedText } from '@/features/guides/types'
import { useGuideCollection } from '@/features/guides/useGuideCollection'
import { useLocalized } from '@/features/guides/useLocalized'
import { Conversation } from './Conversation'

const both = (t?: LocalizedText) => (t ? `${t.ar} ${t.en ?? ''}` : '')
const haystack = (q: FinancialInquiry) =>
  [q.title, q.group, q.details, q.note, ...q.employeeActions, ...(q.replies ?? []).map((r) => r.text)].map(both).join(' ') + ' ' + (q.replies ?? []).map((r) => r.label ?? '').join(' ')

export default function FinancialView() {
  const { t } = useTranslation()
  const l = useLocalized()
  const navigate = useNavigate()
  const { hash } = useLocation()
  const { status, data } = useGuideCollection('financialInquiries')
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const detailRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => data.filter((q) => matches(haystack(q), deferred)), [data, deferred])
  const groups = useMemo(() => {
    const map = new Map<string, FinancialInquiry[]>()
    filtered.forEach((q) => {
      const key = l(q.group) || t('financial.other')
      map.set(key, [...(map.get(key) ?? []), q])
    })
    return [...map.entries()]
  }, [filtered, l, t])

  const hashId = decodeURIComponent(hash.slice(1))
  const selected = data.find((q) => q.id === hashId) ?? filtered[0] ?? data[0]
  const index = selected ? data.indexOf(selected) : -1

  const select = (id: string, scroll = false) => {
    navigate({ hash: id }, { replace: true, preventScrollReset: true })
    if (scroll && window.matchMedia('(max-width: 1023px)').matches) {
      window.setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }

  // Keep the selected item visible in the list (desktop) / carousel (mobile).
  useEffect(() => {
    if (!selected) return
    listRef.current?.querySelector<HTMLElement>(`[data-inquiry="${selected.id}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [selected])

  // Deep link from search: bring the conversation into view once.
  useEffect(() => {
    if (status === 'ready' && hashId) detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  if (status === 'loading') {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-8 pb-24 sm:px-6 lg:grid-cols-[22rem_1fr]" aria-hidden>
        <div className="h-96 animate-pulse rounded-[1.75rem] bg-white ring-1 ring-line" />
        <div className="h-[32rem] animate-pulse rounded-[1.75rem] bg-white/60" />
      </div>
    )
  }

  if (status === 'error' && data.length === 0) {
    return <p role="alert" className="mx-auto mt-10 max-w-xl rounded-3xl bg-brand-50 p-6 text-center font-semibold text-brand-700">{t('financial.loadError')}</p>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 lg:grid lg:grid-cols-[22rem_1fr] lg:items-start lg:gap-10">
      {/* Inbox */}
      <aside className="lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-card ring-1 ring-line">
          <header className="border-b border-line p-4">
            <div className="flex items-center justify-between gap-3 px-1">
              <p className="font-bold">{t('financial.inbox')}</p>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{t('financial.count', { count: filtered.length })}</span>
            </div>
            <label className="group relative mt-3 block">
              <span className="sr-only">{t('financial.search')}</span>
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute inset-y-0 start-3.5 my-auto size-4 text-ink-300 group-focus-within:text-brand-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('financial.searchPlaceholder')}
                className="w-full rounded-xl bg-cream py-2.5 ps-10 pe-3 text-sm outline-none ring-1 ring-transparent transition placeholder:text-ink-300 focus:bg-white focus:ring-brand-600"
              />
            </label>
          </header>

          <div ref={listRef} className="flex snap-x gap-3 overflow-x-auto p-3 [scrollbar-width:none] lg:block lg:max-h-[calc(100dvh-16rem)] lg:space-y-4 lg:overflow-y-auto lg:overflow-x-visible">
            {groups.length === 0 && <p className="w-full p-6 text-center text-sm text-ink-500">{t('financial.noResults')}</p>}
            {groups.map(([group, items]) => (
              <div key={group} className="contents lg:block">
                <p className="hidden px-2 pb-1.5 text-xs font-semibold text-ink-500 lg:block">{group}</p>
                <ul className="contents lg:block lg:space-y-1">
                  {items.map((q) => {
                    const active = selected?.id === q.id
                    return (
                      <li key={q.id} data-inquiry={q.id} className="w-64 shrink-0 snap-start lg:w-auto">
                        <button
                          type="button"
                          onClick={() => select(q.id, true)}
                          aria-current={active ? 'true' : undefined}
                          className={clsx(
                            'relative flex h-full w-full items-start gap-3 rounded-2xl p-3 text-start ring-1 transition-colors lg:ring-0',
                            active ? 'ring-brand-200' : 'bg-cream ring-line hover:bg-cream lg:bg-transparent',
                          )}
                        >
                          {active && <motion.span layoutId="inbox-active" className="absolute inset-0 rounded-2xl bg-brand-50 ring-1 ring-brand-100" transition={{ type: 'spring', stiffness: 450, damping: 38 }} />}
                          <span className={clsx('relative grid size-10 shrink-0 place-items-center rounded-xl text-lg transition-colors', active ? 'bg-brand-600 shadow-brand' : 'bg-white ring-1 ring-line')}>
                            <span aria-hidden>{q.icon ?? '💬'}</span>
                          </span>
                          <span className="relative min-w-0 flex-1">
                            <span className={clsx('block truncate', active ? 'font-bold text-ink' : 'font-semibold text-ink-700')}>
                              <Highlight text={l(q.title)} query={deferred} />
                            </span>
                            <span className="mt-0.5 line-clamp-2 text-xs leading-5 text-ink-500">{l(q.details)}</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Conversation */}
      <div ref={detailRef} className="mt-8 min-w-0 scroll-mt-32 lg:mt-0">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
              <Conversation
                inquiry={selected}
                index={index}
                total={data.length}
                onPrev={index > 0 ? () => select(data[index - 1].id) : undefined}
                onNext={index < data.length - 1 ? () => select(data[index + 1].id) : undefined}
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <Mascot interactive={false} className="w-28" />
              <p className="mt-6 font-semibold text-ink-500">{t('financial.empty')}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
