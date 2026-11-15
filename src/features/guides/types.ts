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
  /** Conditions that apply to every sub-type in this category (e.g. Claims prerequisites). */
  rules?: LocalizedText[]
  subtypes: TicketSubtype[]
}

/* ---------- 2. Financial inquiries ---------- */

/** A ready-to-send reply. `label` distinguishes variants (e.g. "TEMU" / "SHEIN"). */
export type CustomerReply = { label?: string; text: LocalizedText }

export type FinancialInquiry = BaseDoc & {
  /** Topic used to group inquiries in the list (e.g. "حساب مبلغ الجمارك"). */
  group?: LocalizedText
  /** The case: what the customer is asking or saying. */
  details: LocalizedText
  /** What the employee must do, in order. */
  employeeActions: LocalizedText[]
  /** One reply, or several labelled variants. */
  replies: CustomerReply[]
  /** Ticket sub-type IDs the agent may need to open (links to the tickets guide). */
  relatedTickets?: string[]
  note?: LocalizedText
}

/* ---------- 3. New order ---------- */

/** Interactive tool shown inside a new-order step. */
export type NewOrderWidget = 'prohibited-items' | 'weight-calculator' | 'compensation' | 'order-channels' | 'terms'

export type NewOrderProcedure = BaseDoc & {
  summary?: LocalizedText
  /** What the agent does / explains, in order. */
  steps: LocalizedText[]
  /** What to ask the customer for. */
  requirements: LocalizedText[]
  note?: LocalizedText
  widget?: NewOrderWidget
}

export type GuideCollection = 'ticketCategories' | 'financialInquiries' | 'newOrderProcedures'
