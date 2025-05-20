
// src/app/admin/actions.ts
"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function addBook(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const description = formData.get("description") as string;
  const phone_number = formData.get("phone_number") as string;
  const region = formData.get("region") as string;
  const district = formData.get("district") as string;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("Supabase getUser error:", userError);
    throw new Error("Foydalanuvchi topilmadi");
  }

  const { error } = await supabase.from("books").insert({
    title,
    author,
    description,
    phone_number,
    region,
    district,
    created_by: user.id,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error("Kitob qo‘shishda xatolik: " + error.message);
  }

  // 4 sekund kutish
  await new Promise((resolve) => setTimeout(resolve, 4000));

  redirect("/books");
}