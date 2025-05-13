
// middleware.ts
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const supabase = await createSupabaseServerClient();

  // Sessiyani tekshirish
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error("Middleware getSession error:", sessionError);
  }
  if (session) {
    await supabase.auth.refreshSession();
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Middleware getUser error:", error);
  }

  // Faqat /admin sahifasi uchun autentifikatsiya tekshiruvi
  if (req.nextUrl.pathname.startsWith("/admin") && !user) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirected", "true");
    redirectUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Boshqa sahifalar uchun hech qanday cheklov yo‘q
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
  matcher: ["/admin/:path*"], // Faqat /admin uchun ishlaydi
};