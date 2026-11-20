import { useMemo } from 'react'
import { motion } from 'motion/react'
import { Link, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import rabbitUrl from '@/assets/brand/mascot-rabbit.png'
import { CalculatorIcon } from '@/components/icons/GuideIcons'
import { ParcelCalculator, type ParcelValues } from './ParcelCalculator.tsx'
import { QuoteCard } from './QuoteCard.tsx'
import { checkWeight, routeFor } from './quote.ts'
import { GOVERNORATES, ORIGIN_IDS, type ToZone, type ZoneId } from './rateTable.ts'
import { RatesReference } from './RatesReference.tsx'
import { RouteBuilder } from './RouteBuilder.tsx'

const num = (v: string | null) => v ?? ''

/** Pick a representative governorate pair for a zone pair (used when clicking the price matrix). */
function exampleRoute(from: ZoneId, to: ToZone) {
  const inZone = (z: ZoneId) => GOVERNORATES.filter((g) => g.zone === z && ORIGIN_IDS.includes(g.id))
  const origin = inZone(from)[0]
  if (to === 'same') return { from: origin.id, to: origin.id }
  const dest = inZone(to).find((g) => g.id !== origin.id) ?? inZone(to)[0]
  return { from: origin.id, to: dest.id }
}

export function RatesPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const from = params.get('from')
  const to = params.get('to')
  const parcel: ParcelValues = { l: num(params.get('l')), w: num(params.get('w')), h: num(params.get('h')), actual: num(params.get('kg')) }

  const update = (patch: Record<string, string | null>) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
        return next
      },
      { replace: true, preventScrollReset: true },
    )

  const route = useMemo(() => routeFor(from, to), [from, to])
  const check = useMemo(
    () => checkWeight({ actualKg: Number(parcel.actual), lengthCm: Number(parcel.l), widthCm: Number(parcel.w), heightCm: Number(parcel.h) }),
    [parcel.actual, parcel.l, parcel.w, parcel.h],
  )

  return (
    <>
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.25rem] bg-brand-600 text-white shadow-brand"
        >
          <div aria-hidden className="bg-speed-lines absolute inset-0" />
          <div className="relative flex items-center gap-5 px-6 py-9 sm:px-10 sm:py-12 md:pe-56">
            <span className="hidden size-20 shrink-0 place-items-center rounded-2xl bg-white text-brand-600 shadow-lg sm:grid">
              <CalculatorIcon className="size-10" />
            </span>
            <div className="min-w-0">
              <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-white/75">
                <Link to="/" className="hover:text-white hover:underline">{t('nav.home')}</Link>
                <span aria-hidden>/</span>
                <span className="text-white">{t('rates.title')}</span>
              </nav>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">{t('rates.title')}</h1>
              <p className="mt-3 max-w-2xl leading-7 text-white/85">{t('rates.description')}</p>
            </div>
          </div>
          <motion.img
            src={rabbitUrl}
            alt=""
            aria-hidden
            draggable={false}
            initial={{ y: '75%', rotate: 10 }}
            animate={{ y: '30%', rotate: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 12, delay: 0.35 }}
            whileHover={{ y: '12%', rotate: -5 }}
            className="absolute bottom-0 end-10 hidden w-40 drop-shadow-2xl md:block lg:end-14 lg:w-44"
          />
        </motion.header>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-4 pt-8 pb-24 sm:px-6">
        {/* 1. Route */}
        <section aria-labelledby="route-title">
          <h2 id="route-title" className="mb-4 flex items-center gap-2 text-lg font-bold">
            <span className="text-display grid size-7 place-items-center rounded-full bg-ink text-sm text-white" dir="ltr">1</span>
            {t('rates.step1')}
          </h2>
          <RouteBuilder from={from} to={to} route={route} onChange={(r) => update({ from: r.from, to: r.to })} />
        </section>

        {/* 2. Parcel + quote */}
        <section aria-labelledby="parcel-title" className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-start">
          <div>
            <h2 id="parcel-title" className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="text-display grid size-7 place-items-center rounded-full bg-ink text-sm text-white" dir="ltr">2</span>
              {t('rates.step2')}
            </h2>
            <ParcelCalculator values={parcel} check={check} onChange={(v) => update({ l: v.l, w: v.w, h: v.h, kg: v.actual })} />
          </div>
          <div className="lg:sticky lg:top-24">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="text-display grid size-7 place-items-center rounded-full bg-brand-600 text-sm text-white" dir="ltr">3</span>
              {t('rates.step3')}
            </h2>
            <QuoteCard route={route} check={check} />
          </div>
        </section>

        {/* Reference */}
        <section aria-labelledby="ref-title">
          <h2 id="ref-title" className="mb-4 text-lg font-bold">{t('rates.ref.title')}</h2>
          <RatesReference route={route} onPickZoneExample={(f, z) => update(exampleRoute(f, z))} />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {(['n1', 'n2', 'n3', 'n4'] as const).map((k) => (
              <li key={k} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-line">
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">!</span>
                <p className="leading-7 text-ink-700">{t(`rates.notes.${k}`)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
