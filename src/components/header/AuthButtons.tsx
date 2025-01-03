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
      // First clear all local state
      queryClient.clear();
      localStorage.removeItem('supabase.auth.token');
      
      try {
        // Attempt to sign out from Supabase
        const { error } = await supabase.auth.signOut();
        if (error && !error.message.includes('session_not_found')) {
          console.error("Non-session error during sign out:", error);
          throw error;
        }
      } catch (signOutError) {
        // If it's not a session_not_found error, log it but continue with cleanup
        console.log("Sign out error (continuing with cleanup):", signOutError);
      }

      console.log("Proceeding with navigation and UI updates");
      
      // Show success message
      toast({
        title: "Signed out",
        description: "Successfully signed out of your account.",
        duration: 5000,
      });
      
      // Navigate to home page
      navigate("/");
      
    } catch (error: any) {
      console.error("Critical error during sign out:", error);
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