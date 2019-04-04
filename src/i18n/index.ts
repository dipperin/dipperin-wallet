import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import i18nResource from './i18n'

if (process.env.NODE_ENV === 'test') {
  i18n.init({
    fallbackLng: 'cimode',
    debug: false,
    saveMissing: false,
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    // react i18next special options (optional)
    react: {
      wait: false,
      nsMode: 'fallback' // set it to fallback to let passed namespaces to translated hoc act as fallbacks
    }
  })
} else {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      debug: false,
      fallbackLng: 'en-US',
      preload: ['zh-CN', 'en-US'],
      react: {
        wait: true
      },
      returnObjects: true,
      resources: i18nResource,
      detection: {
        // order and from where user language should be detected
        order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
        lookupLocalStorage: 'i18nextLng',
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,

        // cache user language on
        caches: ['localStorage'],

        // optional htmlTag with lang attribute, the default is:
        htmlTag: document.documentElement
      }
    })
}

export default i18n
