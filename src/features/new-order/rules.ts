/** Business limits for new orders (source: customer service guide + service terms). */
export const SHIPPING_RULES = {
  volumetricDivisor: 5000,
  maxSideCm: 100,
  maxActualKg: 30,
  maxVolumetricKg: 50,
  damage: { multiplier: 2, capEgp: 200 },
  lost: { multiplier: 5, capEgp: 500 },
  claimDays: { lost: 30, damaged: 2 },
} as const

export const round2 = (n: number) => Math.round(n * 100) / 100
export const volumetricKg = (l: number, w: number, h: number) => round2((l * w * h) / SHIPPING_RULES.volumetricDivisor)

/** Compensation = multiplier × shipping fee, capped, and never above the shipment value (if known). */
export function compensation(fee: number, kind: 'damage' | 'lost', shipmentValue?: number) {
  const rule = SHIPPING_RULES[kind]
  const base = Math.min(fee * rule.multiplier, rule.capEgp)
  return round2(shipmentValue && shipmentValue > 0 ? Math.min(base, shipmentValue) : base)
}
