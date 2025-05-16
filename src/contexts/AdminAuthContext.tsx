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
  isAuthenticated: () => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  adminSignIn: async () => false,
  adminSignOut: () => {},
  isAuthenticated: () => false,
});

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const { toast } = useToast();

  // Carregar usuário admin do localStorage quando o componente é montado
  useEffect(() => {
    const storedAdminUser = localStorage.getItem('adminUser');
    if (storedAdminUser) {
      try {
        const parsedAdminUser = JSON.parse(storedAdminUser);
        setAdminUser(parsedAdminUser);
      } catch (error) {
        console.error('Erro ao carregar usuário admin do localStorage:', error);
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const adminSignIn = async (email: string, password: string) => {
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
    
    toast({
      variant: "destructive",
      title: "Erro no login",
      description: "Credenciais administrativas inválidas.",
    });
    return false;
  };

  const adminSignOut = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
    toast({
      title: "Logout administrativo",
      description: "Você saiu do painel administrativo.",
    });
  };

  const isAuthenticated = () => {
    return adminUser !== null;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminSignIn,
        adminSignOut,
        isAuthenticated,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
export const useAdminAuth = () => useContext(AdminAuthContext);

