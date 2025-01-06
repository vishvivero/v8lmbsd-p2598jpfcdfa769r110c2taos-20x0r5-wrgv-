import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/lib/auth';

export function useTrackVisit() {
  const { user } = useAuth();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Get visitor ID from localStorage or create a new one
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = uuidv4();
          localStorage.setItem('visitor_id', visitorId);
        }

        // Initialize visit data with basic info
        const visitData = {
          visitor_id: visitorId,
          is_authenticated: !!user,
          user_id: user?.id,
        };

        try {
          // Attempt to get IP info and geolocation data
          const response = await fetch('https://ipapi.co/json/', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors',
            timeout: 5000 // 5 second timeout
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log("Location data fetched:", data);
            
            // Add location data if available
            Object.assign(visitData, {
              ip_address: data.ip,
              country: data.country_name,
              city: data.city,
              latitude: data.latitude,
              longitude: data.longitude,
            });
          } else {
            console.log("Could not fetch location data, continuing without it");
          }
        } catch (geoError) {
          // Log the geolocation error but continue with the visit tracking
          console.log("Geolocation fetch failed:", geoError);
        }

        // Insert visit data into Supabase
        const { error: insertError } = await supabase
          .from('website_visits')
          .insert([visitData]);

        if (insertError) {
          console.error('Error tracking visit:', insertError);
        }
      } catch (error) {
        console.error('Error in visit tracking:', error);
      }
    };

    trackVisit();
  }, [user]);
}