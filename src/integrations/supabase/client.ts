import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cfbleqfvxyosenezksbc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYmxlcWZ2eHlvc2VuZXprc2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzODA2MzAsImV4cCI6MjA1MDk1NjYzMH0.07OE-Q6r8sxtngGpzcJwG_bbf8mGNIRr51MEDE2EKFg";

// Create client with auto refresh token and persist session in local storage
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});