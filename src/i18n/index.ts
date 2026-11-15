import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { ar: { translation: ar }, en: { translation: en } },
    fallbackLng: 'ar',
    supportedLngs: LANGUAGES,
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'], lookupLocalStorage: 'jt-lang' },
  })

applyDocumentDirection(i18n.resolvedLanguage ?? 'ar')
i18n.on('languageChanged', applyDocumentDirection)

export default i18n
