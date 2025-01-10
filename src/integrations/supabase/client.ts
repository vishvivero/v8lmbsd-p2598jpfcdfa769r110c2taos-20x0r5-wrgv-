import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfbleqfvxyosenezksbc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYmxlcWZ2eHlvc2VuZXprc2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ5MTc5MzUsImV4cCI6MjAyMDQ5MzkzNX0.ZPmEy_J1G2kF2GkZXGYlmHftQ4nWNYjvxoVH-_9VFYY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});