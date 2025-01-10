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
        
        const { error } = await supabase.from("website_visits").insert([
          {
            visitor_id: crypto.randomUUID(),
            is_authenticated: !!user,
            user_id: user?.id,
          },
        ]);

        if (error) {
          console.error("Error tracking visit:", error);
        }
      } catch (error) {
        console.error("Error in trackVisit:", error);
      }
    };

    trackVisit();
  }, [location.pathname, user]);
}