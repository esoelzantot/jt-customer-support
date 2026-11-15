import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

export function LanguageSwitch({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { t, i18n } = useTranslation()
  const next = i18n.resolvedLanguage === 'en' ? 'ar' : 'en'

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(next)}
      lang={next}
      className={clsx(
        'rounded-full px-3 py-2 text-sm font-semibold transition',
        tone === 'light' ? 'text-ink-500 hover:bg-white hover:text-ink' : 'text-white/80 hover:bg-white/10 hover:text-white',
      )}
    >
      {t('lang.switch')}
    </button>
  )
}
