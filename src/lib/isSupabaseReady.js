import { supabase } from './supabase';

export default function isSupabaseReady() {
    return Boolean(supabase);
}
