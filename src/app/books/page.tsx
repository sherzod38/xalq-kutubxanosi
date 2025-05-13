
// src/app/books/page.tsx
import { createSupabaseServerClient } from "@/utils/supabase/server";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function BooksPage() {
  console.log("BooksPage rendering started");
  const supabase = await createSupabaseServerClient();
  
  // Kitoblarni olish
  const { data: books, error } = await supabase.from("books").select("*");
  if (error) {
    console.error("Books fetch error:", error);
    return (
      <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Kitoblar</h1>
        <p>Xatolik yuz berdi: {error.message}</p>
      </main>
    );
  }

  // Foydalanuvchi tekshiruvi (faqat DeleteButton uchun)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Books getUser error:", authError);
  }

  console.log("BooksPage rendering completed, books count:", books?.length);
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Kitoblar</h1>
      <div className="w-full max-w-4xl">
        {books && books.length > 0 ? (
          <ul className="space-y-4">
            {books.map((book) => (
              <li key={book.id} className="p-4 bg-white rounded-lg shadow-md">
                <Link href={`/book/${book.id}`}>
                  <h2 className="text-xl font-semibold">{book.title}</h2>
                  <p className="text-gray-600">{book.author}</p>
                </Link>
                {user && book.created_by === user.id && (
                  <DeleteButton bookId={book.id} />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Hech qanday kitob topilmadi.</p>
        )}
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";