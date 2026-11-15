import clsx from 'clsx'

type LogoProps = { className?: string; tone?: 'brand' | 'white' }

/**
 * Text wordmark placeholder until we get the official SVG logo from the brand team.
 * Always rendered LTR, regardless of page direction.
 */
export function Logo({ className, tone = 'brand' }: LogoProps) {
  return (
    <span
      dir="ltr"
      lang="en"
      className={clsx(
        'text-display inline-flex items-baseline gap-1.5 leading-none',
        tone === 'brand' ? 'text-brand-600' : 'text-white',
        className,
      )}
    >
      <span className="text-[1.6em]">J&amp;T</span>
      <span className="text-[0.85em] tracking-tight">EXPRESS</span>
    </span>
  )
}
