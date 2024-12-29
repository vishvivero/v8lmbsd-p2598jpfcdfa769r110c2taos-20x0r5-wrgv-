import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const AuthButtons = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    console.log("Attempting to sign out");
    try {
      // First attempt to sign out from Supabase
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

      // Clear any remaining session data from local storage
      const projectUrl = "https://cfbleqfvxyosenezksbc.supabase.co";
      const storageKey = `sb-${projectUrl.split('//')[1].split('.')[0]}-auth-token`;
      localStorage.removeItem(storageKey);
      
      // Redirect and show success message
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
        <Link to="/planner">
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
};