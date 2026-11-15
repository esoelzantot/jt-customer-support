import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

const CHANNELS = [
  { id: 'agent', icon: '🎧' },
  { id: 'app', icon: '📲' },
  { id: 'branch', icon: '🏢' },
] as const

/** The three ways to place an order; picking "through us" points to the data step. */
export function OrderChannels({ onContinue }: { onContinue?: () => void }) {
  const { t } = useTranslation()
  const [picked, setPicked] = useState<(typeof CHANNELS)[number]['id'] | null>(null)

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-ink-500">{t('newOrder.channels.ask')}</p>
      <div role="radiogroup" className="grid gap-3 sm:grid-cols-3">
        {CHANNELS.map((c) => {
          const on = picked === c.id
          return (
            <motion.button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setPicked(c.id)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                'relative flex flex-col items-start gap-3 overflow-hidden rounded-[1.5rem] p-5 text-start ring-1 transition-colors',
                on ? 'bg-brand-600 text-white shadow-brand ring-brand-600' : 'bg-white shadow-card ring-line hover:ring-brand-200',
              )}
            >
              {on && <span aria-hidden className="bg-speed-lines absolute inset-0" />}
              <span className={clsx('relative grid size-12 place-items-center rounded-2xl text-2xl', on ? 'bg-white' : 'bg-cream')}>{c.icon}</span>
              <span className="relative text-lg font-bold">{t(`newOrder.channels.${c.id}.title`)}</span>
              <span className={clsx('relative text-sm leading-6', on ? 'text-white/85' : 'text-ink-500')}>{t(`newOrder.channels.${c.id}.body`)}</span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {picked === 'agent' && onContinue && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-4 text-white">
            <p className="font-semibold">{t('newOrder.channels.agentNext')}</p>
            <button type="button" onClick={onContinue} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
              {t('newOrder.channels.goToData')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
