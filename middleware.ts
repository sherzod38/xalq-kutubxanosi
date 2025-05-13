
// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string) {
          response.cookies.set({
            name,
            value,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        },
        remove(name: string) {
          response.cookies.set({
            name,
            value: "",
            expires: new Date(0),
            path: "/",
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // /books yoki /admin sahifalariga kirishda autentifikatsiyani tekshirish
  if (!user && (request.nextUrl.pathname.startsWith("/books") || request.nextUrl.pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/books/:path*", "/admin/:path*"],
};