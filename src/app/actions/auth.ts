// app/actions/auth.ts
'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function handleLogin(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return redirect('/login?error=' + encodeURIComponent('Email va parol kiritilishi shart'));
  }

  // Avval mavjud sessiyani tozalaymiz
  await supabase.auth.signOut();

  // Login qilamiz
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !session) {
    console.error('Login error:', error?.message || 'No session');
    return redirect('/login?error=' + encodeURIComponent(error?.message || 'Login muvaffaqiyatsiz'));
  }

  // Sessiyani yangilash va cookie'larni dinamik tarzda o‘rnatish
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL!.split('.')[0].replace('https://', '');
  const cookieStore = await cookies();

  cookieStore.set(`sb-${projectId}-access-token`, session.access_token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 hafta
  });

  cookieStore.set(`sb-${projectId}-refresh-token`, session.refresh_token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 hafta
  });

  console.log('Login successful, redirecting to admin');
  return redirect('/admin');
}