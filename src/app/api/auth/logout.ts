// app/api/auth/logout/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll() {
          // Bo'sh qoldiriladi
        },
      },
    }
  );

  await supabase.auth.signOut();

  const response = NextResponse.json({ message: 'Logged out' });
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL!.split('.')[0].replace('https://', '');
  response.cookies.delete(`sb-${projectId}-access-token`);
  response.cookies.delete(`sb-${projectId}-refresh-token`);
  return response;
}