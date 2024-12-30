import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AuthForm } from "@/components/AuthForm";
import { useNavigate } from "react-router-dom";

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

  const handleSignOut = async () => {
    console.log("Attempting to sign out");
    try {
      // Clear any remaining session data from local storage first
      const projectUrl = "https://cfbleqfvxyosenezksbc.supabase.co";
      const storageKey = `sb-${projectUrl.split('//')[1].split('.')[0]}-auth-token`;
      localStorage.removeItem(storageKey);
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        // If we get a session_not_found error, we can ignore it as the session is already gone
        if (error.message !== "session_not_found") {
          toast({
            title: "Error",
            description: "There was an issue signing out. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Show success message and redirect
      toast({
        title: "Signed out",
        description: "Successfully signed out of your account.",
      });
      
      // Use window.location.href for a full page refresh to clear any remaining state
      window.location.href = '/';
      
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
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