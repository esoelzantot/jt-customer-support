import { normalizeSearch } from '@/features/guides/search'

/** Highlights query words inside a title (case-insensitive, exact characters). */
export function Highlight({ text, query }: { text: string; query: string }) {
  const words = normalizeSearch(query).split(' ').filter((w) => w.length > 1)
  if (!words.length) return <>{text}</>
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <mark key={i} className="rounded bg-brand-600/15 px-0.5 text-brand-800">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}
