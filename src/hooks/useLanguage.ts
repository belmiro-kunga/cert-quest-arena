
import { useTranslation } from 'react-i18next';
import { languages, updateLanguages, addLanguageResource } from '@/i18n/config';
import { useState, useCallback } from 'react';

export function useLanguage() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const initializeLanguage = useCallback(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const addNewLanguage = useCallback(async (
    langCode: string, 
    langName: string, 
    langFlag: string, 
    translations: object
  ) => {
    setIsLoading(true);
    try {
      // Add the language to the resources
      addLanguageResource(langCode, translations);
      
      // Update the languages array
      const newLanguageItem = { code: langCode, name: langName, flag: langFlag };
      const updatedLanguages = [...languages, newLanguageItem];
      updateLanguages(updatedLanguages);
      
      return true;
    } catch (error) {
      console.error('Error adding new language:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLanguage = useCallback((
    langCode: string,
    langName: string,
    langFlag: string
  ) => {
    try {
      // Find the language in the array and update it
      const updatedLanguages = languages.map(lang => {
        if (lang.code === langCode) {
          return { ...lang, name: langName, flag: langFlag };
        }
        return lang;
      });
      
      // Update the languages array
      updateLanguages(updatedLanguages);
      
      return true;
    } catch (error) {
      console.error('Error updating language:', error);
      return false;
    }
  }, []);

  const removeLanguage = useCallback((langCode: string) => {
    try {
      // Remove from languages array
      const updatedLanguages = languages.filter(lang => lang.code !== langCode);
      
      // If the current language is being removed, switch to the first available language
      if (i18n.language === langCode && updatedLanguages.length > 0) {
        i18n.changeLanguage(updatedLanguages[0].code);
      }
      
      // Update the languages array
      updateLanguages(updatedLanguages);
      
      return true;
    } catch (error) {
      console.error('Error removing language:', error);
      return false;
    }
  }, [i18n]);

  return {
    changeLanguage,
    getCurrentLanguage,
    initializeLanguage,
    addNewLanguage,
    updateLanguage,
    removeLanguage,
    isLoading,
    availableLanguages: languages,
  };
}
