import { supabase } from "../lib/supabase";

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function signupUser({
  fullName,
  email,
  password,
}: SignupData) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function loginUser({
  email,
  password,
}: LoginData) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}