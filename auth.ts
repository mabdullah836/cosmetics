import { createClient } from '@/lib/supabase/server';

export const auth = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ? { user, access_token: '', refresh_token: '', expires_at: 0 } : null;
};
