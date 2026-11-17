import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'
import clsx from 'clsx'

/**
 * Lightweight, safe rich text for guide content (no HTML injection):
 *   "• " / "* " / "- " at line start -> bullet
 *   "condition ← outcome"            -> condition/outcome row
 *   [label](https://…)               -> external link (new tab)
 *   [label](/guides/…)               -> link to another page of this app
 */

const BULLET = /^\s*[•*-]\s+/
const LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(LINK)) {
    if (m.index! > last) out.push(text.slice(last, m.index))
    if (m[2].startsWith('/')) {
      out.push(
        <Link
          key={`${keyPrefix}-l${m.index}`}
          to={m[2]}
          className="inline-flex items-center gap-1 rounded-md bg-brand-600/10 px-1.5 font-bold text-brand-700 underline-offset-2 hover:underline"
        >
          {m[1]}
          <svg viewBox="0 0 24 24" className="size-3.5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>,
      )
      last = m.index! + m[0].length
      continue
    }
    out.push(
      <a
        key={`${keyPrefix}-l${m.index}`}
        href={m[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-md bg-brand-600/10 px-1.5 font-bold text-brand-700 underline-offset-2 hover:underline"
        dir="ltr"
      >
        {m[1]}
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
      </a>,
    )
    last = m.index! + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function Line({ text, k }: { text: string; k: string }) {
  const parts = text.split('←')
  if (parts.length === 2) {
    return (
      <span className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
        <span className="min-w-0 flex-1">{inline(parts[0].trim(), `${k}a`)}</span>
        <span aria-hidden className="hidden shrink-0 text-brand-600 sm:block">
          <svg viewBox="0 0 24 24" className="size-5 ltr:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </span>
        <span className="w-fit rounded-xl bg-white px-3 py-1 font-bold text-brand-800 shadow-sm ring-1 ring-brand-600/15 sm:max-w-[55%]">
          {inline(parts[1].trim(), `${k}b`)}
        </span>
      </span>
    )
  }
  return <>{inline(text, k)}</>
}

export function RichText({ text, className }: { text?: string; className?: string }) {
  if (!text) return null
  const lines = text.split('\n').filter((l) => l.trim())
  const blocks: { type: 'p' | 'ul'; lines: string[] }[] = []
  for (const line of lines) {
    const isBullet = BULLET.test(line)
    const clean = line.replace(BULLET, '')
    const prev = blocks.at(-1)
    if (isBullet && prev?.type === 'ul') prev.lines.push(clean)
    else blocks.push({ type: isBullet ? 'ul' : 'p', lines: [clean] })
  }

  return (
    <div className={clsx('space-y-2', className ?? 'leading-7')} dir="auto">
      {blocks.map((b, i) =>
        b.type === 'p' ? (
          <p key={i}>
            {b.lines.map((l, j) => (
              <Fragment key={j}>
                <Line text={l} k={`${i}-${j}`} />
              </Fragment>
            ))}
          </p>
        ) : (
          <ul key={i} className="space-y-2">
            {b.lines.map((l, j) => (
              <li key={j} className="flex gap-2.5">
                <span aria-hidden className="mt-[0.75em] size-1.5 shrink-0 rounded-full bg-brand-600" />
                <span className="min-w-0 flex-1">
                  <Line text={l} k={`${i}-${j}`} />
                </span>
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}
