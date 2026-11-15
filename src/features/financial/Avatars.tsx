import clsx from 'clsx'
import rabbitUrl from '@/assets/brand/mascot-rabbit.png'

export function CustomerAvatar({ className }: { className?: string }) {
  return (
    <span className={clsx('grid shrink-0 place-items-center rounded-full bg-ink text-white', className)} aria-hidden>
      <svg viewBox="0 0 24 24" className="size-[55%]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
      </svg>
    </span>
  )
}

/** The J&T rabbit as the agent's avatar (head crop). */
export function AgentAvatar({ className }: { className?: string }) {
  return (
    <span className={clsx('block shrink-0 overflow-hidden rounded-full bg-brand-50 ring-2 ring-white', className)} aria-hidden>
      <img src={rabbitUrl} alt="" draggable={false} className="h-full w-full scale-[1.9] object-cover object-[50%_14%]" style={{ transformOrigin: '50% 12%' }} />
    </span>
  )
}
