// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { useSession } from 'next-auth/react'

// Get these values from your Supabase project settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '');

