import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { RichText } from '@/features/guides/RichText'
import type { LocalizedText } from '@/features/guides/types'
import { useLocalized } from '@/features/guides/useLocalized'

type Props = { actions: LocalizedText[]; onProgress?: (done: number) => void }

/** Agent steps as a tickable checklist with a progress ring. State is local (resets per inquiry via key). */
export function ActionChecklist({ actions, onProgress }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()
  const [done, setDone] = useState<boolean[]>(() => actions.map(() => false))
  const count = done.filter(Boolean).length
  const ratio = actions.length ? count / actions.length : 0
  const C = 2 * Math.PI * 16

  const toggle = (i: number) => {
    const next = done.map((v, j) => (j === i ? !v : v))
    setDone(next)
    onProgress?.(next.filter(Boolean).length)
  }

  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-card ring-1 ring-line sm:p-6">
      <div className="flex items-center gap-4">
        <span className="relative grid size-12 shrink-0 place-items-center">
          <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="20" cy="20" r="16" fill="none" stroke="var(--color-brand-100)" strokeWidth="4" />
            <motion.circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="var(--color-brand-600)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={C}
              animate={{ strokeDashoffset: C * (1 - ratio) }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
          </svg>
          <span className="text-display relative text-sm text-ink" dir="ltr" lang="en">
            {count}/{actions.length}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">{t('financial.actionsTitle')}</p>
          <p className="text-sm text-ink-500">{count === actions.length ? t('financial.actionsDone') : t('financial.actionsHint')}</p>
        </div>
      </div>

      <ol className="mt-5 space-y-3">
        {actions.map((a, i) => (
          <li key={i}>
            <button
              type="button"
              role="checkbox"
              aria-checked={done[i]}
              onClick={() => toggle(i)}
              className={clsx(
                'group flex w-full gap-4 rounded-2xl p-4 text-start ring-1 transition-colors',
                done[i] ? 'bg-emerald-50/70 ring-emerald-200' : 'bg-cream ring-transparent hover:ring-brand-200',
              )}
            >
              <span
                className={clsx(
                  'relative mt-1 grid size-7 shrink-0 place-items-center rounded-full border-2 transition-colors',
                  done[i] ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-ink-300 bg-white text-ink-500 group-hover:border-brand-600',
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {done[i] ? (
                    <motion.svg key="check" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <motion.path d="m5 12 5 5L20 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
                    </motion.svg>
                  ) : (
                    <motion.span key="n" className="text-display text-xs" dir="ltr" lang="en" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {i + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <RichText text={l(a)} className={clsx('min-w-0 flex-1 text-[1.0625rem] leading-8 transition-opacity', done[i] ? 'text-ink-500' : 'text-ink-700')} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
