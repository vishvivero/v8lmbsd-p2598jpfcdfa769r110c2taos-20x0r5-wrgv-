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

        let locationData = {
          ip: null,
          country_name: null,
          city: null,
          latitude: null,
          longitude: null
        };

        try {
          // Get IP info and geolocation data with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch('https://ipapi.co/json/', {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            locationData = await response.json();
            console.log("Location data fetched:", locationData);
          }
        } catch (error) {
          console.log("Could not fetch location data:", error);
          // Continue with the visit tracking even if location fetch fails
        }

        const { error: insertError } = await supabase
          .from('website_visits')
          .insert({
            visitor_id: visitorId,
            ip_address: locationData.ip,
            country: locationData.country_name,
            city: locationData.city,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            is_authenticated: !!user,
            user_id: user?.id,
          });

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