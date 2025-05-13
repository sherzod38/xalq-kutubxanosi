
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log("Middleware user:", user, "Error:", error);

  const protectedRoutes = ["/admin", "/books"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && (!user || error)) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirected", "true");
    return NextResponse.redirect(redirectUrl);
  }

  // Cookie’lar orqali sessiyani sinxronlashtirish
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const response = NextResponse.next();
    response.cookies.set("sb-access-token", session.access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    response.cookies.set("sb-refresh-token", session.refresh_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/books/:path*"],
};