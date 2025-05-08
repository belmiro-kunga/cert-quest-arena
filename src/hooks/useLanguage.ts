import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n/config';

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const initializeLanguage = () => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  };

  return {
    changeLanguage,
    getCurrentLanguage,
    initializeLanguage,
  };
} 