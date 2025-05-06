
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { supabase, Profile, getProfile, updateProfile } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

// Extended user interface that includes profile data
interface AuthUser extends SupabaseUser {
  name?: string;
  photo?: string;
  email?: string;
  planType?: string;
  attemptsLeft?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  updateUserProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isAdmin: () => false,
  updateUserProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Função para buscar o perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      const profile = await getProfile(userId);
      setProfile(profile);
      
      // Update our AuthUser with profile data
      if (user) {
        setUser({
          ...user,
          name: profile.name,
          photo: profile.photo_url,
          planType: profile.plan_type,
          attemptsLeft: profile.attempts_left
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar seus dados.",
        variant: "destructive"
      });
    }
  };

  // Efeito para monitorar mudanças na autenticação
  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) {
        await fetchProfile(data.user.id);
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erro ao fazer login",
        description: authError.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Criar perfil inicial
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: data.user.id,
              name,
              plan_type: 'free',
              attempts_left: 1,
            },
          ])
          .select()
          .single();

        if (profileError) throw profileError;
        setProfile(profile);

        toast({
          title: "Conta criada com sucesso",
          description: "Verifique seu email para confirmar o cadastro.",
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erro ao criar conta",
        description: authError.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erro ao fazer logout",
        description: authError.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const isAdmin = () => {
    return profile?.plan_type === 'enterprise';
  };

  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const updatedProfile = await updateProfile(user.id, updates);
      setProfile(updatedProfile);
      
      // Update the user object with new profile data if relevant
      setUser(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          name: updates.name || prev.name,
          photo: updates.photo_url || prev.photo
        };
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar suas informações.",
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
