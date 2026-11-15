import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { isLatin } from '@/features/guides/search'
import type { TicketCategory } from '@/features/guides/types'
import { useLocalized } from '@/features/guides/useLocalized'
import { isMac, openSearch } from '@/features/search/searchBus'

type Props = {
  categories: TicketCategory[]
  counts: Record<string, number>
  activeId: string | null
  onJump: (id: string) => void
}

/** 0..1 reading progress through the active category section. */
function useSectionProgress(id: string | null) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!id) return
    const el = document.getElementById(`cat-${id}`)
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      const travelled = window.innerHeight * 0.35 - r.top
      setProgress(Math.round(Math.min(Math.max(travelled / Math.max(r.height, 1), 0), 1) * 100) / 100)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [id])
  return progress
}

export function TicketsSidebar({ categories, counts, activeId, onJump }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()
  const reduce = useReducedMotion()
  const progress = useSectionProgress(activeId)
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="sticky top-24 space-y-4">
      <nav aria-label={t('tickets.filter')} className="overflow-hidden rounded-[1.75rem] bg-white shadow-card ring-1 ring-line">
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <p className="font-bold text-ink">{t('tickets.mainTypes')}</p>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            {t('tickets.results', { count: total })}
          </span>
        </header>

        <ul className="space-y-1 p-2">
          {categories.map((c, i) => {
            const count = counts[c.id] ?? 0
            const active = activeId === c.id
            const title = l(c.title)
            const latin = isLatin(title)
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onJump(c.id)}
                  disabled={count === 0}
                  aria-current={active ? 'true' : undefined}
                  className={clsx(
                    'group relative flex w-full items-center gap-3 rounded-2xl p-2.5 text-start transition-colors',
                    !active && 'hover:bg-cream',
                    count === 0 && 'cursor-not-allowed opacity-40',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-2xl bg-brand-50 ring-1 ring-brand-100"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 38 }}
                    />
                  )}

                  <span
                    className={clsx(
                      'relative grid size-11 shrink-0 place-items-center rounded-xl text-xl transition-all duration-300',
                      active ? 'bg-brand-600 shadow-brand' : 'bg-cream group-hover:scale-105',
                    )}
                  >
                    <span aria-hidden>{c.icon ?? '🎫'}</span>
                  </span>

                  <span className="relative min-w-0 flex-1">
                    <span
                      className={clsx('block text-[0.95rem] leading-snug', active ? 'font-bold text-ink' : 'font-semibold text-ink-700', latin && 'rtl:text-right')}
                      dir={latin ? 'ltr' : undefined}
                      lang={latin ? 'en' : undefined}
                    >
                      {title}
                    </span>
                    <span className={clsx('mt-0.5 block text-xs', active ? 'text-brand-700' : 'text-ink-500')}>
                      <span className="text-display me-1" dir="ltr" lang="en">{String(i + 1).padStart(2, '0')}</span>·{' '}
                      {t('tickets.subtypesCount', { count })}
                    </span>

                    {active && (
                      <span aria-hidden className="mt-2 block h-1 overflow-hidden rounded-full bg-brand-100">
                        <span className="block h-full rounded-full bg-brand-600 transition-transform duration-150 ltr:origin-left rtl:origin-right" style={{ transform: `scaleX(${progress})` }} />
                      </span>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <button
        type="button"
        onClick={() => openSearch()}
        className="group relative block w-full overflow-hidden rounded-[1.75rem] bg-brand-600 p-5 text-start text-white shadow-brand"
      >
        <span aria-hidden className="bg-speed-lines absolute inset-0" />
        <span className="relative block font-bold">{t('tickets.cantFind')}</span>
        <span className="relative mt-1 block text-sm text-white/85">{t('tickets.cantFindBody')}</span>
        <span className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 transition group-hover:gap-3">
          <kbd className="font-sans" dir="ltr">{isMac() ? '⌘' : 'Ctrl'} K</kbd>
          {t('search.open')}
        </span>
      </button>
    </div>
  )
}
