import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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

        // Get IP info and geolocation data
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        console.log("Location data fetched:", data);

        const { error } = await supabase
          .from('website_visits')
          .insert({
            visitor_id: visitorId,
            ip_address: data.ip,
            country: data.country_name,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
            is_authenticated: !!user,
            user_id: user?.id,
          });

        if (error) {
          console.error('Error tracking visit:', error);
        }
      } catch (error) {
        console.error('Error in visit tracking:', error);
      }
    };

    trackVisit();
  }, [user]);
}