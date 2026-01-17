import { createClient } from '@/lib/supabase/server';

export const auth = async () => {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
