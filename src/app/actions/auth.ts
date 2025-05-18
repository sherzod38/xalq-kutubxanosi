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

  // Keyin login qilamiz
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
    return redirect('/login?error=' + encodeURIComponent(error.message));
  }

  // Sessiyani tekshiramiz
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    console.error('Login session error:', sessionError?.message || 'No session');
    return redirect('/login?error=' + encodeURIComponent('Login muvaffaqiyatli, lekin sessiya yaratilmadi'));
  }

  // Cookie'larni qo'lda o'rnatamiz - bu yerda await kerak emas
  const cookieStore = await cookies();
  cookieStore.set('sb-access-token', session.access_token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 3600 // 1 soat
  });
  
  cookieStore.set('sb-refresh-token', session.refresh_token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 3600 // 1 hafta
  });

  console.log('Login successful, redirecting to admin');
  return redirect('/admin');
}