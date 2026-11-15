import { useId, useState } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { compensation, SHIPPING_RULES as R } from '../rules'

function Meter({ label, value, cap, rule, tone }: { label: string; value: number; cap: number; rule: string; tone: 'amber' | 'brand' }) {
  const pct = cap ? Math.min(value / cap, 1) : 0
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-line">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-semibold">{label}</p>
        <p className="text-display text-2xl" dir="ltr">
          {value}
          <span className="ms-1 text-sm text-ink-500">EGP</span>
        </p>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-cream">
        <motion.div
          className={tone === 'brand' ? 'h-full rounded-full bg-brand-600' : 'h-full rounded-full bg-amber-500'}
          initial={false}
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <p className="mt-2 text-xs text-ink-500">{rule}</p>
    </div>
  )
}

export function CompensationCalculator() {
  const { t } = useTranslation()
  const feeId = useId()
  const valueId = useId()
  const [fee, setFee] = useState('')
  const [value, setValue] = useState('')
  const f = Number(fee) || 0
  const v = Number(value) || 0
  const damaged = compensation(f, 'damage', v)
  const lost = compensation(f, 'lost', v)

  return (
    <div className="rounded-[1.75rem] bg-cream p-5 ring-1 ring-line sm:p-6">
      <p className="text-lg font-bold">{t('newOrder.comp.title')}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={feeId} className="text-sm font-semibold text-ink-700">{t('newOrder.comp.fee')}</label>
          <input id={feeId} type="number" inputMode="decimal" min={0} value={fee} onChange={(e) => setFee(e.target.value)} placeholder="0" dir="ltr" className="field text-display mt-1.5 text-xl" />
        </div>
        <div>
          <label htmlFor={valueId} className="text-sm font-semibold text-ink-700">{t('newOrder.comp.value')}</label>
          <input id={valueId} type="number" inputMode="decimal" min={0} value={value} onChange={(e) => setValue(e.target.value)} placeholder={t('newOrder.comp.optional')} dir="ltr" className="field text-display mt-1.5 text-xl" />
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Meter label={`🧩 ${t('newOrder.comp.damaged')}`} value={damaged} cap={R.damage.capEgp} tone="amber" rule={t('newOrder.comp.damagedRule', { x: R.damage.multiplier, cap: R.damage.capEgp, days: R.claimDays.damaged })} />
        <Meter label={`🔍 ${t('newOrder.comp.lost')}`} value={lost} cap={R.lost.capEgp} tone="brand" rule={t('newOrder.comp.lostRule', { x: R.lost.multiplier, cap: R.lost.capEgp, days: R.claimDays.lost })} />
      </div>
    </div>
  )
}
