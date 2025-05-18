// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, {
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 hafta
            path: '/',
          });
        },
        remove(name: string) {
          res.cookies.delete(name);
        },
      },
    }
  );

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error('Middleware getSession error:', sessionError?.message || 'No session');
  }

  if (session) {
    const { data: { session: updatedSession }, error: setSessionError } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
    if (setSessionError) {
      console.error('Middleware setSession error:', setSessionError.message);
    } else if (updatedSession) {
      console.log('Middleware: Session updated successfully');
      const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL!.split('.')[0].replace('https://', '');
      res.cookies.set(`sb-${projectId}-access-token`, updatedSession.access_token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      res.cookies.set(`sb-${projectId}-refresh-token`, updatedSession.refresh_token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }
  }

  if (req.nextUrl.pathname.startsWith('/admin') && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirected', 'true');
    redirectUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};