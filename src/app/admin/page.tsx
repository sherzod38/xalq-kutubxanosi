
// src/app/admin/page.tsx
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  async function addBook(formData: FormData) {
    "use server";
    const supabase = await createSupabaseServerClient();
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const description = formData.get("description") as string;
    const phone_number = formData.get("phone_number") as string;
    const region = formData.get("region") as string;
    const district = formData.get("district") as string;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
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
      throw new Error("Kitob qo‘shishda xatolik: " + error.message);
    }

    redirect("/books");
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Kitob qo‘shish</h1>
      <form action={addBook} className="w-full max-w-md space-y-4">
        <Input name="title" placeholder="Kitob nomi" required />
        <Input name="author" placeholder="Muallif" required />
        <Input name="description" placeholder="Tavsif" required />
        <Input name="phone_number" placeholder="Telefon raqami" required />
        <Input name="region" placeholder="Viloyat" required />
        <Input name="district" placeholder="Tuman" required />
        <Button type="submit">Kitob qo‘shish</Button>
      </form>
    </main>
  );
}

export const dynamic = "force-dynamic";