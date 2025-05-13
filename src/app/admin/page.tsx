
// src/app/admin/page.tsx
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export async function addBook(formData: FormData) {
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

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  
  // Sessiyani yangilash
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    await supabase.auth.refreshSession();
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Yangi kitob qo‘shish</h1>
        <form action={addBook} className="w-full max-w-md space-y-4 animate-none">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Kitob nomi
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Kitob nomini kiriting"
              required
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Muallif
            </label>
            <Input
              id="author"
              name="author"
              type="text"
              placeholder="Muallif nomini kiriting"
              required
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Tavsif
            </label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Kitob tavsifini kiriting"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon raqami
            </label>
            <Input
              id="phone_number"
              name="phone_number"
              type="text"
              placeholder="Telefon raqamini kiriting"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Viloyat
            </label>
            <Input
              id="region"
              name="region"
              type="text"
              placeholder="Viloyatni kiriting"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
              Tuman
            </label>
            <Input
              id="district"
              name="district"
              type="text"
              placeholder="Tumanni kiriting"
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-none"
          >
            Kitob qo‘shish
          </Button>
        </form>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";