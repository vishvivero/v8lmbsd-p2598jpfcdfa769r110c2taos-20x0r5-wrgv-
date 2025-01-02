import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  session: null, 
  loading: true,
  signOut: async () => {} 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      // Clear local storage
      localStorage.clear();
      
      // Redirect to home page
      window.location.href = window.location.origin;
      
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    let mounted = true;

    const setupSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
          throw error;
        }
        
        console.log("Initial session state:", {
          sessionExists: !!initialSession,
          userId: initialSession?.user?.id
        });
        
        if (mounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in setupSession:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    setupSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", {
          event,
          userId: currentSession?.user?.id,
          sessionExists: !!currentSession
        });
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};