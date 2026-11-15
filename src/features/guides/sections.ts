import { BoxIcon, CoinsIcon, TicketIcon, type IconComponent } from '@/components/icons/GuideIcons'
import type { GuideCollection } from './types'

export type GuideSection = {
  /** URL slug */
  slug: string
  collection: GuideCollection
  /** i18n key under `sections.` */
  key: 'tickets' | 'financial' | 'newOrder'
  Icon: IconComponent
  /** Tailwind gradient classes for the section's accent surface. */
  accent: string
}

export const GUIDE_SECTIONS: GuideSection[] = [
  { slug: 'tickets', collection: 'ticketCategories', key: 'tickets', Icon: TicketIcon, accent: 'from-brand-600 to-brand-800' },
  { slug: 'financial', collection: 'financialInquiries', key: 'financial', Icon: CoinsIcon, accent: 'from-brand-500 to-brand-700' },
  { slug: 'new-order', collection: 'newOrderProcedures', key: 'newOrder', Icon: BoxIcon, accent: 'from-brand-700 to-brand-950' },
]

export const findSection = (slug: string) => GUIDE_SECTIONS.find((s) => s.slug === slug)
