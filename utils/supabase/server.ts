import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// cookieStore ni ichida olish — parametr sifatida uzatilmaydi
export const createClient = async () => {
  const cookieStore = await cookies(); // bu async EMAS, to‘g‘ri ishlatilmoqda

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Array.from(cookieStore.getAll?.() ?? []);
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options as CookieOptions });
            });
          } catch {
            // Server Component ichida chaqirilgan bo‘lishi mumkin — xavfsiz e'tiborsiz qoldiriladi
          }
        },
      },
    }
  );
};
