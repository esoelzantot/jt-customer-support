import type { PointerEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { GuideSection } from './sections'

const MotionLink = motion.create(Link)

/** Interactive hub card: 3D tilt + spotlight that follows the pointer. */
export function SectionCard({ section, index }: { section: GuideSection; index: number }) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const { slug, key, Icon, accent } = section

  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const rotateX = useSpring(0, { stiffness: 160, damping: 16 })
  const rotateY = useSpring(0, { stiffness: 160, damping: 16 })
  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${mx}% ${my}%, rgb(255 255 255 / 0.22), transparent 70%)`

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    mx.set(x * 100)
    my.set(y * 100)
    if (!reduceMotion) {
      rotateY.set((x - 0.5) * 10)
      rotateX.set((0.5 - y) * 10)
    }
  }
  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="[perspective:1000px]"
    >
      <MotionLink
        to={`/guides/${slug}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY }}
        whileTap={{ scale: 0.98 }}
        className={`group relative flex h-full min-h-64 flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br ${accent} p-7 text-white shadow-xl shadow-brand-900/20`}
      >
        <div aria-hidden className="bg-speed-lines absolute inset-0 opacity-50" />
        <motion.div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />

        <span aria-hidden className="text-display absolute -bottom-6 end-3 text-[8rem] leading-none text-white/10" dir="ltr">
          0{index + 1}
        </span>

        <span className="relative grid size-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
          <Icon className="size-8" />
        </span>

        <h3 className="relative mt-6 text-2xl font-extrabold">{t(`sections.${key}.title`)}</h3>
        <p className="relative mt-2 text-white/85">{t(`sections.${key}.short`)}</p>

        <span className="relative mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold">
          {t('home.explore')}
          <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </MotionLink>
    </motion.li>
  )
}
