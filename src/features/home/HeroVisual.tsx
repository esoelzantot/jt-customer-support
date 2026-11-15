import type { PointerEvent, ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useTranslation } from 'react-i18next'
import logoWhite from '@/assets/brand/jt-logo-white.png'
import { Mascot } from '@/components/brand/Mascot'

function FloatingChip({ x, y, depth, className, delay, children }: { x: MotionValue<number>; y: MotionValue<number>; depth: number; className: string; delay: number; children: ReactNode }) {
  const tx = useTransform(x, (v) => v * depth)
  const ty = useTransform(y, (v) => v * depth)
  return (
    <motion.div
      style={{ x: tx, y: ty }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 160, damping: 14 }}
      className={`absolute z-10 ${className}`}
    >
      <div className="animate-float rounded-2xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-ink shadow-lift backdrop-blur" style={{ animationDelay: `${delay * 2}s` }}>
        {children}
      </div>
    </motion.div>
  )
}

/** Brand panel with the mascot and parallax info chips that follow the pointer. */
export function HeroVisual() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const px = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 })
  const py = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 })
  const bgX = useTransform(px, (v) => v * -0.4)
  const bgY = useTransform(py, (v) => v * -0.4)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * 40)
    py.set(((e.clientY - r.top) / r.height - 0.5) * 40)
  }

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
      initial={{ opacity: 0, y: 30, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto aspect-[4/4.4] w-full max-w-md overflow-hidden rounded-[2.5rem] bg-brand-600 shadow-brand sm:aspect-[4/3.6] lg:aspect-[4/4.4]"
    >
      <motion.div aria-hidden style={{ x: bgX, y: bgY }} className="bg-speed-lines absolute -inset-10" />
      <div aria-hidden className="absolute -start-24 -top-24 size-72 rounded-full bg-white/10 blur-2xl" />
      <div aria-hidden className="absolute -bottom-28 -end-20 size-80 rounded-full bg-brand-950/40 blur-3xl" />
      <motion.img
        aria-hidden
        src={logoWhite}
        alt=""
        style={{ x: bgX }}
        className="absolute top-7 start-7 h-6 w-auto opacity-90"
      />
      <span aria-hidden className="text-display absolute -bottom-6 -start-2 text-[7.5rem] leading-none text-white/[0.08]" dir="ltr" lang="en">
        EXPRESS
      </span>

      <div className="absolute inset-x-0 bottom-5 mx-auto w-[46%] lg:w-[52%]">
        <Mascot />
      </div>

      <FloatingChip x={px} y={py} depth={0.9} delay={0.5} className="top-[22%] end-5">
        <span className="me-1.5">⚡</span>
        {t('home.chips.fast')}
      </FloatingChip>
      <FloatingChip x={px} y={py} depth={0.6} delay={0.7} className="top-[48%] start-4">
        <span className="me-1.5">🎯</span>
        {t('home.chips.precise')}
      </FloatingChip>
      <FloatingChip x={px} y={py} depth={1.2} delay={0.9} className="bottom-[16%] end-4">
        <span className="me-1.5">☎</span>
        <span dir="ltr" lang="en" className="text-display text-brand-600">15885</span>
      </FloatingChip>
    </motion.div>
  )
}
