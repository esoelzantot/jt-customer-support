import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { LIMITS, priceFor, type Route, type WeightCheck } from './quote.ts'

function useCountUp(target: number) {
  const reduce = useReducedMotion()
  const mv = useMotionValue(target)
  const [shown, setShown] = useState(target)
  useEffect(() => {
    if (reduce) {
      mv.set(target)
      return
    }
    const controls = animate(mv, target, { duration: 0.6, ease: [0.22, 1, 0.36, 1] })
    return () => controls.stop()
  }, [target, reduce, mv])
  useEffect(() => mv.on('change', (v) => setShown(Math.round(v))), [mv])
  return reduce ? target : shown
}

/** Receipt-style result: total, breakdown, delivery days, and a copyable quote for the customer. */
export function QuoteCard({ route, check }: { route: Route; check: WeightCheck }) {
  const { t } = useTranslation()
  const ready = route.status === 'ok'
  const price = ready ? priceFor(route, check.chargeable) : null
  const total = useCountUp(price?.total ?? 0)
  const [copied, setCopied] = useState(false)

  const quoteText =
    route.status === 'ok' && price
      ? t('rates.quote.copyText', {
          from: route.from.ar,
          to: route.to.ar,
          kg: check.chargeable,
          total: price.total,
          days: t('rates.quote.days', { count: route.days }),
        })
      : ''

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(quoteText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white shadow-lift">
      <div aria-hidden className="absolute -end-24 -top-24 size-72 rounded-full bg-brand-600/50 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -start-16 size-72 rounded-full bg-brand-900/40 blur-3xl" />

      <div className="relative p-6 sm:p-7">
        <p className="text-sm font-semibold text-white/70">{t('rates.quote.title')}</p>

        {route.status === 'incomplete' && (
          <div className="py-8 text-center">
            <p className="text-5xl" aria-hidden>🧭</p>
            <p className="mt-3 font-semibold text-white/80">{t('rates.quote.pickRoute')}</p>
          </div>
        )}

        {route.status === 'closed' && (
          <div className="py-8 text-center">
            <p className="text-5xl" aria-hidden>⛔</p>
            <p className="mt-3 text-xl font-bold">{t('rates.closed')}</p>
            <p className="mt-1 text-sm text-white/70">{t('rates.closedBody', { place: route.to.zone === null ? route.to.ar : route.from.ar })}</p>
          </div>
        )}

        {route.status === 'ok' && price && (
          <>
            <div className="mt-3 flex items-end gap-2" aria-live="polite">
              <span className={clsx('text-display text-6xl leading-none sm:text-7xl', !check.allowed && 'opacity-40 line-through decoration-brand-500 decoration-4')} dir="ltr">
                {total}
              </span>
              <span className="mb-2 text-lg font-semibold text-white/80">{t('rates.quote.egp')}</span>
            </div>
            {!check.allowed && <p className="mt-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold">⛔ {t('rates.quote.notAllowed')}</p>}

            {/* Breakdown */}
            <dl className="mt-6 space-y-2.5 border-t border-dashed border-white/20 pt-5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-white/75">{t('rates.quote.firstKilo')}</dt>
                <dd className="text-display" dir="ltr">{price.firstKilo} EGP</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-white/75">{t('rates.quote.extraKilos', { kg: price.extraKg, rate: price.perKg })}</dt>
                <dd className="text-display" dir="ltr">{price.extraAmount} EGP</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-white/15 pt-2.5 font-bold">
                <dt>{t('rates.quote.total', { kg: check.chargeable })}</dt>
                <dd className="text-display text-lg" dir="ltr">{price.total} EGP</dd>
              </div>
            </dl>

            {/* Delivery days */}
            <div className="mt-6 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{t('rates.quote.delivery')}</p>
                <p className="text-display text-2xl" dir="ltr">
                  ~{route.days}
                  <span className="ms-1 text-sm font-semibold text-white/70">{t('rates.quote.daysUnit', { count: route.days })}</span>
                </p>
              </div>
              <ol className="mt-3 flex gap-1.5" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => (
                  <motion.li
                    key={i}
                    initial={false}
                    animate={{ backgroundColor: i < route.days ? 'var(--color-brand-500)' : 'rgb(255 255 255 / 0.12)' }}
                    transition={{ delay: i * 0.06 }}
                    className="h-2 flex-1 rounded-full"
                  />
                ))}
              </ol>
              <p className="mt-2 text-xs text-white/60">{t('rates.quote.daysNote')}</p>
            </div>

            <button
              type="button"
              onClick={copy}
              disabled={!check.allowed}
              className={clsx(
                'mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold transition disabled:opacity-40',
                copied ? 'bg-emerald-500 text-ink' : 'bg-white text-brand-700 hover:bg-brand-50',
              )}
            >
              {copied ? `✓ ${t('tickets.copied')}` : t('rates.quote.copy')}
            </button>
          </>
        )}
      </div>

      <p className="relative border-t border-white/10 px-6 py-3 text-xs text-white/50 sm:px-7">{t('rates.quote.source', { max: LIMITS.maxChargeableKg })}</p>
    </div>
  )
}
