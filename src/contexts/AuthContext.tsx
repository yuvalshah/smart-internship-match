import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  getUserType: () => 'student' | 'company' | 'admin' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Development mode - automatically set mock user for testing (only if no real user)
  useEffect(() => {
    // Check if we're in development mode and no user is logged in
    if (process.env.NODE_ENV === 'development' && !user && loading) {
      // Check if there's a real session first
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          // Only set mock user if no real session exists
          const mockUser = {
            id: '550e8400-e29b-41d4-a716-446655440000', // Proper UUID format
            email: 'tudj@gmail.com', // Use the email from the image
            user_metadata: {
              full_name: 'Radhe Shyam',
              user_type: 'student'
            },
            app_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as User;
          
          const mockSession = {
            user: mockUser,
            access_token: 'mock-token'
          } as Session;
          
          setUser(mockUser);
          setSession(mockSession);
          setLoading(false);
        }
      });
    }
  }, [user, loading]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link.",
      });
    }
    
    return { error };
  };

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Clear localStorage data on logout
      if (user) {
        localStorage.removeItem(`student_profile_${user.id}`);
      }
      
      toast({
        title: "Goodbye!",
        description: "You have been signed out.",
      });
    }
    
    return { error };
  };

  const getUserType = (): 'student' | 'company' | 'admin' | null => {
    if (!user) return null;
    
    // This can be determined by checking which table the user exists in
    // For now, we'll use user metadata or a default
    return user.user_metadata?.user_type || 'student';
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    getUserType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};