import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Mascot } from '@/components/brand/Mascot'
import { useGuideCollection } from '@/features/guides/useGuideCollection'
import { useLocalized } from '@/features/guides/useLocalized'
import { StepContent } from './StepContent'

export default function NewOrderView() {
  const { t, i18n } = useTranslation()
  const l = useLocalized()
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const { hash } = useLocation()
  const { status, data } = useGuideCollection('newOrderProcedures')
  const [done, setDone] = useState<Set<string>>(new Set())
  const [finished, setFinished] = useState(false)
  const [direction, setDirection] = useState(1)
  const topRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLOListElement>(null)

  const hashId = decodeURIComponent(hash.slice(1))
  const index = Math.max(0, data.findIndex((s) => s.id === hashId))
  const step = data[index]
  const progress = data.length ? done.size / data.length : 0
  const rtl = i18n.dir() === 'rtl'

  const goTo = (i: number) => {
    if (!data[i]) return
    setDirection(i >= index ? 1 : -1)
    setFinished(false)
    navigate({ hash: data[i].id }, { replace: true, preventScrollReset: true })
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const goToId = (id: string) => goTo(data.findIndex((s) => s.id === id))

  const completeAndNext = () => {
    if (!step) return
    setDone((prev) => new Set(prev).add(step.id))
    if (index < data.length - 1) goTo(index + 1)
    else setFinished(true)
  }

  const restart = () => {
    setDone(new Set())
    setFinished(false)
    goTo(0)
  }

  // Keep the active step visible in the horizontal rail on small screens.
  useEffect(() => {
    railRef.current?.querySelector<HTMLElement>(`[data-step="${step?.id}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [step?.id])

  if (status === 'loading') {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-8 pb-24 sm:px-6 lg:grid-cols-[18rem_1fr]" aria-hidden>
        <div className="h-96 animate-pulse rounded-[1.75rem] bg-white ring-1 ring-line" />
        <div className="h-[32rem] animate-pulse rounded-[1.75rem] bg-white/60" />
      </div>
    )
  }
  if (!step) {
    return <p className="mx-auto mt-10 max-w-xl rounded-3xl bg-white p-6 text-center text-ink-500 ring-1 ring-line">{status === 'error' ? t('newOrder.loadError') : t('sections.comingSoon')}</p>
  }

  const slide = reduce ? 0 : 40 * direction * (rtl ? -1 : 1)

  return (
    <div ref={topRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-8 pb-24 sm:px-6 lg:grid lg:grid-cols-[18rem_1fr] lg:items-start lg:gap-10">
      {/* Step rail */}
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-[1.75rem] bg-white p-4 shadow-card ring-1 ring-line lg:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold">{t('newOrder.callFlow')}</p>
            <span className="text-display text-sm text-brand-700" dir="ltr" lang="en">{Math.round(progress * 100)}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream">
            <motion.div className="h-full rounded-full bg-brand-600" initial={false} animate={{ width: `${progress * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
          </div>

          <ol ref={railRef} className="relative mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            <span aria-hidden className="absolute inset-y-5 start-[1.45rem] hidden w-px bg-line lg:block" />
            {data.map((s, i) => {
              const active = i === index && !finished
              const isDone = done.has(s.id)
              return (
                <li key={s.id} data-step={s.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={active ? 'step' : undefined}
                    className={clsx('relative flex w-full items-center gap-3 rounded-2xl p-2 text-start transition-colors', active ? '' : 'hover:bg-cream')}
                  >
                    {active && <motion.span layoutId="step-active" className="absolute inset-0 rounded-2xl bg-brand-50 ring-1 ring-brand-100" transition={{ type: 'spring', stiffness: 450, damping: 38 }} />}
                    <span
                      className={clsx(
                        'relative grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors',
                        isDone ? 'bg-emerald-500 text-white' : active ? 'bg-brand-600 text-white shadow-brand' : 'bg-white text-ink-500 ring-1 ring-line',
                      )}
                    >
                      {isDone ? '✓' : <span className="text-display" dir="ltr" lang="en">{i + 1}</span>}
                    </span>
                    <span className={clsx('relative whitespace-nowrap text-sm lg:whitespace-normal', active ? 'font-bold text-ink' : 'font-semibold text-ink-700')}>{l(s.title)}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </aside>

      {/* Step */}
      <div className="mt-6 min-w-0 lg:mt-0">
        <AnimatePresence mode="wait" initial={false} custom={slide}>
          {finished ? (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative overflow-hidden rounded-[2rem] bg-brand-600 p-8 text-center text-white shadow-brand sm:p-12"
            >
              <span aria-hidden className="bg-speed-lines absolute inset-0" />
              <div className="relative mx-auto w-40">
                <Mascot />
              </div>
              <h2 className="relative mt-6 text-3xl font-bold">{t('newOrder.finishedTitle')}</h2>
              <p className="relative mx-auto mt-2 max-w-md text-white/85">{t('newOrder.finishedBody')}</p>
              <button type="button" onClick={restart} className="relative mt-6 rounded-full bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50">
                {t('newOrder.newCall')}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: slide }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -slide, transition: { duration: 0.15 } }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <StepContent step={step} index={index} total={data.length} onGoTo={goToId} />

              {/* Footer nav */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-white p-3 shadow-card ring-1 ring-line">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  disabled={index === 0}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold text-ink-500 transition hover:bg-cream hover:text-ink disabled:opacity-30"
                >
                  <svg viewBox="0 0 24 24" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M15 6l-6 6 6 6" /></svg>
                  {t('newOrder.prev')}
                </button>
                <motion.button
                  type="button"
                  onClick={completeAndNext}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-brand transition hover:bg-brand-700"
                >
                  {index === data.length - 1 ? t('newOrder.finish') : t('newOrder.doneNext')}
                  <svg viewBox="0 0 24 24" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M9 6l6 6-6 6" /></svg>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
