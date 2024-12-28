import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL environment variable is missing. Please add it to your .env file');
  throw new Error('Supabase URL is required. Check the console for more information.');
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY environment variable is missing. Please add it to your .env file');
  throw new Error('Supabase Anon Key is required. Check the console for more information.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);