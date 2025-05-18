
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    // Sessiya ma'lumotlarini qayd qilamiz
    console.log("Middleware session:", session ? "Mavjud" : "Yo'q");
    if (session) {
      console.log("Session user:", session.user.email);
    }

    const protectedRoutes = ["/admin", "/books"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );

    // Agar himoyalangan sahifa bo'lsa va sessiya bo'lmasa, login sahifasiga yo'naltiramiz
    if (isProtectedRoute && !session) {
      console.log("Protected route access denied, redirecting to login");
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("redirected", "true");
      return NextResponse.redirect(redirectUrl);
    }

    // Sessiya mavjud bo'lsa, cookie'larni yangilaymiz
    if (session) {
      const response = NextResponse.next();
      
      // Cookie'larni o'rnatish
      response.cookies.set("sb-access-token", session.access_token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3600 // 1 soat
      });
      
      response.cookies.set("sb-refresh-token", session.refresh_token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 3600 // 1 hafta
      });
      
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/books/:path*"],
};