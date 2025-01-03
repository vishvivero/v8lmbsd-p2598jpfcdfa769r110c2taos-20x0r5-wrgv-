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
    
    // First clear all local state
    queryClient.clear();
    localStorage.clear(); // Clear all localStorage items to ensure complete cleanup
    
    try {
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only clear local session
      });
      
      if (error) {
        console.log("Sign out error:", error);
        // Continue with cleanup regardless of error
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
      // Still proceed with navigation even if there's an error
      navigate("/");
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