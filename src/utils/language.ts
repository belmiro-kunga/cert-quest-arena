// Lista de países que falam português
const PORTUGUESE_SPEAKING_COUNTRIES = [
  'BR', // Brasil
  'PT', // Portugal
  'AO', // Angola
  'MZ', // Moçambique
  'CV', // Cabo Verde
  'GW', // Guiné-Bissau
  'ST', // São Tomé e Príncipe
  'TL', // Timor-Leste
];

// Função para obter o idioma padrão baseado no país do usuário
export const getDefaultLanguage = (): string => {
  // Tenta obter o país do usuário através do navegador
  const userCountry = navigator.language.split('-')[1]?.toUpperCase();
  
  // Se o país do usuário fala português, retorna pt-BR
  if (userCountry && PORTUGUESE_SPEAKING_COUNTRIES.includes(userCountry)) {
    return 'pt-BR';
  }
  
  // Caso contrário, retorna inglês
  return 'en-US';
};

// Função para verificar se o idioma atual é português
export const isPortugueseLanguage = (language: string): boolean => {
  return language.startsWith('pt');
};

// Função para obter o nome do idioma em seu próprio idioma
export const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    'pt-BR': 'Português (Brasil)',
    'en-US': 'English (US)',
    'es': 'Español',
  };
  
  return languages[code] || code;
};

// Função para obter o nome do idioma no idioma atual
export const getLocalizedLanguageName = (code: string, currentLanguage: string): string => {
  const languages: Record<string, Record<string, string>> = {
    'pt-BR': {
      'pt-BR': 'Português (Brasil)',
      'en-US': 'Inglês (EUA)',
      'es': 'Espanhol',
    },
    'en-US': {
      'pt-BR': 'Portuguese (Brazil)',
      'en-US': 'English (US)',
      'es': 'Spanish',
    },
    'es': {
      'pt-BR': 'Portugués (Brasil)',
      'en-US': 'Inglés (EE.UU.)',
      'es': 'Español',
    },
  };
  
  return languages[currentLanguage]?.[code] || code;
}; 