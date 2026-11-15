import clsx from 'clsx'
import logoRed from '@/assets/brand/jt-logo-red.png'
import logoWhite from '@/assets/brand/jt-logo-white.png'

type LogoProps = { className?: string; tone?: 'brand' | 'white' }

/**
 * Official J&T Express logo (extracted from the brand artwork, 321×74).
 * Size it by height, e.g. `h-7`. Swap for the official SVG when available.
 */
export function Logo({ className, tone = 'brand' }: LogoProps) {
  return (
    <img
      src={tone === 'white' ? logoWhite : logoRed}
      alt="J&T Express"
      width={321}
      height={74}
      draggable={false}
      className={clsx('h-7 w-auto select-none', className)}
    />
  )
}
