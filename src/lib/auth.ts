import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'doctor' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
}

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: {
        full_name: fullName,
      },
    },
  });
  
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get user role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
  
  // Get user profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('user_id', user.id)
    .single();
  
  return {
    id: user.id,
    email: user.email || '',
    role: (roleData?.role as UserRole) || 'user',
    fullName: profileData?.full_name || 'User',
  };
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  
  return data?.role as UserRole || null;
}

export async function updateUserRole(userId: string, role: UserRole) {
  const { error } = await supabase
    .from('user_roles')
    .update({ role })
    .eq('user_id', userId);
  
  if (error) throw error;
}
