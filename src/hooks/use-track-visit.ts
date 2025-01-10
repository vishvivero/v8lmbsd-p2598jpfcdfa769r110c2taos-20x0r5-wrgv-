import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function useTrackVisit() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        console.log("Tracking visit for path:", location.pathname);
        console.log("Current user:", user?.id);
        
        const { error } = await supabase.from("website_visits").insert([
          {
            visitor_id: crypto.randomUUID(),
            is_authenticated: !!user,
            user_id: user?.id,
          },
        ]);

        if (error) {
          console.error("Error tracking visit:", error);
          console.error("Error details:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
        } else {
          console.log("Visit tracked successfully");
        }
      } catch (error) {
        console.error("Error in trackVisit:", error);
      }
    };

    trackVisit();
  }, [location.pathname, user]);
}