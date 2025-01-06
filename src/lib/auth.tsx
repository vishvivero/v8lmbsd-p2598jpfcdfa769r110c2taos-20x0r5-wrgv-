import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  session: null, 
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    try {
      console.log("Auth provider: Starting sign out");
      
      // Clear local state first
      setUser(null);
      setSession(null);
      localStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Auth provider: Sign out error:", error);
      }
    } catch (error) {
      console.error("Auth provider: Critical error during sign out:", error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      console.log("Refreshing session...");
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        throw error;
      }
      
      if (currentSession) {
        console.log("Session refreshed successfully");
        setSession(currentSession);
        setUser(currentSession.user);
      } else {
        console.log("No active session found during refresh");
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Error in refreshSession:", error);
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (initialSession) {
            console.log("Initial session found:", initialSession.user.id);
            setSession(initialSession);
            setUser(initialSession.user);
          } else {
            console.log("No initial session found");
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
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, refreshSession }}>
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