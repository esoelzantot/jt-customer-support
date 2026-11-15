import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { round2, SHIPPING_RULES as R, volumetricKg } from '../rules'

type Packaging = 'box' | 'bag'

function NumberField({ label, unit, value, onChange, max }: { label: string; unit: string; value: string; onChange: (v: string) => void; max?: number }) {
  const id = useId()
  const n = Number(value)
  const over = max !== undefined && n > max
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink-700">{label}</label>
      <div className={clsx('mt-1.5 flex items-center rounded-2xl bg-white ring-1 transition focus-within:ring-2', over ? 'ring-brand-600 focus-within:ring-brand-600' : 'ring-line focus-within:ring-brand-600')}>
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
          className="text-display w-full min-w-0 bg-transparent px-4 py-3 text-xl outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="pe-4 text-sm font-semibold text-ink-500">{unit}</span>
      </div>
    </div>
  )
}

function FormulaRow({ n, label, active, children }: { n: number; label: string; active: boolean; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className={clsx('text-display grid size-6 shrink-0 place-items-center rounded-full text-xs transition-colors', active ? 'bg-brand-600 text-white' : 'bg-white text-ink-300 ring-1 ring-line')} dir="ltr" lang="en">
        {n}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-ink-500">{label}</span>
        <span className={clsx('text-display mt-0.5 block break-words rtl:text-right', active ? 'text-ink' : 'text-ink-300')} dir="ltr" lang="en">
          {children}
        </span>
      </span>
    </li>
  )
}

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={clsx('flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold', ok ? 'bg-emerald-50 text-emerald-800' : 'bg-brand-50 text-brand-800')}>
      <span className={clsx('grid size-5 shrink-0 place-items-center rounded-full text-[0.7rem] text-white', ok ? 'bg-emerald-500' : 'bg-brand-600')}>{ok ? '✓' : '✕'}</span>
      {children}
    </li>
  )
}

export function WeightCalculator() {
  const { t } = useTranslation()
  const [packaging, setPackaging] = useState<Packaging>('box')
  const [dims, setDims] = useState({ l: '', w: '', h: '' })
  const [actual, setActual] = useState('')

  const l = Number(dims.l) || 0
  const w = Number(dims.w) || 0
  const h = Number(dims.h) || 0
  const a = Number(actual) || 0
  const hasDims = l > 0 && w > 0 && h > 0
  const volumetric = hasDims ? volumetricKg(l, w, h) : 0
  const chargeable = round2(Math.max(a, volumetric))
  const basis = volumetric > a ? 'volumetric' : 'actual'
  const sideOk = Math.max(l, w, h) <= R.maxSideCm
  const actualOk = a <= R.maxActualKg
  const volOk = volumetric <= R.maxVolumetricKg
  const anyInput = hasDims || a > 0
  const allOk = sideOk && actualOk && volOk

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-card ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
        <p className="text-lg font-bold">{t('newOrder.calc.title')}</p>
        <div role="radiogroup" aria-label={t('newOrder.calc.packaging')} className="flex rounded-full bg-cream p-1">
          {(['box', 'bag'] as const).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={packaging === p}
              onClick={() => setPackaging(p)}
              className={clsx('relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors', packaging === p ? 'text-white' : 'text-ink-500 hover:text-ink')}
            >
              {packaging === p && <motion.span layoutId="packaging" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 450, damping: 36 }} />}
              <span className="relative">{p === 'box' ? `📦 ${t('newOrder.calc.box')}` : `👜 ${t('newOrder.calc.bag')}`}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[1fr_17rem] sm:p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-ink-500">{packaging === 'box' ? t('newOrder.calc.dimsHintBox') : t('newOrder.calc.dimsHintBag')}</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <NumberField label={t('newOrder.calc.length')} unit="cm" value={dims.l} max={R.maxSideCm} onChange={(v) => setDims({ ...dims, l: v })} />
              <NumberField label={t('newOrder.calc.width')} unit="cm" value={dims.w} max={R.maxSideCm} onChange={(v) => setDims({ ...dims, w: v })} />
              <NumberField label={t('newOrder.calc.height')} unit="cm" value={dims.h} max={R.maxSideCm} onChange={(v) => setDims({ ...dims, h: v })} />
            </div>
          </div>
          <NumberField label={t('newOrder.calc.actual')} unit="kg" value={actual} max={R.maxActualKg} onChange={setActual} />
        </div>

        {/* How it was calculated: the same steps the agent can read out to the customer */}
        <div className="rounded-2xl bg-cream p-4">
          <p className="text-sm font-bold">{t('newOrder.calc.howTitle')}</p>
          <ol className="mt-3 space-y-2.5 text-sm">
            <FormulaRow n={1} label={t('newOrder.calc.howVolume')} active={hasDims}>
              {hasDims ? `${l} × ${w} × ${h} = ${round2(l * w * h).toLocaleString('en')} cm³` : 'L × W × H'}
            </FormulaRow>
            <FormulaRow n={2} label={t('newOrder.calc.howDivide', { d: R.volumetricDivisor })} active={hasDims}>
              {hasDims ? `÷ ${R.volumetricDivisor} = ${volumetric} kg` : `÷ ${R.volumetricDivisor}`}
            </FormulaRow>
            <FormulaRow n={3} label={t('newOrder.calc.howCompare')} active={anyInput}>
              {anyInput ? `max(${volumetric}, ${a}) = ${chargeable} kg` : 'max( , )'}
            </FormulaRow>
          </ol>
          <AnimatePresence>
            {anyInput && (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl bg-white px-3 py-2 text-xs leading-5 text-ink-700 ring-1 ring-line">
                {t(`newOrder.calc.explain.${basis}`, { v: volumetric, a, c: chargeable })}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-4 border-t border-line bg-cream/60 p-5 sm:grid-cols-3 sm:p-6">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-line">
          <p className="text-sm text-ink-500">{t('newOrder.calc.volumetric')}</p>
          <p className="text-display mt-1 text-3xl" dir="ltr">{volumetric || '–'}<span className="ms-1 text-base text-ink-500">kg</span></p>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-line">
          <p className="text-sm text-ink-500">{t('newOrder.calc.actualShort')}</p>
          <p className="text-display mt-1 text-3xl" dir="ltr">{a || '–'}<span className="ms-1 text-base text-ink-500">kg</span></p>
        </div>
        <motion.div key={chargeable} initial={{ scale: 0.96 }} animate={{ scale: 1 }} className="relative overflow-hidden rounded-2xl bg-brand-600 p-4 text-white shadow-brand">
          <span aria-hidden className="bg-speed-lines absolute inset-0" />
          <p className="relative text-sm text-white/85">{t('newOrder.calc.chargeable')}</p>
          <p className="text-display relative mt-1 text-3xl" dir="ltr">{chargeable || '–'}<span className="ms-1 text-base text-white/80">kg</span></p>
          {anyInput && <p className="relative mt-1 text-xs text-white/85">{t(`newOrder.calc.basis.${basis}`)}</p>}
        </motion.div>
      </div>

      {anyInput && (
        <div className="border-t border-line p-5 sm:p-6">
          <ul className="grid gap-2 sm:grid-cols-3">
            <Check ok={sideOk}>{t('newOrder.calc.ruleSide', { max: R.maxSideCm })}</Check>
            <Check ok={actualOk}>{t('newOrder.calc.ruleActual', { max: R.maxActualKg })}</Check>
            <Check ok={volOk}>{t('newOrder.calc.ruleVolumetric', { max: R.maxVolumetricKg })}</Check>
          </ul>
          <p role="status" className={clsx('mt-3 text-sm font-semibold', allOk ? 'text-emerald-700' : 'text-brand-700')}>
            {allOk ? t('newOrder.calc.ok') : t('newOrder.calc.notOk')}
          </p>
        </div>
      )}
    </div>
  )
}
