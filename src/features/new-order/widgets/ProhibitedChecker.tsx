import { useDeferredValue, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { checkItem, GENERAL_RULE, PROHIBITED_CATEGORIES } from '../prohibited'

const SUGGESTIONS = ['موبايل', 'برفان', 'هدوم', 'رز', 'ولاعة', 'دهب', 'كاسات']

/** Type what the customer wants to ship → instant verdict, plus the full list as a browsable grid. */
export function ProhibitedChecker() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('check') ?? '')
  const deferred = useDeferredValue(query)
  const verdict = useMemo(() => checkItem(deferred), [deferred])
  const [openCat, setOpenCat] = useState<string | null>(null)
  const hitCats = verdict.kind === 'prohibited' ? new Set(verdict.hits.map((h) => h.category.id)) : new Set<string>()

  return (
    <div className="space-y-5">
      {/* Checker */}
      <div className="overflow-hidden rounded-[1.75rem] bg-ink p-5 text-white sm:p-6">
        <p className="text-lg font-bold">{t('newOrder.checker.title')}</p>
        <p className="mt-1 text-sm text-white/70">{t('newOrder.checker.hint')}</p>
        <label className="relative mt-4 block">
          <span className="sr-only">{t('newOrder.checker.title')}</span>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute inset-y-0 start-4 my-auto size-5 text-white/50" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('newOrder.checker.placeholder')}
            className="w-full rounded-2xl bg-white/10 py-3.5 ps-12 pe-4 text-lg text-white outline-none ring-1 ring-white/15 transition placeholder:text-white/40 focus:bg-white/15 focus:ring-2 focus:ring-brand-500"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => setQuery(s)} className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white/80 transition hover:bg-white/20 hover:text-white">
              {s}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {verdict.kind !== 'empty' && (
            <motion.div
              key={verdict.kind + deferred}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              role="status"
              className={clsx(
                'mt-5 rounded-2xl p-4 sm:p-5',
                verdict.kind === 'prohibited' && 'bg-brand-600',
                verdict.kind === 'fragile' && 'bg-amber-500 text-ink',
                verdict.kind === 'allowed' && 'bg-emerald-500 text-ink',
                verdict.kind === 'unknown' && 'bg-white text-ink',
              )}
            >
              {verdict.kind === 'prohibited' && (
                <>
                  <p className="flex items-center gap-2 text-xl font-bold">
                    <span aria-hidden>⛔</span> {t('newOrder.checker.prohibited')}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {verdict.hits.slice(0, 3).map(({ category, item }) => (
                      <li key={item.name} className="rounded-xl bg-white/15 p-3">
                        <p className="font-semibold">{category.icon} {item.name}</p>
                        {item.details && <p className="mt-1 text-sm leading-6 text-white/85">{item.details}</p>}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {verdict.kind === 'fragile' && (
                <>
                  <p className="flex items-center gap-2 text-xl font-bold"><span aria-hidden>⚠️</span> {t('newOrder.checker.fragile')}</p>
                  <p className="mt-2 leading-7">{GENERAL_RULE.body}</p>
                </>
              )}
              {verdict.kind === 'allowed' && (
                <>
                  <p className="flex items-center gap-2 text-xl font-bold"><span aria-hidden>✅</span> {t('newOrder.checker.allowed')}</p>
                  <p className="mt-2 leading-7">{verdict.reason}</p>
                </>
              )}
              {verdict.kind === 'unknown' && (
                <>
                  <p className="flex items-center gap-2 text-xl font-bold"><span aria-hidden>🟢</span> {t('newOrder.checker.notListed')}</p>
                  <p className="mt-2 leading-7 text-ink-700">{t('newOrder.checker.notListedBody')}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* General rule */}
      <div className="flex gap-4 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
        <span aria-hidden className="text-2xl">⚠️</span>
        <div>
          <p className="font-bold text-amber-900">{t('newOrder.checker.generalRule')}: {GENERAL_RULE.title}</p>
          <p className="mt-1 leading-7 text-amber-950/80">{GENERAL_RULE.body}</p>
        </div>
      </div>

      {/* Full list */}
      <div>
        <p className="mb-3 text-sm font-semibold text-ink-500">{t('newOrder.checker.fullList')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PROHIBITED_CATEGORIES.map((c) => {
            const open = openCat === c.id || hitCats.has(c.id)
            return (
              <motion.div
                key={c.id}
                layout
                className={clsx('overflow-hidden rounded-2xl bg-white ring-1 transition-colors', hitCats.has(c.id) ? 'ring-2 ring-brand-600' : 'ring-line')}
              >
                <button
                  type="button"
                  onClick={() => setOpenCat(openCat === c.id ? null : c.id)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 p-4 text-start"
                >
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream text-xl">{c.icon}</span>
                  <span className="min-w-0 flex-1 font-semibold">{c.title}</span>
                  <svg viewBox="0 0 24 24" className={clsx('size-4 shrink-0 text-ink-500 transition-transform', open && 'rotate-180')} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <ul className="space-y-2.5 px-4 pb-4">
                        {c.items.map((it) => (
                          <li key={it.name} className="flex gap-2.5">
                            <span aria-hidden className="mt-1 text-xs">⛔</span>
                            <span>
                              <span className="font-semibold text-ink">{it.name}</span>
                              {it.details && <span className="mt-0.5 block text-sm leading-6 text-ink-500">{it.details}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
