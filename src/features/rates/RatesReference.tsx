import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import type { Route } from './quote.ts'
import { ADDITIONAL_KILO, FIRST_KILO, GOVERNORATES, type ToZone, type ZoneId } from './rateTable.ts'
import { CLOSED_STYLE, ZONE_STYLE } from './zoneStyle.ts'

const FROM: ZoneId[] = [1, 2, 3, 4]
const TO: ToZone[] = ['same', 1, 2, 3, 4]
const MIN = 94
const MAX = 225

/** Price matrix (first kilo + per extra kilo) with the current route highlighted, and the zone map as lists. */
export function RatesReference({ route, onPickZoneExample }: { route: Route; onPickZoneExample?: (from: ZoneId, to: ToZone) => void }) {
  const { t } = useTranslation()
  const active = route.status === 'ok' ? { from: route.fromZone, to: route.toZone } : null

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      {/* Matrix */}
      <section className="rounded-[2rem] bg-white p-5 shadow-card ring-1 ring-line sm:p-6">
        <p className="text-lg font-bold">{t('rates.ref.matrixTitle')}</p>
        <p className="mt-1 text-sm text-ink-500">{t('rates.ref.matrixHint')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-separate border-spacing-1.5 text-center">
            <thead>
              <tr>
                <th className="text-xs font-semibold text-ink-500">
                  {t('rates.from')} \ {t('rates.to')}
                </th>
                {TO.map((z) => (
                  <th key={String(z)} scope="col" className="text-xs font-bold text-ink-700">
                    {z === 'same' ? t('rates.sameZone') : t('rates.zoneN', { n: z })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FROM.map((f) => (
                <tr key={f}>
                  <th scope="row" className={clsx('rounded-xl px-2 text-xs font-bold', ZONE_STYLE[f].chip)}>
                    {t('rates.zoneN', { n: f })}
                  </th>
                  {TO.map((z) => {
                    const first = FIRST_KILO[f][z]
                    const isActive = active?.from === f && active?.to === z
                    // Heat: cheaper routes lighter, expensive ones deeper red.
                    const heat = (first - MIN) / (MAX - MIN)
                    return (
                      <td key={String(z)} className="p-0">
                        <motion.button
                          type="button"
                          onClick={() => onPickZoneExample?.(f, z)}
                          whileHover={{ scale: 1.05 }}
                          className={clsx('relative w-full rounded-xl px-1 py-2.5 transition', isActive ? 'ring-4 ring-ink' : 'ring-0')}
                          style={{ backgroundColor: `color-mix(in oklab, var(--color-brand-600) ${8 + heat * 62}%, white)`, color: heat > 0.55 ? '#fff' : 'var(--color-ink)' }}
                          aria-pressed={isActive}
                          aria-label={`${t('rates.zoneN', { n: f })} → ${z === 'same' ? t('rates.sameZone') : t('rates.zoneN', { n: z })}: ${first} EGP + ${ADDITIONAL_KILO[f][z]}/kg`}
                        >
                          <span className="text-display block text-base" dir="ltr">{first}</span>
                          <span className="block text-[0.65rem] opacity-80" dir="ltr">+{ADDITIONAL_KILO[f][z]}/kg</span>
                          {isActive && <motion.span layoutId="matrix-active" className="absolute -top-2 start-1/2 size-3 -translate-x-1/2 rounded-full bg-ink rtl:translate-x-1/2" />}
                        </motion.button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-500">{t('rates.ref.sameZoneDef')}</p>
      </section>

      {/* Zones */}
      <section className="rounded-[2rem] bg-white p-5 shadow-card ring-1 ring-line sm:p-6">
        <p className="text-lg font-bold">{t('rates.ref.zonesTitle')}</p>
        <ul className="mt-4 space-y-3">
          {([1, 2, 3, 4, null] as (ZoneId | null)[]).map((z) => {
            const s = z === null ? CLOSED_STYLE : ZONE_STYLE[z]
            const govs = GOVERNORATES.filter((g) => g.zone === z)
            const highlighted = route.status !== 'incomplete' && (route.from.zone === z || route.to.zone === z)
            return (
              <li key={String(z)} className={clsx('rounded-2xl p-3 ring-1 transition', highlighted ? clsx('bg-white ring-2', s.ring) : 'bg-cream ring-transparent')}>
                <p className={clsx('flex items-center gap-2 text-sm font-bold', s.text)}>
                  <span className={clsx('size-2.5 rounded-full', s.dot)} />
                  {z === null ? t('rates.noZone') : t('rates.zoneN', { n: z })}
                  <span className="text-xs font-semibold text-ink-500">· {govs.length}</span>
                </p>
                <p className="mt-1.5 flex flex-wrap gap-1">
                  {govs.map((g) => {
                    const on = route.status !== 'incomplete' && (route.from.id === g.id || route.to.id === g.id)
                    return (
                      <span key={g.id} className={clsx('rounded-full px-2 py-0.5 text-xs font-semibold', on ? s.solid : 'bg-white text-ink-700 ring-1 ring-line')}>
                        {g.ar}
                      </span>
                    )
                  })}
                </p>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
