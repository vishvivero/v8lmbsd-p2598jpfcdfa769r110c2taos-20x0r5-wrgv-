import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "./header/Navigation";
import { AuthButtons } from "./header/AuthButtons";
import { Loader2, Cog } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isPlannerPage = location.pathname === '/planner';

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("No user ID available for profile fetch");
        return null;
      }
      
      console.log("Fetching profile for user:", user.id);
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        throw fetchError;
      }

      console.log("Profile data fetched:", existingProfile);
      return existingProfile;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  console.log("Auth and profile state:", {
    isAuthenticated: !!user,
    userId: user?.id,
    profileLoading,
    hasProfile: !!profile,
    isAdmin: profile?.is_admin,
    profileData: profile
  });

  const handleAuthSuccess = async () => {
    console.log("Auth success handler triggered");
    
    // Invalidate and refetch all relevant queries
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    await queryClient.invalidateQueries({ queryKey: ["debts"] });
    
    toast({
      title: "Welcome! 👋",
      description: "Successfully signed in. Let's start planning your debt-free journey!",
    });
    
    navigate("/planner");
  };

  return (
    <header className="fixed top-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-end h-16">
          <div className="flex items-center gap-4">
            {user && profileLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : user && profile?.is_admin ? (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                <Cog className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            ) : null}
            <AuthButtons 
              user={user} 
              profile={profile} 
              onAuthSuccess={handleAuthSuccess} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;