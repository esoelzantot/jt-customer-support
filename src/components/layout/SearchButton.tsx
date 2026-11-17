import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { isMac, openSearch } from '@/features/search/searchBus'

export function SearchButton({ className }: { className?: string }) {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      onClick={() => openSearch()}
      aria-label={t('search.open')}
      className={clsx(
        'group flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink-500 shadow-card transition hover:border-brand-200 hover:text-ink',
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-ink-500 group-hover:text-brand-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="min-w-0 flex-1 truncate text-start">{t('search.short')}</span>
      <kbd className="hidden rounded-md border border-line bg-cream px-1.5 py-0.5 font-sans text-[0.7rem] font-semibold sm:block" dir="ltr">
        {isMac() ? '⌘' : 'Ctrl'} K
      </kbd>
    </button>
  )
}
