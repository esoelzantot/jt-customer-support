import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FinancialInquiry, GuideCollection, NewOrderProcedure, TicketCategory } from './types'

export type GuideDoc = TicketCategory | FinancialInquiry | NewOrderProcedure
/** What an editor submits: everything except server-managed fields. */
/** Distributes over the union so each collection keeps its own fields. */
export type GuideInput<T extends GuideDoc = GuideDoc> = T extends GuideDoc ? Omit<T, 'id' | 'updatedAt'> : never

/** Firestore rejects `undefined`; strip it recursively (optional fields left empty). */
function clean<T>(value: T): T {
  if (Array.isArray(value)) return value.map(clean) as T
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, clean(v)]),
    ) as T
  }
  return value
}

export async function saveGuide(name: GuideCollection, input: GuideInput, id?: string) {
  const data = { ...clean(input), updatedAt: serverTimestamp() }
  if (id) {
    await setDoc(doc(db, name, id), data)
    return id
  }
  const ref = await addDoc(collection(db, name), data)
  return ref.id
}

export function deleteGuide(name: GuideCollection, id: string) {
  return deleteDoc(doc(db, name, id))
}

/** Persist a new manual order after drag-and-drop. */
export async function reorderGuides(name: GuideCollection, orderedIds: string[]) {
  const batch = writeBatch(db)
  orderedIds.forEach((id, index) => batch.update(doc(db, name, id), { order: index }))
  await batch.commit()
}
