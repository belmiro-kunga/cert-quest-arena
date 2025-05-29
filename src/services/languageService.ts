
interface Language {
  code: string;
  name: string;
  flag: string;
}

export const fetchLanguages = async (): Promise<Language[]> => {
  // Mock implementation - replace with actual API call
  return [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' }
  ];
};

export const createLanguage = async (language: Language): Promise<Language> => {
  // Mock implementation - replace with actual API call
  return language;
};

export const updateLanguage = async (language: Language): Promise<Language> => {
  // Mock implementation - replace with actual API call
  return language;
};

export const deleteLanguage = async (code: string): Promise<void> => {
  // Mock implementation - replace with actual API call
  console.log('Deleting language:', code);
};
