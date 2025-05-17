import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  adminSignIn: (email: string, password: string) => Promise<boolean>;
  adminSignOut: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  adminSignIn: async () => false,
  adminSignOut: () => {},
  isAuthenticated: false,
  loading: false,
  logout: () => {},
});

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Carregar usuário admin do localStorage quando o componente é montado
  useEffect(() => {
    setLoading(true);
    const storedAdminUser = localStorage.getItem('adminUser');
    if (storedAdminUser) {
      setAdminUser(JSON.parse(storedAdminUser));
    }
    setLoading(false);
  }, []);

  const adminSignIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Verificar credenciais do admin
      if (email === 'admin@certquest.com' && password === 'admin123') {
        const admin: AdminUser = {
          id: 'admin-id',
          email: 'admin@certquest.com',
          name: 'Administrador',
          role: 'admin',
        };
        setAdminUser(admin);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        toast({
          title: "Login administrativo bem-sucedido",
          description: "Bem-vindo ao painel administrativo!",
        });
        return true;
      }
    } catch (error) {
      setLoading(false);
    }
    toast({
      variant: "destructive",
      title: "Erro no login",
      description: "Credenciais administrativas inválidas.",
    });
    return false;
  };

  const adminSignOut = () => {
    setLoading(true);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    setLoading(false);
  };
  
  // Alias para adminSignOut para compatibilidade com o componente AdminLayout
  const logout = adminSignOut;

  // Verificar se o administrador está autenticado
  const isAuthenticated = !!adminUser;

  return (
    <AdminAuthContext.Provider value={{ adminUser, adminSignIn, adminSignOut, isAuthenticated, loading, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
export const useAdminAuth = () => useContext(AdminAuthContext);
