import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfbleqfvxyosenezksbc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYmxlcWZ2eHlvc2VuZXprc2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ5MTc4NDQsImV4cCI6MjAyMDQ5Mzg0NH0.O2_NQhUNkK5LVx-mzHYwJeY9p4RXhXcYcZMO_hs9W8k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Add console logging for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.info('Auth state changed:', {
    event,
    userId: session?.user?.id,
    sessionExists: !!session
  });
});