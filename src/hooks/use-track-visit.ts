import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export function useTrackVisit() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const trackVisit = async () => {
      console.info('Starting visit tracking for path:', location.pathname);

      try {
        const { data, error } = await supabase
          .from('website_visits')
          .insert([
            {
              visitor_id: user?.id || 'anonymous',
              path: location.pathname,
              is_authenticated: !!user,
              user_id: user?.id
            }
          ]);

        if (error) {
          console.error('Error tracking visit:', error);
          return;
        }

        console.info('Successfully tracked visit');
      } catch (error) {
        console.error('Error in visit tracking:', error);
      }
    };

    trackVisit();
  }, [location.pathname, user]);
}