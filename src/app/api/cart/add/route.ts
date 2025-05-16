import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { book_id } = await request.json();
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Foydalanuvchi autentifikatsiya qilinmagan" }, { status: 401 });
    }

    if (!book_id) {
      return NextResponse.json({ error: "Book ID kiritilmagan" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("cart")
      .insert({ user_id: user.id, book_id })
      .select();

    if (error) {
      console.error("Cart add error:", error.message);
      return NextResponse.json({ error: "Savatchaga qo'shishda xatolik" }, { status: 500 });
    }

    console.log("Cart add result:", data);
    return NextResponse.json({ message: "Kitob savatchaga qo'shildi", data }, { status: 200 });
  } catch (err) {
    console.error("Cart add processing error:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}