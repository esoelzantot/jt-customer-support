import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import type { TicketRouting } from '@/features/guides/types'

const STYLES: Record<TicketRouting, { tone: string; dot: string; icon: React.ReactNode }> = {
  internal: {
    tone: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dot: 'bg-emerald-500',
    icon: <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" />,
  },
  hq: {
    tone: 'bg-ink text-white ring-ink',
    dot: 'bg-brand-500',
    icon: <path d="M7 17 17 7M9 7h8v8" />,
  },
  'hq-or-internal': {
    tone: 'bg-amber-50 text-amber-900 ring-amber-200',
    dot: 'bg-amber-500',
    icon: <path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7" />,
  },
}

/** Where the ticket goes once opened: closed by us, escalated to HQ, or either. */
export function RoutingBadge({ routing, className }: { routing: TicketRouting; className?: string }) {
  const { t } = useTranslation()
  const s = STYLES[routing]
  return (
    <span
      title={t(`tickets.routing.${routing}.hint`)}
      className={clsx('inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1', s.tone, className)}
    >
      <svg viewBox="0 0 24 24" className="size-4 shrink-0 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {s.icon}
      </svg>
      <span>
        <span className="opacity-70">{t('tickets.routing.label')}:</span> {t(`tickets.routing.${routing}.title`)}
      </span>
    </span>
  )
}
