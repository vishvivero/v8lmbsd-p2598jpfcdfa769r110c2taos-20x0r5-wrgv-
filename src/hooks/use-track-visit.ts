import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const useTrackVisit = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        console.log("Starting visit tracking for path:", location.pathname);
        console.log("Current user:", { user });

        // Generate a unique visitor ID
        const visitorId = crypto.randomUUID();
        
        // Clean the path by removing any trailing slashes
        const cleanPath = location.pathname.replace(/\/$/, '');
        
        const { error } = await supabase
          .from("website_visits")
          .insert([
            {
              visitor_id: visitorId,
              is_authenticated: !!user,
              user_id: user?.id,
              path: cleanPath || '/' // Ensure we always have a valid path
            },
          ]);

        if (error) {
          console.error("Error tracking visit:", error);
          return;
        }

        console.log("Successfully tracked visit");
      } catch (error) {
        console.error("Failed to track visit:", error);
      }
    };

    // Only track visits if we have a valid pathname
    if (location.pathname) {
      trackVisit();
    }
  }, [location.pathname, user]);
};