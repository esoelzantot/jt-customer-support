import { useTranslation } from 'react-i18next'

export function LanguageSwitch() {
  const { t, i18n } = useTranslation()
  const next = i18n.resolvedLanguage === 'en' ? 'ar' : 'en'

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(next)}
      lang={next}
      className="rounded-full border-2 border-brand-600/20 px-4 py-1.5 text-sm font-bold text-brand-700 transition hover:border-brand-600 hover:bg-brand-600 hover:text-white"
    >
      {t('lang.switch')}
    </button>
  )
}
