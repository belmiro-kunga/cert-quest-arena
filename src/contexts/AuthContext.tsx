
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  photo?: string;
  phone?: string;
  roles?: string[];
  planType?: string;
  attemptsLeft?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAdmin: () => false,
  updateUserProfile: () => {},
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
        // Save complete user data including all available fields
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser({
          ...data.user,
          planType: data.user.planType || 'Freemium',
          attemptsLeft: data.user.attemptsLeft || 1,
        });
      } else {
        setUser(null);
        localStorage.removeItem('userData');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('userData');
    }
  };

  // Chamada ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUserData = localStorage.getItem('userData');
    
    if (token) {
      // If we have cached user data, set it first for faster UI loading
      if (savedUserData) {
        try {
          const parsedUser = JSON.parse(savedUserData);
          setUser({
            ...parsedUser,
            planType: parsedUser.planType || 'Freemium',
            attemptsLeft: parsedUser.attemptsLeft || 1,
          });
        } catch (e) {
          // If parsing fails, ignore the saved data
        }
      }
      
      // Then fetch fresh data from server
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
    localStorage.removeItem('userData');
    setUser(null);
  };

  // Verifica se o usuário tem permissão de administrador
  const isAdmin = () => {
    return user?.roles?.includes('admin') || false;
  };
  
  // Update user profile data
  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
