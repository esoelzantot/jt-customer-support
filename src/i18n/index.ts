import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './locales/ar.json'
import en from './locales/en.json'

export const LANGUAGES = ['ar', 'en'] as const
export type Language = (typeof LANGUAGES)[number]

const applyDocumentDirection = (lng: string) => {
  const lang: Language = lng.startsWith('en') ? 'en' : 'ar'
  document.documentElement.lang = lang
  document.documentElement.dir = i18n.dir(lang)
}

// The public site is Arabic-only: always start in Arabic regardless of the browser's language.
// English strings stay available (the admin can still switch for the current session).
i18n.use(initReactI18next).init({
  resources: { ar: { translation: ar }, en: { translation: en } },
  lng: 'ar',
  fallbackLng: 'ar',
  supportedLngs: LANGUAGES,
  interpolation: { escapeValue: false },
})

// Clear a language choice saved by the old switcher so returning visitors aren't stuck in English.
try {
  localStorage.removeItem('jt-lang')
} catch {
  /* storage blocked */
}

applyDocumentDirection(i18n.resolvedLanguage ?? 'ar')
i18n.on('languageChanged', applyDocumentDirection)

export default i18n
