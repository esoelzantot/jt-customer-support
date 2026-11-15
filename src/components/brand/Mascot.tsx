import { useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import rabbitUrl from '@/assets/brand/mascot-rabbit.png'

type MascotProps = {
  className?: string
  /** Show the "tap me" hint and greeting bubble. */
  interactive?: boolean
}

/**
 * The J&T rabbit. Floats idly, leans toward the pointer in 3D,
 * and hops with a greeting bubble when tapped.
 */
export function Mascot({ className, interactive = true }: MascotProps) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [greeting, setGreeting] = useState(false)
  const [hops, setHops] = useState(0)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 140, damping: 14, mass: 0.6 }
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), spring)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), spring)
  const shadowScale = useTransform(rotateX, [-10, 10], [0.85, 1.05])

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const resetTilt = () => {
    px.set(0)
    py.set(0)
  }

  const hop = () => {
    setHops((n) => n + 1)
    setGreeting(true)
    window.setTimeout(() => setGreeting(false), 2200)
  }

  return (
    <div
      className={clsx('relative select-none [perspective:900px]', className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <AnimatePresence>
        {interactive && greeting && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            className="absolute inset-x-0 -top-4 z-10 mx-auto w-max rounded-2xl bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-lg shadow-brand-900/10"
          >
            {t('home.mascotHello')}
          </motion.p>
        )}
      </AnimatePresence>

      <div className={clsx(!reduceMotion && 'animate-float')}>
        <motion.button
          type="button"
          onClick={hop}
          aria-label={t('home.mascotHint')}
          disabled={!interactive}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="block w-full cursor-pointer rounded-full disabled:cursor-default"
        >
          <motion.img
            key={hops}
            src={rabbitUrl}
            alt=""
            draggable={false}
            initial={hops && !reduceMotion ? { y: 0, rotate: 0 } : false}
            animate={hops && !reduceMotion ? { y: [0, -60, 0, -18, 0], rotate: [0, -6, 4, 0], scaleY: [1, 1.04, 0.94, 1.02, 1] } : undefined}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="mx-auto h-auto w-full drop-shadow-[0_30px_40px_rgb(129_23_27/0.25)]"
          />
        </motion.button>
      </div>

      {/* Ground shadow */}
      <motion.div
        aria-hidden
        style={{ scaleX: shadowScale }}
        className="mx-auto mt-2 h-4 w-1/2 rounded-[50%] bg-brand-950/15 blur-md"
      />

      {interactive && (
        <p className="mx-auto mt-3 w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 shadow-card">{t('home.mascotHint')}</p>
      )}
    </div>
  )
}
