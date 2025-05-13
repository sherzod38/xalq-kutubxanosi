
// src/app/books/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { PostgrestError } from "@supabase/supabase-js";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  phone_number: string | null;
  region: string | null;
  district: string | null;
  created_by: string | null;
  created_at: string;
}

async function deleteBook(bookId: string) {
  "use server";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("books").delete().eq("id", bookId);
  if (error) {
    throw new Error("Kitob o‘chirishda xatolik: " + error.message);
  }
  revalidatePath("/books");
}

export default async function BooksPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  let books: Book[] = [];
  let error: PostgrestError | null = null;

  if (user) {
    const { data, error: queryError } = await supabase
      .from("books")
      .select("id, title, author, description, phone_number, region, district, created_by, created_at")
      .eq("created_by", user.id);

    if (queryError) {
      error = queryError;
    } else {
      books = data || [];
    }
  }

  if (authError) {
    console.error("Autentifikatsiya xatosi:", authError.message);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      {error && (
        <Alert variant="destructive" className="w-full max-w-4xl mb-6">
          <AlertDescription>Xatolik: {error.message}</AlertDescription>
        </Alert>
      )}
      {authError && (
        <Alert variant="destructive" className="w-full max-w-4xl mb-6">
          <AlertDescription>Autentifikatsiya xatosi: Iltimos, qayta kiring.</AlertDescription>
        </Alert>
      )}
      {books.length > 0 ? (
        <div className="w-full max-w-4xl grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book: Book) => (
            <div
              key={book.id}
              className="p-4 bg-white rounded-lg shadow-md flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{book.title}</h2>
                <p className="text-gray-600">Muallif: {book.author}</p>
                <p className="text-gray-500 truncate">
                  {book.description || "Tavsif yo‘q"}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild variant="outline">
                  <Link href={`/book/${book.id}`}>Batafsil</Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    try {
                      await deleteBook(book.id);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  <Button type="submit" variant="destructive">
                    O‘chirish
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-4xl text-center">
          <p className="text-gray-600">Siz hali kitob qo‘shmaganisiz.</p>
        </div>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";