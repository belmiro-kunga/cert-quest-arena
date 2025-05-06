
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, AuthError, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase, Profile, getProfile, updateProfile } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

// Extended user interface that includes profile data
interface AuthUser extends SupabaseUser {
  name?: string;
  photo?: string;
  email?: string;
  planType?: string;
  attemptsLeft?: number;
  role?: 'admin' | 'user';
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    user: SupabaseUser | null;
    session: Session | null;
  } | undefined>;
  signUp: (email: string, password: string, name: string) => Promise<{
    user: SupabaseUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  // Usuários provisórios para desenvolvimento local
  const mockUsers = {
    admin: {
      user: {
        id: 'mock-admin-id',
        email: 'admin@certquest.com',
        role: 'admin',
        name: 'Administrador',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as AuthUser,
      profile: {
        id: 'mock-profile-id',
        user_id: 'mock-admin-id',
        name: 'Administrador',
        plan_type: 'enterprise',
        attempts_left: 999,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Profile
    },
    regular: {
      user: {
        id: 'mock-user-id',
        email: 'user@certquest.com',
        role: 'user',
        name: 'Usuário Regular',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as AuthUser,
      profile: {
        id: 'mock-user-profile-id',
        user_id: 'mock-user-id',
        name: 'Usuário Regular',
        plan_type: 'free',
        attempts_left: 3,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Profile
    }
  };
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Função para buscar o perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const profile = await getProfile(userId);
      console.log("Profile data received:", profile);
      setProfile(profile);
      
      // Update our AuthUser with profile data
      if (user) {
        setUser({
          ...user,
          name: profile.name,
          photo: profile.photo_url,
          planType: profile.plan_type,
          attemptsLeft: profile.attempts_left,
          role: profile.role
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

  // Handle auth state change
  const handleAuthChange = (event: AuthChangeEvent, session: Session | null) => {
    console.log("Auth state changed:", event, session ? "Session exists" : "No session");
    setSession(session);
    
    if (session?.user) {
      setUser(session.user as AuthUser);
      // Use setTimeout to avoid potential Supabase client deadlock
      setTimeout(() => {
        fetchProfile(session.user.id);
      }, 0);
    } else {
      setUser(null);
      setProfile(null);
    }
    
    setLoading(false);
  };

  // Efeito para monitorar mudanças na autenticação
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    // Check current session next
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session ? "Session exists" : "No session");
        
        // Don't call handleAuthChange directly to avoid duplication
        // The onAuthStateChange will handle this
        if (session && session.user && !user) {
          setSession(session);
          setUser(session.user as AuthUser);
          fetchProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error getting initial session:", error);
        setLoading(false);
      }
    };
    
    getInitialSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Verifica se é um dos usuários provisórios
      const mockCredentials = {
        'admin@certquest.com': { password: 'admin123', type: 'admin' },
        'user@certquest.com': { password: 'user123', type: 'regular' }
      };

      const userType = mockCredentials[email as keyof typeof mockCredentials];
      if (userType && userType.password === password) {
        const mockUser = mockUsers[userType.type as keyof typeof mockUsers];
        setUser(mockUser.user);
        setProfile(mockUser.profile);
        setSession({ user: mockUser.user } as Session);
        return { user: mockUser.user, session: { user: mockUser.user } as Session };
      }

      // Tenta autenticar com o Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // onAuthStateChange will handle setting user and profile
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      return data;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Login error:", authError);
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
      console.log("Signing up user:", email, name);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        console.log("User created:", data.user.id);
        // Create initial profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: data.user.id,
              name,
              plan_type: 'free',
              attempts_left: 3,
              role: 'user'
            },
          ])
          .select()
          .single();

        if (profileError) throw profileError;
        console.log("Profile created:", profile);
        setProfile(profile);

        toast({
          title: "Conta criada com sucesso",
          description: "Verifique seu email para confirmar o cadastro.",
        });
        
        return data;
      } else {
        throw new Error("Falha ao criar usuário");
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error("Signup error:", authError);
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
      console.log("Signing out user");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error) {
      const authError = error as AuthError;
      console.error("Logout error:", authError);
      toast({
        title: "Erro ao fazer logout",
        description: authError.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const isAdmin = () => {
    return profile?.role === 'admin' || profile?.plan_type === 'enterprise' || user?.email === 'admin@certquest.com';
  };

  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      console.log("Updating profile:", updates);
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
      console.error("Profile update error:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
      throw error;
    }
  };

  console.log("Auth context current state:", { user: user?.id || "none", isAdmin: isAdmin() });

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
