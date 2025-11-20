import { createClient } from '@supabase/supabase-js';

// These will be loaded from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Export the client to use throughout the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

