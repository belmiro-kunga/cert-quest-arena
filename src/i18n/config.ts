
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language files
import ptBR from './locales/pt-BR';
import enUS from './locales/en-US';

// Available languages
export let languages = [
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  // Add more languages here as needed
];

// Function to update languages array
export const updateLanguages = (newLanguages: { code: string; name: string; flag: string }[]) => {
  // Replace the languages array with the new one
  languages = [...newLanguages];
};

// Function to add a new language resource
export const addLanguageResource = (langCode: string, translations: object) => {
  i18n.addResourceBundle(langCode, 'translation', translations, true, true);
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS },
      // Add more language resources here
    },
    fallbackLng: 'pt-BR',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
