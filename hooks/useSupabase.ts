import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SPB_URL;
const supabaseAnonKey = process.env.REACT_APP_SPB_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
