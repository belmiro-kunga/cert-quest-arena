import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { authService, User as AuthUser } from '@/services/authService';

interface AffiliateInfo {
  status: 'pending' | 'approved' | 'rejected' | null;
  earnings: number;
  referrals: number;
  link: string;
  applicationDate?: string;
}

interface TwoFactorAuth {
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  affiliate: AffiliateInfo;
  photoURL?: string;
  twoFactorAuth?: TwoFactorAuth;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{requiresTwoFactor: boolean} | void>;
  verifyTwoFactorCode: (code: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  isAdmin: () => boolean;
  updateUserProfile: (userData: Partial<User>) => void;
  setupTwoFactor: () => Promise<{secret: string, qrCodeUrl: string}>;
  verifyAndEnableTwoFactor: (code: string) => Promise<boolean>;
  disableTwoFactor: () => Promise<void>;
}

// Usuário de teste padrão
const DEFAULT_USER: User = {
  id: '1',
  email: 'user@certquest.com',
  name: 'Test User',
  role: 'user',
  photoURL: '',
  affiliate: {
    status: 'approved',
    earnings: 0,
    referrals: 0,
    link: 'https://certquest.com/ref/user123',
    applicationDate: '2025-05-11'
  },
  twoFactorAuth: {
    enabled: false,
    secret: ''
  }
};

// Administrador padrão
const ADMIN_USER: User = {
  id: 'admin1',
  email: 'admin@certquest.com',
  name: 'Administrador',
  role: 'admin',
  photoURL: '',
  affiliate: {
    status: null,
    earnings: 0,
    referrals: 0,
    link: ''
  },
  twoFactorAuth: {
    enabled: false,
    secret: ''
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => ({}),
  verifyTwoFactorCode: async () => false,
  signUp: async () => {},
  signOut: () => {},
  isAdmin: () => false,
  updateUserProfile: () => {},
  setupTwoFactor: async () => ({ secret: '', qrCodeUrl: '' }),
  verifyAndEnableTwoFactor: async () => false,
  disableTwoFactor: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingTwoFactorAuth, setPendingTwoFactorAuth] = useState<{email: string, password: string, rememberMe: boolean} | null>(null);
  const [tempTwoFactorSecret, setTempTwoFactorSecret] = useState<string>('');

  // Carregar usuário do localStorage ou sessionStorage quando o componente é montado
  useEffect(() => {
    // Verificar primeiro no localStorage (lembrar-me ativado)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('user');
      }
      return;
    }
    
    // Se não encontrou no localStorage, verificar no sessionStorage (lembrar-me desativado)
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      try {
        const parsedUser = JSON.parse(sessionUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar usuário do sessionStorage:', error);
        sessionStorage.removeItem('user');
      }
    }
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    try {
      // Usar o serviço de autenticação para fazer login
      const newUser = await authService.signIn(email, password);
      
      // Verificar se o usuário tem 2FA ativado
      if (newUser.twoFactorAuth?.enabled) {
        // Armazenar credenciais temporariamente para verificação de 2FA
        setPendingTwoFactorAuth({ email, password, rememberMe });
        return { requiresTwoFactor: true };
      }
      
      // Converter para o formato User do contexto
      const contextUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        affiliate: newUser.affiliate || {
          status: null,
          earnings: 0,
          referrals: 0,
          link: ''
        },
        photoURL: newUser.photoURL,
        twoFactorAuth: newUser.twoFactorAuth || {
          enabled: false,
          secret: ''
        }
      };
      
      setUser(contextUser);
      
      // Armazenar dados do usuário baseado na opção "Lembrar-me"
      if (rememberMe) {
        // Armazenar no localStorage (persistente mesmo após fechar o navegador)
        localStorage.setItem('user', JSON.stringify(contextUser));
        // Limpar sessionStorage para evitar duplicação
        sessionStorage.removeItem('user');
      } else {
        // Armazenar no sessionStorage (dura apenas durante a sessão do navegador)
        sessionStorage.setItem('user', JSON.stringify(contextUser));
        // Limpar localStorage para evitar duplicação
        localStorage.removeItem('user');
      }
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      // Redirecionar com base no papel do usuário
      if (contextUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Usar o serviço de autenticação para registrar o usuário
      const newUser = await authService.signUp(email, password, name);
      
      // Converter para o formato User do contexto
      const contextUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        affiliate: newUser.affiliate || {
          status: null,
          earnings: 0,
          referrals: 0,
          link: ''
        },
        photoURL: newUser.photoURL,
        twoFactorAuth: newUser.twoFactorAuth || {
          enabled: false,
          secret: ''
        }
      };
      
      setUser(contextUser);
      
      // Armazenar no sessionStorage (sessão temporária)
      sessionStorage.setItem('user', JSON.stringify(contextUser));
      
      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo ao CertQuest Arena!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Usar o serviço de autenticação para fazer logout
      await authService.signOut();
      
      // Limpar o estado do usuário
      setUser(null);
      
      // Limpar dados do usuário de ambos os storages
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar os dados locais
      setUser(null);
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      navigate('/');
    }
  };

  const isAdmin = () => user?.role === 'admin';

  // Função para verificar o código de 2FA
  const verifyTwoFactorCode = async (code: string): Promise<boolean> => {
    if (!pendingTwoFactorAuth) {
      toast({
        title: "Erro",
        description: "Nenhuma autenticação pendente.",
        variant: "destructive"
      });
      return false;
    }

    // Aqui você verificaria o código TOTP com o backend
    // Para este exemplo, vamos apenas simular a verificação
    const isValid = code === '123456'; // Simulação - em produção, use uma biblioteca TOTP

    if (isValid) {
      // Continuar o processo de login
      const { email, password, rememberMe } = pendingTwoFactorAuth;
      
      if (email === 'user@certquest.com') {
        setUser(DEFAULT_USER);
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(DEFAULT_USER));
          sessionStorage.removeItem('user');
        } else {
          sessionStorage.setItem('user', JSON.stringify(DEFAULT_USER));
          localStorage.removeItem('user');
        }
        navigate('/dashboard');
      } else if (email === 'admin@certquest.com') {
        setUser(ADMIN_USER);
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(ADMIN_USER));
          sessionStorage.removeItem('user');
        } else {
          sessionStorage.setItem('user', JSON.stringify(ADMIN_USER));
          localStorage.removeItem('user');
        }
      }
      
      // Limpar o estado pendente
      setPendingTwoFactorAuth(null);
      
      toast({
        title: "Login realizado com sucesso",
        description: "Verificação de dois fatores concluída.",
      });
      
      return true;
    } else {
      toast({
        title: "Código inválido",
        description: "O código de verificação não é válido ou expirou.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Função para configurar 2FA
  const setupTwoFactor = async (): Promise<{secret: string, qrCodeUrl: string}> => {
    // Gerar um segredo aleatório de 20 caracteres (base32)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 20; i++) {
      secret += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    setTempTwoFactorSecret(secret);
    
    // Gerar URL para QR code
    const qrCodeUrl = `otpauth://totp/CertQuest:${user?.email}?secret=${secret}&issuer=CertQuest`;
    
    return { secret, qrCodeUrl };
  };
  
  // Função para verificar e ativar 2FA
  const verifyAndEnableTwoFactor = async (code: string): Promise<boolean> => {
    if (!tempTwoFactorSecret || !user) {
      toast({
        title: "Erro",
        description: "Nenhuma configuração de 2FA em andamento.",
        variant: "destructive"
      });
      return false;
    }
    
    // Aqui você verificaria o código TOTP com o backend
    // Para este exemplo, vamos apenas simular a verificação
    const isValid = code === '123456'; // Simulação - em produção, use uma biblioteca TOTP
    
    if (isValid) {
      // Atualizar o usuário com 2FA ativado
      const updatedUser = {
        ...user,
        twoFactorAuth: {
          enabled: true,
          secret: tempTwoFactorSecret
        }
      };
      
      setUser(updatedUser);
      
      // Atualizar no storage
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Limpar o segredo temporário
      setTempTwoFactorSecret('');
      
      toast({
        title: "2FA Ativado",
        description: "A autenticação de dois fatores foi ativada com sucesso.",
      });
      
      return true;
    } else {
      toast({
        title: "Código inválido",
        description: "O código de verificação não é válido ou expirou.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Função para desativar 2FA
  const disableTwoFactor = async (): Promise<void> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive"
      });
      return;
    }
    
    // Atualizar o usuário com 2FA desativado
    const updatedUser = {
      ...user,
      twoFactorAuth: {
        enabled: false,
        secret: ''
      }
    };
    
    setUser(updatedUser);
    
    // Atualizar no storage
    if (localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    if (sessionStorage.getItem('user')) {
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    toast({
      title: "2FA Desativado",
      description: "A autenticação de dois fatores foi desativada com sucesso.",
    });
  };
  
  // Função para atualizar o perfil do usuário
  const updateUserProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    // Atualizar no storage
    if (localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    if (sessionStorage.getItem('user')) {
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        verifyTwoFactorCode,
        signUp,
        signOut,
        isAdmin,
        updateUserProfile,
        setupTwoFactor,
        verifyAndEnableTwoFactor,
        disableTwoFactor
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
