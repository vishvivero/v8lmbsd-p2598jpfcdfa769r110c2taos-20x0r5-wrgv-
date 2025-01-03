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
    console.log("Auth provider: Starting sign out");
    try {
      // Clear local state first
      setUser(null);
      setSession(null);
      localStorage.removeItem('supabase.auth.token');
      
      try {
        const { error } = await supabase.auth.signOut();
        if (error && !error.message.includes('session_not_found')) {
          console.error("Auth provider: Non-session error during sign out:", error);
          throw error;
        }
      } catch (signOutError) {
        console.log("Auth provider: Sign out error (continuing with cleanup):", signOutError);
      }
    } catch (error) {
      console.error("Auth provider: Critical error during sign out:", error);
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = 
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error getting initial session:", sessionError);
          if (mounted) setLoading(false);
          return;
        }

        if (mounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
          }
          setLoading(false);
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log("Auth state changed:", {
              event,
              userId: currentSession?.user?.id,
              sessionExists: !!currentSession
            });

            if (mounted) {
              if (currentSession) {
                setSession(currentSession);
                setUser(currentSession.user);
              } else {
                setSession(null);
                setUser(null);
              }
              setLoading(false);
            }
          }
        );

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error in auth initialization:", error);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();
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