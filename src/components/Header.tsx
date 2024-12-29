import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "./header/Navigation";
import { AuthButtons } from "./header/AuthButtons";
import { Loader2 } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
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
        .select("id, email, is_admin")
        .eq("id", user.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        throw fetchError;
      }

      if (!existingProfile) {
        console.log("No profile found, attempting to create one");
        
        // Check if this is the first user
        const { count, error: countError } = await supabase
          .from("profiles")
          .select("id", { count: 'exact', head: true });
          
        if (countError) {
          console.error("Error checking profiles count:", countError);
          throw countError;
        }

        const isFirstUser = count === 0;
        console.log("Is first user?", isFirstUser);

        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([{ 
            id: user.id, 
            email: user.email,
            is_admin: isFirstUser
          }])
          .select("id, email, is_admin")
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          throw createError;
        }

        console.log("New profile created:", newProfile);
        return newProfile;
      }

      console.log("Profile data fetched successfully:", existingProfile);
      return existingProfile;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  // Log profile loading state and error for debugging
  console.log("Profile loading state:", {
    isLoading: profileLoading,
    hasError: !!profileError,
    userId: user?.id,
    hasProfile: !!profile,
    isAdmin: profile?.is_admin,
    profileData: profile
  });

  const handleAuthSuccess = () => {
    toast({
      title: "Welcome! 👋",
      description: "Successfully signed in. Let's start planning your debt-free journey!",
    });
    navigate("/planner");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Debtfreeo</span>
            </Link>
            
            {!isPlannerPage && <Navigation />}
          </div>

          <div className="flex items-center gap-4">
            {user && profileLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : user && profile?.is_admin === true ? (
              <Link 
                to="/admin" 
                className="text-primary hover:text-primary/80 font-medium"
              >
                Admin Dashboard
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