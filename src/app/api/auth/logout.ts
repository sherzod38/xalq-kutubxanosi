import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  const response = NextResponse.json({ message: 'Logged out' });
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL!.split('.')[0].replace('https://', '');
  response.cookies.delete(`sb-${projectId}-access-token`);
  response.cookies.delete(`sb-${projectId}-refresh-token`);
  return response;
}