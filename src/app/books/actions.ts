
// src/app/books/actions.ts
"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteBook(bookId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("books").delete().eq("id", bookId);
  if (error) {
    throw new Error("Kitob o‘chirishda xatolik: " + error.message);
  }
  revalidatePath("/books");
}