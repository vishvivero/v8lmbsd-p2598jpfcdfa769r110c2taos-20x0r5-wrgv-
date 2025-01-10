import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cfbleqfvxyosenezksbc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYmxlcWZ2eHlvc2VuZXprc2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzODA2MzAsImV4cCI6MjA1MDk1NjYzMH0.07OE-Q6r8sxtngGpzcJwG_bbf8mGNIRr51MEDE2EKFg";

// Create the Supabase client with additional options
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

// Add auth state change listener for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', {
    event,
    userId: session?.user?.id,
    sessionExists: !!session
  });
});