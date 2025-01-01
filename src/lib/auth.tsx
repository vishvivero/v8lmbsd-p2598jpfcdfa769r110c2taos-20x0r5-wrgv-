import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  session: null, 
  loading: true 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    let mounted = true;

    const setupSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
          toast({
            title: "Authentication Error",
            description: "There was a problem connecting to the authentication service. Please try again.",
            variant: "destructive"
          });
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
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
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