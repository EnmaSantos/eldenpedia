import { createBrowserClient } from '@supabase/ssr';

// These will be loaded from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Export the client to use throughout the app
// Using createBrowserClient ensures cookies are set correctly for the server to read
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

