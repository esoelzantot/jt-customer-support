/**
 * Content models for the three guide sections.
 * Stored in Firestore; every document carries `order` for manual sorting.
 *
 *   ticketCategories/{id}      -> TicketCategory (subtypes embedded)
 *   financialInquiries/{id}    -> FinancialInquiry
 *   newOrderProcedures/{id}    -> NewOrderProcedure
 */

/** Text that may be provided in Arabic only, or both languages. */
export type LocalizedText = { ar: string; en?: string }

type BaseDoc = {
  id: string
  order: number
  title: LocalizedText
  /** Optional emoji or icon key for visual identity. */
  icon?: string
  updatedAt?: Date
}

/* ---------- 1. Tickets ---------- */

export type TicketSubtype = {
  id: string
  title: LocalizedText
  /** In which situation the agent should choose this subtype. */
  whenToUse: LocalizedText
  note?: LocalizedText
}

export type TicketCategory = BaseDoc & {
  description: LocalizedText
  subtypes: TicketSubtype[]
}

/* ---------- 2. Financial inquiries ---------- */

export type FinancialInquiry = BaseDoc & {
  details: LocalizedText
  /** What the employee must do, in order. */
  employeeActions: LocalizedText[]
  /** Ready-to-send reply to the customer (copyable). */
  customerReply: LocalizedText
  note?: LocalizedText
}

/* ---------- 3. New order ---------- */

export type NewOrderProcedure = BaseDoc & {
  summary?: LocalizedText
  /** Procedure steps, in order. */
  steps: LocalizedText[]
  /** What the customer must provide. */
  requirements: LocalizedText[]
  note?: LocalizedText
}

export type GuideCollection = 'ticketCategories' | 'financialInquiries' | 'newOrderProcedures'
