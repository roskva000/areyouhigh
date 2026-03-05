import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

if (!hasSupabaseConfig) {
    console.warn('Supabase environment variables are missing. Community features are disabled.');
}

export const supabase = hasSupabaseConfig
    ? createClient(supabaseUrl, supabaseKey)
    : null;
