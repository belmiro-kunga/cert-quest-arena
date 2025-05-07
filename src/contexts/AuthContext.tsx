
import React, { createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Profile, EnhancedUser } from '@/types/user';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface AuthContextType {
  user: EnhancedUser | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    user: any | null;
    session: Session | null;
  } | undefined>;
  signUp: (email: string, password: string, name: string) => Promise<{
    user: any | null;
    session: Session | null;
  } | undefined>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  updateUserProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signIn: async () => undefined,
  signUp: async () => undefined,
  signOut: async () => {},
  isAdmin: () => false,
  updateUserProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    user,
    profile,
    session,
    loading,
    signIn: supabaseSignIn,
    signUp: supabaseSignUp,
    signOut: supabaseSignOut,
    updateUserProfile,
    isAdmin,
  } = useSupabaseAuth();

  const signIn = async (email: string, password: string) => {
    try {
      const data = await supabaseSignIn(email, password);
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const data = await supabaseSignUp(email, password, name);

      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu email para confirmar o cadastro.",
      });
      
      return data;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabaseSignOut();
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      navigate('/');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile,
        session,
        loading, 
        signIn, 
        signUp, 
        signOut, 
        isAdmin, 
        updateUserProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
