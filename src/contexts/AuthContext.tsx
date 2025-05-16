import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface AffiliateInfo {
  status: 'pending' | 'approved' | 'rejected' | null;
  earnings: number;
  referrals: number;
  link: string;
  applicationDate?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  affiliate: AffiliateInfo;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  isAdmin: () => boolean;
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
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  isAdmin: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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
      // Simular verificação de credenciais
      if (email === 'user@certquest.com' && password === 'user123') {
        setUser(DEFAULT_USER);
        
        // Armazenar dados do usuário baseado na opção "Lembrar-me"
        if (rememberMe) {
          // Armazenar no localStorage (persistente mesmo após fechar o navegador)
          localStorage.setItem('user', JSON.stringify(DEFAULT_USER));
          // Limpar sessionStorage para evitar duplicação
          sessionStorage.removeItem('user');
        } else {
          // Armazenar no sessionStorage (dura apenas durante a sessão do navegador)
          sessionStorage.setItem('user', JSON.stringify(DEFAULT_USER));
          // Limpar localStorage para evitar duplicação
          localStorage.removeItem('user');
        }
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
        navigate('/dashboard');
      } else if (email === 'admin@certquest.com' && password === 'admin123') {
        setUser(ADMIN_USER);
        
        // Armazenar dados do administrador baseado na opção "Lembrar-me"
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(ADMIN_USER));
          sessionStorage.removeItem('user');
        } else {
          sessionStorage.setItem('user', JSON.stringify(ADMIN_USER));
          localStorage.removeItem('user');
        }
        
        toast({
          title: "Login administrativo realizado com sucesso",
          description: "Bem-vindo, Administrador!",
        });
        // Não redirecionar automaticamente - deixar o componente AdminLoginForm fazer isso
      } else {
        throw new Error('Email ou senha incorretos');
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
      // Simular criação de usuário
      const newUser: User = {
        ...DEFAULT_USER,
        id: Math.random().toString(),
        email,
        name,
      };
      
      setUser(newUser);
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

  const signOut = () => {
    setUser(null);
    // Limpar dados do usuário de ambos os storages
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate('/');
  };

  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
