import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AuthForm } from "@/components/AuthForm";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface Profile {
  created_at: string;
  email: string;
  id: string;
  is_admin: boolean;
  monthly_payment: number;
  preferred_currency: string;
  updated_at: string;
}

interface AuthButtonsProps {
  user: User | null;
  profile: Profile | null;
  onAuthSuccess: () => void;
}

export const AuthButtons = ({ user, profile, onAuthSuccess }: AuthButtonsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    console.log("Starting sign out process");
    try {
      // First, clear all queries from the cache
      queryClient.clear();
      
      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // If we get a session_not_found error, we can consider the user already signed out
        if (error.message.includes('session_not_found')) {
          console.log("Session already expired, clearing local state");
          // Continue with local cleanup
        } else {
          console.error("Supabase sign out error:", error);
          throw error;
        }
      }
      
      console.log("Successfully signed out or session already expired");
      
      // Always perform these cleanup actions
      localStorage.removeItem('supabase.auth.token');
      queryClient.clear();
      
      toast({
        title: "Signed out",
        description: "Successfully signed out of your account.",
        duration: 5000,
      });
      
      // Navigate to home page
      navigate("/");
      
    } catch (error: any) {
      console.error("Unexpected error during sign out:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <Link to="/planner">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Sign In</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl p-8">
            <DialogHeader>
              <DialogTitle>Welcome Back</DialogTitle>
            </DialogHeader>
            <div className="mt-8">
              <AuthForm onSuccess={onAuthSuccess} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};