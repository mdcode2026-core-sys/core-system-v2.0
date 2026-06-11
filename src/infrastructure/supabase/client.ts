// src/infrastructure/supabase/client.ts
// Supabase client init with JWT claims injection (tenant_id, user_role)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Get current user with JWT claims
 */
export async function getCurrentUserWithClaims() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email,
    tenantId: user.user_metadata?.tenant_id as string,
    role: user.user_metadata?.user_role as string,
    fullName: user.user_metadata?.full_name as string,
  };
}
