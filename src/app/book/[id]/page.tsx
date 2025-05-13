
// src/app/book/[id]/page.tsx
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";

export default async function BookPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  
  // Kitobni olish
  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !book) {
    console.error("Book fetch error:", error);
    notFound();
  }

  // Foydalanuvchi tekshiruvi (faqat DeleteButton uchun)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Book getUser error:", authError);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
        <p className="text-gray-600 mb-2">Muallif: {book.author}</p>
        <p className="mb-2">Tavsif: {book.description || "Yo‘q"}</p>
        <p className="mb-2">Telefon: {book.phone_number || "Yo‘q"}</p>
        <p className="mb-2">Viloyat: {book.region || "Yo‘q"}</p>
        <p className="mb-4">Tuman: {book.district || "Yo‘q"}</p>
        {user && book.created_by === user.id && (
          <DeleteButton bookId={book.id} />
        )}
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";