import { supabase } from '@/src/lib/supabase';

type SignInInput = {
  email: string;
  password: string;
};

export async function signIn({ email, password }: SignInInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}