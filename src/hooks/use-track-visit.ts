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
        
        // Create an AbortController instance
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch("https://api.ipapi.com/api/check?access_key=c4c5c70b815332a0704568b974dca160", {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }

        const data = await response.json();
        console.log("Location data:", data);

        const { error } = await supabase.from("website_visits").insert([
          {
            visitor_id: crypto.randomUUID(),
            ip_address: data.ip,
            country: data.country_name,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
            is_authenticated: !!user,
            user_id: user?.id,
          },
        ]);

        if (error) {
          console.error("Error tracking visit:", error);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request timed out');
        } else {
          console.error("Error in trackVisit:", error);
        }
      }
    };

    trackVisit();
  }, [location.pathname, user]);
}