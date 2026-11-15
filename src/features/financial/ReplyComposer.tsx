import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import type { CustomerReply } from '@/features/guides/types'
import { useLocalized } from '@/features/guides/useLocalized'
import { AgentAvatar } from './Avatars'

/** The agent's suggested reply: "typing…" then the message, with variant tabs and copy. */
export function ReplyComposer({ replies, ready }: { replies: CustomerReply[]; ready: boolean }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const reduce = useReducedMotion()
  const [variant, setVariant] = useState(0)
  const [typing, setTyping] = useState(!reduce)
  const [copied, setCopied] = useState(false)
  const reply = replies[Math.min(variant, replies.length - 1)]
  const text = reply ? l(reply.text) : ''

  useEffect(() => {
    if (reduce) return
    const id = window.setTimeout(() => setTyping(false), 900)
    return () => window.clearTimeout(id)
  }, [reduce])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked */
    }
  }

  if (!reply) return null

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-bold">{t('financial.replyTitle')}</p>
        {replies.length > 1 && (
          <div role="tablist" aria-label={t('financial.variants')} className="flex rounded-full bg-white p-1 ring-1 ring-line">
            {replies.map((r, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={variant === i}
                onClick={() => setVariant(i)}
                className={clsx('relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors', variant === i ? 'text-white' : 'text-ink-500 hover:text-ink')}
                dir="ltr"
              >
                {variant === i && <motion.span layoutId="reply-variant" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 450, damping: 36 }} />}
                <span className="relative">{r.label ?? i + 1}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Agent bubble: aligned to the end side, like an outgoing message */}
      <div className="mt-4 flex items-end justify-end gap-3">
        <motion.div
          layout
          className={clsx(
            'relative max-w-[min(36rem,100%)] rounded-[1.5rem] rounded-ee-md px-5 py-4 text-white shadow-brand transition-[box-shadow]',
            'bg-brand-600',
            ready && 'ring-4 ring-brand-200',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {typing ? (
              <motion.span key="typing" className="flex gap-1.5 py-2" exit={{ opacity: 0 }} aria-label={t('financial.typing')}>
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} className="size-2 rounded-full bg-white/80" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }} />
                ))}
              </motion.span>
            ) : (
              <motion.p
                key={variant}
                initial={reduce ? false : { opacity: 0, filter: 'blur(6px)', y: 6 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.45 }}
                className="text-[1.0625rem] leading-8 sm:text-lg sm:leading-9"
                dir="auto"
              >
                {text}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
        <AgentAvatar className="size-10" />
      </div>

      <div className="mt-3 flex justify-end pe-[3.25rem]">
        <button
          type="button"
          onClick={copy}
          disabled={typing}
          className={clsx(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition',
            copied ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-white text-ink-700 ring-line hover:text-brand-700 hover:ring-brand-200',
          )}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {copied ? <path d="m5 12 5 5L20 7" /> : <><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>}
          </svg>
          <span aria-live="polite">{copied ? t('tickets.copied') : t('financial.copyReply')}</span>
        </button>
      </div>
    </div>
  )
}
