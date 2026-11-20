import type { SVGProps } from 'react'

export type IconComponent = (p: SVGProps<SVGSVGElement>) => React.JSX.Element

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const TicketIcon: IconComponent = (p) => (
  <svg {...base} {...p}>
    <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4V8Z" />
    <path d="M14 6v12" strokeDasharray="2 2.5" />
  </svg>
)

export const CoinsIcon: IconComponent = (p) => (
  <svg {...base} {...p}>
    <ellipse cx="9" cy="7" rx="6" ry="3" />
    <path d="M3 7v4c0 1.66 2.69 3 6 3s6-1.34 6-3V7" />
    <path d="M9 14v3c0 1.66 2.69 3 6 3s6-1.34 6-3v-4c0-1.66-2.69-3-6-3" />
  </svg>
)

export const CalculatorIcon: IconComponent = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="2.5" width="16" height="19" rx="3" />
    <rect x="7.5" y="6" width="9" height="3.5" rx="1" />
    <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" strokeWidth="2.6" />
  </svg>
)

export const BoxIcon: IconComponent = (p) => (
  <svg {...base} {...p}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
    <path d="m7.5 5.5 9 5" />
  </svg>
)
