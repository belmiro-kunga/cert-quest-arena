
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  photo?: string;
  roles?: string[]; // Adicionado campo de papéis para controle de acesso
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean; // Função para verificar se o usuário é admin
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAdmin: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados do usuário
  const fetchUser = async (token: string) => {
    try {
      const res = await fetch('http://localhost:3001/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // Chamada ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login: salva token e busca usuário
  const login = async (token: string) => {
    localStorage.setItem('token', token);
    await fetchUser(token);
  };

  // Logout: remove token e usuário
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Verifica se o usuário tem permissão de administrador
  const isAdmin = () => {
    return user?.roles?.includes('admin') || false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
