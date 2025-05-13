
// src/app/books/actions.ts
"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function deleteBook(bookId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("Supabase getUser error:", userError);
    throw new Error("Foydalanuvchi topilmadi");
  }

  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", bookId)
    .eq("created_by", user.id);

  if (error) {
    console.error("Supabase delete error:", error);
    throw new Error("Kitobni o‘chirishda xatolik: " + error.message);
  }

  redirect("/books");
}