import type { ZoneId } from './rateTable.ts'

/** One hue per zone so the route, chips and matrix speak the same visual language. */
export const ZONE_STYLE: Record<ZoneId, { chip: string; solid: string; ring: string; text: string; dot: string }> = {
  1: { chip: 'bg-brand-50 text-brand-800', solid: 'bg-brand-600 text-white', ring: 'ring-brand-200', text: 'text-brand-700', dot: 'bg-brand-600' },
  2: { chip: 'bg-amber-50 text-amber-900', solid: 'bg-amber-500 text-ink', ring: 'ring-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  3: { chip: 'bg-teal-50 text-teal-900', solid: 'bg-teal-600 text-white', ring: 'ring-teal-200', text: 'text-teal-700', dot: 'bg-teal-600' },
  4: { chip: 'bg-indigo-50 text-indigo-900', solid: 'bg-indigo-600 text-white', ring: 'ring-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-600' },
}

export const CLOSED_STYLE = { chip: 'bg-ink/5 text-ink-500', solid: 'bg-ink-500 text-white', ring: 'ring-line', text: 'text-ink-500', dot: 'bg-ink-300' }
