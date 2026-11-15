import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { LocalizedText } from './types'

/** Returns a resolver that picks the current language, falling back to Arabic. */
export function useLocalized() {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage === 'en' ? 'en' : 'ar'
  return useCallback((text?: LocalizedText) => (text ? (lang === 'en' && text.en) || text.ar : ''), [lang])
}
