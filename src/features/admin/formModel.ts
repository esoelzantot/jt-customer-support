import type { GuideDoc, GuideInput } from '@/features/guides/guideApi'
import type { GuideCollection, LocalizedText } from '@/features/guides/types'

export const emptyText = (): LocalizedText => ({ ar: '' })
const blank = emptyText

export function emptyInput(collection: GuideCollection, order: number): GuideInput {
  switch (collection) {
    case 'ticketCategories':
      return { order, title: blank(), description: blank(), subtypes: [] }
    case 'financialInquiries':
      return { order, title: blank(), details: blank(), employeeActions: [blank()], replies: [{ text: blank() }] }
    case 'newOrderProcedures':
      return { order, title: blank(), steps: [blank()], requirements: [blank()] }
  }
}

export function toInput(doc: GuideDoc): GuideInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, updatedAt, ...rest } = doc
  return structuredClone(rest)
}

const isLocalized = (v: unknown): v is LocalizedText =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && 'ar' in v && typeof (v as LocalizedText).ar === 'string'

const trimText = (t: LocalizedText): LocalizedText | undefined => {
  const ar = t.ar.trim()
  const en = t.en?.trim() || undefined
  if (!ar && !en) return undefined
  return en ? { ar, en } : { ar }
}

/**
 * Trim all text, turn empty optional texts into `undefined`,
 * and drop empty entries from lists (steps, actions, subtypes…).
 */
export function normalize<T>(value: T): T {
  if (isLocalized(value)) return trimText(value) as T
  if (Array.isArray(value)) {
    return value
      .map(normalize)
      .filter((v) => v !== undefined && !(typeof v === 'object' && v && 'title' in v && v.title === undefined)) as T
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalize(v)])) as T
  }
  return value
}

/** Fields that must exist even when empty, per collection (Firestore readers rely on them). */
export function ensureRequired(collection: GuideCollection, value: GuideInput): GuideInput {
  const v = value as Record<string, unknown>
  const text = (k: string) => (v[k] as LocalizedText | undefined) ?? blank()
  const list = (k: string) => (v[k] as unknown[] | undefined) ?? []
  switch (collection) {
    case 'ticketCategories':
      return {
        ...value,
        description: text('description'),
        subtypes: (list('subtypes') as Record<string, unknown>[]).map((s) => ({ ...s, whenToUse: (s.whenToUse as LocalizedText) ?? blank() })),
      } as GuideInput
    case 'financialInquiries':
      return {
        ...value,
        details: text('details'),
        employeeActions: list('employeeActions'),
        // Drop replies whose text was left empty (normalize() turns it into undefined).
        replies: (list('replies') as { label?: string; text?: LocalizedText }[]).filter((r) => r.text).map((r) => (r.label?.trim() ? { label: r.label.trim(), text: r.text } : { text: r.text })),
        relatedTickets: list('relatedTickets'),
      } as GuideInput
    case 'newOrderProcedures':
      return { ...value, steps: list('steps'), requirements: list('requirements') } as GuideInput
  }
}
