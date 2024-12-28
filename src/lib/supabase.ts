import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cfbleqfvxyosenezksbc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYmxlcWZ2eHlvc2VuZXprc2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzODA2MzAsImV4cCI6MjA1MDk1NjYzMH0.07OE-Q6r8sxtngGpzcJwG_bbf8mGNIRr51MEDE2EKFg";

if (!supabaseUrl) {
  console.error('Supabase URL is missing');
  throw new Error('Supabase URL is required');
}

if (!supabaseAnonKey) {
  console.error('Supabase Anon Key is missing');
  throw new Error('Supabase Anon Key is required');
}

// Remove any trailing slashes from the URL
const formattedSupabaseUrl = supabaseUrl.replace(/\/$/, '');

export const supabase = createClient(formattedSupabaseUrl, supabaseAnonKey);