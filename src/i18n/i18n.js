import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en.json';
import translationPT from './locales/pt.json';
import translationES from './locales/es.json';
import translationFR from './locales/fr.json';
import translationIT from './locales/it.json';
import translationKO from './locales/ko.json';

const resources = {
  en: { translation: translationEN },
  pt: { translation: translationPT },
  es: { translation: translationES },
  fr: { translation: translationFR },
  it: { translation: translationIT },
  ko: { translation: translationKO }
};

// saves the chosen language
const savedLanguage = localStorage.getItem('user-language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // chosen (or default) language
    fallbackLng: 'en', // if a key is missing in a language shows in english
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;