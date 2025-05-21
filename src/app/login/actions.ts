

// app/login/actions.ts
'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return redirect('/login?error=' + encodeURIComponent('Email va parol kiritilishi shart'));
  }

  // Avval mavjud sessiyani tozalaymiz
  await supabase.auth.signOut();

  // Login qilamiz
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(error.message));
  }

  // Sessiyani tekshiramiz
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return redirect('/login?error=' + encodeURIComponent('Login muvaffaqiyatli, lekin sessiya yaratilmadi'));
  }

  // Muvaffaqiyatli login bo‘lsa, admin sahifasiga yo‘naltiramiz
  return redirect('/admin');
}

export async function signup(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return redirect('/register?error=' + encodeURIComponent('Email va parol kiritilishi shart'));
  }

  // Avval mavjud sessiyani tozalaymiz
  await supabase.auth.signOut();

  // Ro‘yxatdan o‘tkazamiz
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return redirect('/register?error=' + encodeURIComponent(error.message));
  }

  // Sessiyani tekshiramiz
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return redirect('/register?error=' + encodeURIComponent('Ro‘yxatdan o‘tish muvaffaqiyatli, lekin sessiya yaratilmadi'));
  }

  // Muvaffaqiyatli ro‘yxatdan o‘tgan bo‘lsa, admin sahifasiga yo‘naltiramiz
  // return redirect('/admin'); // eski
  // window.location.href = '/admin'; // Bu qator server actionda ishlamaydi, faqat clientda ishlaydi
  return redirect('/admin');
}