import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { normalizeSearch } from '@/features/guides/search'
import { GOVERNORATES, ORIGIN_IDS, type ZoneId } from './rateTable.ts'
import { CLOSED_STYLE, ZONE_STYLE } from './zoneStyle.ts'

type Props = {
  open: boolean
  role: 'from' | 'to'
  value: string | null
  /** The other end of the route, to mark "same governorate". */
  other: string | null
  onPick: (id: string) => void
  onClose: () => void
}

const ZONES: (ZoneId | null)[] = [1, 2, 3, 4, null]

/** Bottom sheet (mobile) / centered dialog (desktop) to pick a governorate, grouped and colored by zone. */
export function GovernoratePicker(props: Props) {
  // Keyed by role so search/filter reset when it jumps from "from" to "to".
  return <AnimatePresence mode="wait">{props.open && <Sheet key={props.role} {...props} />}</AnimatePresence>
}

function Sheet({ role, value, other, onPick, onClose }: Props) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [zone, setZone] = useState<ZoneId | null | 'all'>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const list = useMemo(() => {
    const q = normalizeSearch(query)
    return GOVERNORATES.filter((g) => (zone === 'all' ? true : g.zone === zone)).filter(
      (g) => !q || normalizeSearch(`${g.ar} ${g.id}`).includes(q),
    )
  }, [query, zone])

  const pickFirst = () => list[0] && onPick(list[0].id)

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={t(role === 'from' ? 'rates.pickFrom' : 'rates.pickTo')}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        className="relative flex max-h-[88dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[2rem] bg-cream shadow-2xl sm:rounded-[2rem]"
      >
        <header className="border-b border-line bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-bold">{t(role === 'from' ? 'rates.pickFrom' : 'rates.pickTo')}</p>
            <button type="button" onClick={onClose} aria-label={t('admin.cancel')} className="grid size-9 place-items-center rounded-full text-xl text-ink-500 hover:bg-cream">
              ×
            </button>
          </div>
          <label className="group relative mt-4 block">
            <span className="sr-only">{t('rates.searchGov')}</span>
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute inset-y-0 start-4 my-auto size-5 text-ink-300 group-focus-within:text-brand-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && pickFirst()}
              placeholder={t('rates.searchGovPlaceholder')}
              className="w-full rounded-2xl bg-cream py-3 ps-12 pe-4 outline-none ring-1 ring-line transition focus:bg-white focus:ring-2 focus:ring-brand-600"
            />
          </label>
          <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 [scrollbar-width:none]" role="tablist">
            {(['all', ...ZONES] as const).map((z) => {
              const active = zone === z
              const s = z === 'all' ? null : z === null ? CLOSED_STYLE : ZONE_STYLE[z]
              return (
                <button
                  key={String(z)}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setZone(z)}
                  className={clsx(
                    'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition',
                    active ? (s ? s.solid : 'bg-ink text-white') : 'bg-cream text-ink-700 hover:bg-white',
                  )}
                >
                  {s && <span className={clsx('size-2 rounded-full', active ? 'bg-white/80' : s.dot)} />}
                  {z === 'all' ? t('tickets.all') : z === null ? t('rates.noZone') : t('rates.zoneN', { n: z })}
                </button>
              )
            })}
          </div>
        </header>

        <div className="overflow-y-auto p-5">
          {ZONES.map((z) => {
            const items = list.filter((g) => g.zone === z)
            if (!items.length) return null
            const s = z === null ? CLOSED_STYLE : ZONE_STYLE[z]
            return (
              <section key={String(z)} className="mb-5 last:mb-0">
                <p className={clsx('mb-2 flex items-center gap-2 text-sm font-bold', s.text)}>
                  <span className={clsx('size-2.5 rounded-full', s.dot)} />
                  {z === null ? t('rates.noZone') : t('rates.zoneN', { n: z })}
                </p>
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {items.map((g) => {
                    const selected = g.id === value
                    const noOrigin = role === 'from' && !ORIGIN_IDS.includes(g.id)
                    return (
                      <li key={g.id}>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => onPick(g.id)}
                          aria-pressed={selected}
                          className={clsx(
                            'flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-start ring-1 transition',
                            selected ? clsx(s.solid, 'ring-transparent shadow-card') : 'bg-white ring-line hover:ring-brand-200',
                          )}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold">{g.ar}</span>
                            <span className={clsx('block truncate text-xs', selected ? 'opacity-80' : 'text-ink-500')} dir="ltr">
                              {g.id}
                            </span>
                          </span>
                          {(noOrigin || g.zone === null) && <span className="shrink-0 text-xs" title={t('rates.closed')}>⛔</span>}
                          {g.id === other && <span className="shrink-0 rounded-full bg-ink/10 px-1.5 py-0.5 text-[0.65rem] font-semibold">{t('rates.sameGov')}</span>}
                        </motion.button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
          {list.length === 0 && <p className="py-10 text-center text-ink-500">{t('rates.noGov')}</p>}
        </div>
      </motion.div>
    </div>
  )
}
