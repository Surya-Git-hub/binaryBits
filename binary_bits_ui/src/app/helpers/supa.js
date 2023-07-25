import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_PROJECT_ANON_KEY);