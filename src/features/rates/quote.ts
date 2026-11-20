import { ADDITIONAL_KILO, DELIVERY_DAYS, FIRST_KILO, GOVERNORATES, type Governorate, type ToZone, type ZoneId } from './rateTable.ts'

/** Limits from the sheet's notes (A18:A21). */
export const LIMITS = {
  maxActualKg: 30,
  maxVolumetricKg: 50,
  maxSideCm: 100,
  volumetricDivisor: 5000,
  /** "Additional Kilo up to 49 KG" → 1st kilo + 49. */
  maxChargeableKg: 50,
} as const

export const byId = new Map(GOVERNORATES.map((g) => [g.id, g]))

/* ---------- Route ---------- */

export type Route =
  | { status: 'incomplete' }
  | { status: 'closed'; from: Governorate; to: Governorate }
  | { status: 'ok'; from: Governorate; to: Governorate; fromZone: ZoneId; toZone: ToZone; firstKilo: number; perKg: number; days: number }

/**
 * Zone pair + prices + delivery days for two governorates.
 * Same governorate → "Same Zone" (the sheet: same governorate, doesn't pass through the HUB).
 */
export function routeFor(fromId?: string | null, toId?: string | null): Route {
  const from = fromId ? byId.get(fromId) : undefined
  const to = toId ? byId.get(toId) : undefined
  if (!from || !to) return { status: 'incomplete' }
  const days = DELIVERY_DAYS[from.id]?.[to.id]
  if (from.zone === null || to.zone === null || days === undefined || days === 'closed') return { status: 'closed', from, to }
  const toZone: ToZone = from.id === to.id ? 'same' : to.zone
  return {
    status: 'ok',
    from,
    to,
    fromZone: from.zone,
    toZone,
    firstKilo: FIRST_KILO[from.zone][toZone],
    perKg: ADDITIONAL_KILO[from.zone][toZone],
    days,
  }
}

/* ---------- Weight ---------- */

export type WeightInput = { actualKg?: number; lengthCm?: number; widthCm?: number; heightCm?: number }

export type WeightCheck = {
  actual: number
  volumetric: number
  /** max(actual, volumetric) before rounding */
  heavier: number
  /** Rounded UP to a whole kilo, minimum 1 (the sheet's 1st kilo). */
  chargeable: number
  basis: 'actual' | 'volumetric'
  hasDims: boolean
  violations: { side: boolean; actual: boolean; volumetric: boolean; chargeable: boolean }
  allowed: boolean
}

const round2 = (n: number) => Math.round(n * 100) / 100
const pos = (n?: number) => (n && Number.isFinite(n) && n > 0 ? n : 0)

export function checkWeight({ actualKg, lengthCm, widthCm, heightCm }: WeightInput): WeightCheck {
  const [a, l, w, h] = [pos(actualKg), pos(lengthCm), pos(widthCm), pos(heightCm)]
  const hasDims = l > 0 && w > 0 && h > 0
  const volumetric = hasDims ? round2((l * w * h) / LIMITS.volumetricDivisor) : 0
  const heavier = Math.max(a, volumetric)
  // "5.4 kg = 6 kg": round up; tiny epsilon so 6.0000000001 from float maths stays 6.
  const chargeable = Math.max(1, Math.ceil(heavier - 1e-9))
  const violations = {
    side: Math.max(l, w, h) > LIMITS.maxSideCm,
    actual: a > LIMITS.maxActualKg,
    volumetric: volumetric > LIMITS.maxVolumetricKg,
    chargeable: chargeable > LIMITS.maxChargeableKg,
  }
  return {
    actual: a,
    volumetric,
    heavier,
    chargeable,
    basis: volumetric > a ? 'volumetric' : 'actual',
    hasDims,
    violations,
    allowed: !Object.values(violations).some(Boolean),
  }
}

/* ---------- Price ---------- */

export type Price = { firstKilo: number; extraKg: number; perKg: number; extraAmount: number; total: number }

/** Same as the sheet: G2 (1st kilo) + G3 (additional kilos × per-kilo rate). */
export function priceFor(route: Extract<Route, { status: 'ok' }>, chargeableKg: number): Price {
  const extraKg = Math.max(0, Math.min(chargeableKg, LIMITS.maxChargeableKg) - 1)
  const extraAmount = extraKg * route.perKg
  return { firstKilo: route.firstKilo, extraKg, perKg: route.perKg, extraAmount, total: route.firstKilo + extraAmount }
}
