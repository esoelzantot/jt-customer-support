import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import type { Route } from './quote.ts'
import { byId } from './quote.ts'
import { GovernoratePicker } from './GovernoratePicker.tsx'
import { CLOSED_STYLE, ZONE_STYLE } from './zoneStyle.ts'

type Props = {
  from: string | null
  to: string | null
  route: Route
  onChange: (next: { from: string | null; to: string | null }) => void
}

function Station({ role, id, onOpen }: { role: 'from' | 'to'; id: string | null; onOpen: () => void }) {
  const { t } = useTranslation()
  const g = id ? byId.get(id) : undefined
  const s = g ? (g.zone ? ZONE_STYLE[g.zone] : CLOSED_STYLE) : null
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'group relative flex min-h-32 w-full flex-col items-start justify-between overflow-hidden rounded-[1.75rem] p-5 text-start ring-1 transition-shadow',
        g ? 'bg-white shadow-card ring-line hover:shadow-lift' : 'border-2 border-dashed border-brand-200 bg-brand-50/40 ring-transparent hover:bg-brand-50',
      )}
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink-500">
          <span className={clsx('grid size-7 place-items-center rounded-full text-xs font-bold', role === 'from' ? 'bg-ink text-white' : 'bg-brand-600 text-white')}>
            {role === 'from' ? '↑' : '↓'}
          </span>
          {t(role === 'from' ? 'rates.from' : 'rates.to')}
        </span>
        {g && s && <span className={clsx('rounded-full px-2.5 py-1 text-xs font-bold', s.chip)}>{g.zone ? t('rates.zoneN', { n: g.zone }) : t('rates.noZone')}</span>}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={id ?? 'empty'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-3 block">
          {g ? (
            <>
              <span className="block text-2xl font-bold sm:text-3xl">{g.ar}</span>
              <span className="text-sm text-ink-500" dir="ltr">{g.id}</span>
            </>
          ) : (
            <span className="text-lg font-semibold text-brand-700">{t('rates.choose')}</span>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

/** Origin → destination with a swap button and an animated route line showing the zone pair and days. */
export function RouteBuilder({ from, to, route, onChange }: Props) {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const [picking, setPicking] = useState<'from' | 'to' | null>(null)
  const [spin, setSpin] = useState(0)

  const swap = () => {
    setSpin((s) => s + 180)
    onChange({ from: to, to: from })
  }

  const pick = (id: string) => {
    if (picking === 'from') onChange({ from: id, to })
    if (picking === 'to') onChange({ from, to: id })
    // After choosing the origin, go straight to the destination if it's still empty.
    setPicking(picking === 'from' && !to ? 'to' : null)
  }

  return (
    <div className="relative">
      <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
        <Station role="from" id={from} onOpen={() => setPicking('from')} />

        {/* Connector */}
        <div className="relative flex items-center justify-center md:w-44">
          <svg aria-hidden viewBox="0 0 176 40" className="absolute inset-x-0 top-1/2 hidden h-10 w-full -translate-y-1/2 md:block rtl:-scale-x-100">
            <path d="M4 20 H172" fill="none" stroke="var(--color-line)" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
            {route.status === 'ok' && !reduce && (
              <motion.circle r="5" cy="20" fill="var(--color-brand-600)" initial={{ cx: 4 }} animate={{ cx: [4, 172] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
            )}
          </svg>
          <motion.button
            type="button"
            onClick={swap}
            disabled={!from && !to}
            aria-label={t('rates.swap')}
            animate={{ rotate: spin }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="relative z-10 grid size-12 place-items-center rounded-full bg-ink text-white shadow-lift transition hover:bg-brand-600 disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="size-5 rotate-90 md:rotate-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
            </svg>
          </motion.button>
        </div>

        <Station role="to" id={to} onOpen={() => setPicking('to')} />
      </div>

      {/* Route summary */}
      <AnimatePresence>
        {route.status !== 'incomplete' && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            {route.status === 'ok' ? (
              <>
                <span className={clsx('rounded-full px-3 py-1 font-bold', ZONE_STYLE[route.fromZone].chip)}>{t('rates.zoneN', { n: route.fromZone })}</span>
                <span aria-hidden className="text-ink-300 rtl:-scale-x-100">→</span>
                <span className={clsx('rounded-full px-3 py-1 font-bold', route.toZone === 'same' ? 'bg-ink text-white' : ZONE_STYLE[route.toZone].chip)}>
                  {route.toZone === 'same' ? t('rates.sameZone') : t('rates.zoneN', { n: route.toZone })}
                </span>
                {route.toZone === 'same' && <span className="text-ink-500">· {t('rates.sameZoneHint')}</span>}
              </>
            ) : (
              <span className="rounded-full bg-ink px-3 py-1 font-semibold text-white">⛔ {t('rates.closedRoute')}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <GovernoratePicker open={picking !== null} role={picking ?? 'from'} value={picking === 'from' ? from : to} other={picking === 'from' ? to : from} onPick={pick} onClose={() => setPicking(null)} />
    </div>
  )
}
