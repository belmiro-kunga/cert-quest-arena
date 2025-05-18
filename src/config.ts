// Configurações da API
// Em projetos Vite, usamos import.meta.env em vez de process.env

// URL principal da API
const PRIMARY_API_URL = 'http://localhost:80/api';

// URL alternativa da API (pode ser a mesma se não houver um servidor de backup)
const FALLBACK_API_URL = 'http://localhost:80/api';

// Verificar se devemos usar a URL alternativa
const useAlternativeAPI = localStorage.getItem('useAlternativeAPI') === 'true';

// Exportar a URL da API a ser usada
export const API_URL = useAlternativeAPI ? FALLBACK_API_URL : PRIMARY_API_URL;

// Função para alternar entre as URLs da API
export const toggleAPIUrl = () => {
  const currentSetting = localStorage.getItem('useAlternativeAPI') === 'true';
  localStorage.setItem('useAlternativeAPI', (!currentSetting).toString());
  // Recarregar a página para aplicar a nova configuração
  window.location.reload();
};

// Verificar se a API está disponível
export const isAPIAvailable = async (): Promise<boolean> => {
  try {
    // Usar AbortController para implementar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
    
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('API indisponível:', error);
    return false;
  }
};

// Configurações de autenticação
export const AUTH_TOKEN_KEY = 'authToken';
export const ADMIN_TOKEN_KEY = 'adminToken';

// Configurações gerais
export const APP_NAME = 'CertQuest Arena';
export const DEFAULT_LANGUAGE = 'pt';

// Configurações de paginação
export const DEFAULT_PAGE_SIZE = 10;
