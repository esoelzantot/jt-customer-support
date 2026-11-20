import { useId } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { LIMITS, type WeightCheck } from './quote.ts'

export type ParcelValues = { l: string; w: string; h: string; actual: string }

function Field({ label, unit, value, onChange, over, step = 1 }: { label: string; unit: string; value: string; onChange: (v: string) => void; over?: boolean; step?: number }) {
  const id = useId()
  const n = Number(value) || 0
  const bump = (d: number) => onChange(String(Math.max(0, Math.round((n + d) * 10) / 10)))
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink-700">{label}</label>
      <div className={clsx('mt-1.5 flex items-center rounded-2xl bg-white ring-1 transition focus-within:ring-2', over ? 'ring-2 ring-brand-600' : 'ring-line focus-within:ring-brand-600')}>
        <button type="button" onClick={() => bump(-step)} aria-label={`- ${label}`} className="grid size-11 shrink-0 place-items-center rounded-s-2xl text-lg font-bold text-ink-500 hover:bg-cream hover:text-ink">−</button>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          dir="ltr"
          className="text-display w-full min-w-0 bg-transparent text-center text-xl outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="shrink-0 text-xs font-semibold text-ink-500">{unit}</span>
        <button type="button" onClick={() => bump(step)} aria-label={`+ ${label}`} className="grid size-11 shrink-0 place-items-center rounded-e-2xl text-lg font-bold text-ink-500 hover:bg-cream hover:text-ink">+</button>
      </div>
    </div>
  )
}

/** Horizontal scale 0–50 kg: actual & volumetric bars, the chargeable marker, and the two limits. */
function WeightScale({ check }: { check: WeightCheck }) {
  const { t } = useTranslation()
  const max = LIMITS.maxChargeableKg
  const pct = (v: number) => `${Math.min(v / max, 1) * 100}%`
  return (
    <div className="mt-6" aria-hidden>
      <div className="relative h-14 rounded-2xl bg-cream">
        <motion.div className="absolute inset-y-2 start-0 rounded-xl bg-ink/80" initial={false} animate={{ width: pct(check.actual) }} transition={{ type: 'spring', stiffness: 140, damping: 22 }} />
        <motion.div className="absolute inset-y-6 start-0 rounded-full bg-brand-600/80" initial={false} animate={{ width: pct(check.volumetric) }} transition={{ type: 'spring', stiffness: 140, damping: 22 }} />
        {/* limits */}
        {[LIMITS.maxActualKg, LIMITS.maxVolumetricKg].map((v) => (
          <span key={v} className="absolute inset-y-0 w-px bg-ink/30" style={{ insetInlineStart: pct(v) }}>
            <span className="text-display absolute -top-5 -translate-x-1/2 text-[0.65rem] text-ink-500 rtl:translate-x-1/2" dir="ltr">{v}kg</span>
          </span>
        ))}
        {/* chargeable marker */}
        <span
          className="absolute -bottom-1 h-16 w-1 rounded-full bg-brand-600 shadow-brand transition-[inset-inline-start] duration-500 ease-[var(--ease-out-expo)]"
          style={{ insetInlineStart: pct(check.chargeable) }}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
        <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-ink/80" />{t('rates.calc.actual')}</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-4 rounded-full bg-brand-600/80" />{t('rates.calc.volumetric')}</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-1 rounded-full bg-brand-600" />{t('rates.calc.chargeable')}</span>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight, sub }: { label: string; value: number | string; highlight?: boolean; sub?: string }) {
  return (
    <div className={clsx('relative overflow-hidden rounded-2xl p-4', highlight ? 'bg-brand-600 text-white shadow-brand' : 'bg-white ring-1 ring-line')}>
      {highlight && <span aria-hidden className="bg-speed-lines absolute inset-0" />}
      <p className={clsx('relative text-sm', highlight ? 'text-white/85' : 'text-ink-500')}>{label}</p>
      <motion.p key={String(value)} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-display relative mt-1 text-3xl" dir="ltr">
        {value}
        <span className={clsx('ms-1 text-base', highlight ? 'text-white/80' : 'text-ink-500')}>kg</span>
      </motion.p>
      {sub && <p className={clsx('relative mt-1 text-xs', highlight ? 'text-white/85' : 'text-ink-500')}>{sub}</p>}
    </div>
  )
}

function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={clsx('flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold', ok ? 'bg-emerald-50 text-emerald-800' : 'bg-brand-50 text-brand-800')}>
      <span className={clsx('grid size-5 shrink-0 place-items-center rounded-full text-[0.7rem] text-white', ok ? 'bg-emerald-500' : 'bg-brand-600')}>{ok ? '✓' : '✕'}</span>
      {children}
    </li>
  )
}

export function ParcelCalculator({ values, onChange, check }: { values: ParcelValues; onChange: (v: ParcelValues) => void; check: WeightCheck }) {
  const { t } = useTranslation()
  const anyInput = check.actual > 0 || check.hasDims
  const v = check.violations

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-card ring-1 ring-line sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xl font-bold">{t('rates.calc.title')}</p>
          <p className="mt-1 text-sm text-ink-500">{t('rates.calc.hint')}</p>
        </div>
        {anyInput && (
          <button type="button" onClick={() => onChange({ l: '', w: '', h: '', actual: '' })} className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink-500 hover:bg-cream hover:text-ink">
            {t('rates.calc.reset')}
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Field label={t('newOrder.calc.length')} unit="cm" value={values.l} over={v.side && Number(values.l) > LIMITS.maxSideCm} onChange={(l) => onChange({ ...values, l })} step={5} />
        <Field label={t('newOrder.calc.width')} unit="cm" value={values.w} over={v.side && Number(values.w) > LIMITS.maxSideCm} onChange={(w) => onChange({ ...values, w })} step={5} />
        <Field label={t('newOrder.calc.height')} unit="cm" value={values.h} over={v.side && Number(values.h) > LIMITS.maxSideCm} onChange={(h) => onChange({ ...values, h })} step={5} />
      </div>
      <div className="mt-3 sm:max-w-xs">
        <Field label={t('newOrder.calc.actual')} unit="kg" value={values.actual} over={v.actual} onChange={(actual) => onChange({ ...values, actual })} step={0.5} />
      </div>

      <WeightScale check={check} />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label={t('rates.calc.actual')} value={check.actual || '–'} />
        <Stat label={t('rates.calc.volumetric')} value={check.volumetric || '–'} sub={check.hasDims ? `÷ ${LIMITS.volumetricDivisor}` : t('rates.calc.noDims')} />
        <Stat
          label={t('rates.calc.chargeable')}
          value={check.chargeable}
          highlight
          sub={anyInput ? t('rates.calc.roundedFrom', { v: check.heavier, basis: t(`rates.calc.basis.${check.basis}`) }) : t('rates.calc.minimum')}
        />
      </div>

      {anyInput && (
        <>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            <Rule ok={!v.side}>{t('rates.calc.ruleSide', { max: LIMITS.maxSideCm })}</Rule>
            <Rule ok={!v.actual}>{t('rates.calc.ruleActual', { max: LIMITS.maxActualKg })}</Rule>
            <Rule ok={!v.volumetric}>{t('rates.calc.ruleVolumetric', { max: LIMITS.maxVolumetricKg })}</Rule>
            <Rule ok={!v.chargeable}>{t('rates.calc.ruleChargeable', { max: LIMITS.maxChargeableKg })}</Rule>
          </ul>
          <motion.p
            key={String(check.allowed)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className={clsx('mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 font-bold', check.allowed ? 'bg-emerald-500 text-ink' : 'bg-brand-600 text-white')}
          >
            <span aria-hidden className="text-xl">{check.allowed ? '✅' : '⛔'}</span>
            {check.allowed ? t('rates.calc.allowed') : t('rates.calc.notAllowed')}
          </motion.p>
        </>
      )}
    </div>
  )
}
