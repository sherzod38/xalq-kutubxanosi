
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const supabase = await createSupabaseServerClient();

  // Sessiyani tekshirish va yangilash
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    await supabase.auth.refreshSession();
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  console.log("Middleware user:", user, "Error:", error);

  const protectedRoutes = ["/admin", "/books", "/book/:path*"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && (!user || error)) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirected", "true");
    return NextResponse.redirect(redirectUrl);
  }

  // Cookie’lar orqali sessiyani sinxronlashtirish
  const response = NextResponse.next();
  if (session) {
    response.cookies.set("sb-access-token", session.access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    response.cookies.set("sb-refresh-token", session.refresh_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/books/:path*", "/book/:path*"],
};