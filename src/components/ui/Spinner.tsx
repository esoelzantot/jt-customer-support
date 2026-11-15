import clsx from 'clsx'

export function Spinner({ className }: { className?: string }) {
  return (
    <div role="status" aria-live="polite" className={clsx('grid place-items-center p-8', className)}>
      <span className="size-9 animate-spin rounded-full border-4 border-brand-600/20 border-t-brand-600" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
