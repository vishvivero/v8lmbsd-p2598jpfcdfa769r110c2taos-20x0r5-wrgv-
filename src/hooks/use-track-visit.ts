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
        
        const { error } = await supabase
          .from("website_visits")
          .insert([
            {
              visitor_id: visitorId,
              is_authenticated: !!user,
              user_id: user?.id,
              // Add path information without any trailing slashes
              path: location.pathname.replace(/\/$/, '')
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