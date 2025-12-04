import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

const SUPABASE_URL: string = 'https://tyxocbfwkcsaqvzkhpwk.supabase.co'; 
const SUPABASE_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eG9jYmZ3a2NzYXF2emtocHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NzQyMTUsImV4cCI6MjA4MDE1MDIxNX0.ufnw7U_Ni7pwWnA6OBgaYlapOxOuBN4kqXmMLj_TOhk';

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper to check if supabase is configured
export const isSupabaseConfigured = () => {
  return SUPABASE_URL.includes('supabase.co') && 
         SUPABASE_KEY.length > 20;
};