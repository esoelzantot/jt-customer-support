import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FinancialInquiry, GuideCollection, NewOrderProcedure, TicketCategory } from './types'

type DocFor = {
  ticketCategories: TicketCategory
  financialInquiries: FinancialInquiry
  newOrderProcedures: NewOrderProcedure
}

type Snapshot<T> = { source: GuideCollection; data: T[]; error?: Error }

export type GuideCollectionState<T> = {
  status: 'loading' | 'ready' | 'error'
  data: T[]
  error?: Error
}

/** Live, ordered subscription to one guide collection (served from the offline cache when available). */
export function useGuideCollection<C extends GuideCollection>(name: C): GuideCollectionState<DocFor[C]> {
  const [snap, setSnap] = useState<Snapshot<DocFor[C]> | null>(null)

  useEffect(() => {
    const q = query(collection(db, name), orderBy('order', 'asc'))
    return onSnapshot(
      q,
      (s) => {
        const data = s.docs.map((d) => {
          const raw = d.data()
          return { ...raw, id: d.id, updatedAt: raw.updatedAt?.toDate?.() } as DocFor[C]
        })
        setSnap({ source: name, data })
      },
      (error) => setSnap((prev) => ({ source: name, data: prev?.source === name ? prev.data : [], error })),
    )
  }, [name])

  // A snapshot from a previous collection name counts as still loading.
  if (!snap || snap.source !== name) return { status: 'loading', data: [] }
  return snap.error ? { status: 'error', data: snap.data, error: snap.error } : { status: 'ready', data: snap.data }
}
