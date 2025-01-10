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
        console.log("Starting visit tracking for path:", location.pathname);
        console.log("Current user:", { user });
        
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
          return;
        }

        console.log("Successfully tracked visit");
      } catch (error: any) {
        console.error("Critical error during visit tracking:", error);
      }
    };

    trackVisit();
  }, [location.pathname, user]);
}