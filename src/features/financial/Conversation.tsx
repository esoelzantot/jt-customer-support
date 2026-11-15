import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { RichText } from '@/features/guides/RichText'
import type { FinancialInquiry } from '@/features/guides/types'
import { useGuideCollection } from '@/features/guides/useGuideCollection'
import { useLocalized } from '@/features/guides/useLocalized'
import { ActionChecklist } from './ActionChecklist'
import { CustomerAvatar } from './Avatars'
import { ReplyComposer } from './ReplyComposer'

type Props = { inquiry: FinancialInquiry; index: number; total: number; onPrev?: () => void; onNext?: () => void }

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 + i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
})

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-500">
      <span className="text-display grid size-6 place-items-center rounded-full bg-ink text-xs text-white" dir="ltr" lang="en">
        {n}
      </span>
      {children}
    </p>
  )
}

/** One inquiry as a guided conversation: customer → agent steps → reply. Keyed by inquiry id. */
export function Conversation({ inquiry, index, total, onPrev, onNext }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()
  const ticketName = useTicketNames()
  const [doneCount, setDoneCount] = useState(0)
  const ready = inquiry.employeeActions.length > 0 && doneCount === inquiry.employeeActions.length

  return (
    <article aria-labelledby={`inq-${inquiry.id}`} className="relative">
      {/* Header */}
      <motion.header {...stagger(0)} className="flex flex-wrap items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-600 text-2xl shadow-brand">
          <span aria-hidden>{inquiry.icon ?? '💬'}</span>
        </span>
        <div className="min-w-0 flex-1">
          {inquiry.group && <p className="text-sm font-semibold text-brand-700">{l(inquiry.group)}</p>}
          <h2 id={`inq-${inquiry.id}`} className="mt-0.5 text-2xl font-bold sm:text-3xl">
            {l(inquiry.title)}
          </h2>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-line">
          <button type="button" onClick={onPrev} disabled={!onPrev} aria-label={t('financial.prev')} className="grid size-9 place-items-center rounded-full text-ink-500 transition hover:bg-cream hover:text-ink disabled:opacity-30">
            <svg viewBox="0 0 24 24" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <span className="text-display px-1 text-sm text-ink-500" dir="ltr" lang="en">
            {index + 1}/{total}
          </span>
          <button type="button" onClick={onNext} disabled={!onNext} aria-label={t('financial.next')} className="grid size-9 place-items-center rounded-full text-ink-500 transition hover:bg-cream hover:text-ink disabled:opacity-30">
            <svg viewBox="0 0 24 24" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </motion.header>

      <div className="relative mt-8 space-y-8">
        {/* Timeline spine */}
        <span aria-hidden className="absolute inset-y-4 start-3 w-px bg-gradient-to-b from-line via-brand-200 to-line" />

        {/* 1. Customer */}
        <motion.section {...stagger(1)} className="relative ps-10">
          <StepLabel n={1}>{t('financial.customerSays')}</StepLabel>
          <div className="flex items-end gap-3">
            <CustomerAvatar className="size-10" />
            <div className="max-w-[min(36rem,100%)] rounded-[1.5rem] rounded-es-md bg-white px-5 py-4 shadow-card ring-1 ring-line">
              <RichText text={l(inquiry.details)} className="text-[1.0625rem] leading-8 text-ink sm:text-lg sm:leading-9" />
            </div>
          </div>
        </motion.section>

        {/* 2. Agent steps */}
        <motion.section {...stagger(2)} className="relative ps-10">
          <StepLabel n={2}>{t('financial.yourSteps')}</StepLabel>
          <ActionChecklist actions={inquiry.employeeActions} onProgress={setDoneCount} />

          {(inquiry.relatedTickets?.length ?? 0) > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm text-white">
              <span className="font-semibold">{t('financial.relatedTicket')}</span>
              {inquiry.relatedTickets!.map((id) => (
                <Link
                  key={id}
                  to={`/guides/tickets#${id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold ring-1 ring-white/15 transition hover:bg-brand-600 hover:ring-brand-600"
                >
                  <span dir="ltr" lang="en" className="text-display">{ticketName(id)}</span>
                  <svg viewBox="0 0 24 24" className="size-3.5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M7 17 17 7M9 7h8v8" /></svg>
                </Link>
              ))}
            </div>
          )}

          {inquiry.note && (
            <aside className="mt-4 rounded-2xl bg-cream p-4 ring-1 ring-line">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[0.7rem] font-bold text-white">!</span>
                {t('tickets.note')}
              </p>
              <RichText text={l(inquiry.note)} className="mt-2 text-base leading-8 text-ink-700" />
            </aside>
          )}
        </motion.section>

        {/* 3. Reply */}
        <motion.section {...stagger(3)} className="relative ps-10">
          <StepLabel n={3}>{t('financial.sendReply')}</StepLabel>
          <ReplyComposer replies={inquiry.replies ?? []} ready={ready} />
        </motion.section>
      </div>
    </article>
  )
}

/** Resolve ticket sub-type ids to their names (falls back to a prettified id). */
function useTicketNames() {
  const { data } = useGuideCollection('ticketCategories')
  const l = useLocalized()
  const names = new Map(data.flatMap((c) => c.subtypes.map((s) => [s.id, l(s.title)] as const)))
  return (id: string) => names.get(id) ?? id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
