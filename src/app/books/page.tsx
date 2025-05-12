
// src/app/books/page.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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

interface BooksPageProps {
  searchParams: Promise<{ search?: string }>;
}

async function deleteBook(bookId: string) {
  "use server";
  const supabase = createServerActionClient({ cookies });
  const { error } = await supabase.from("books").delete().eq("id", bookId);
  if (error) {
    throw new Error("Kitob o‘chirishda xatolik: " + error.message);
  }
  revalidatePath("/books");
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const { search } = await searchParams;

  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Autentifikatsiya xatosi:", authError.message);
  }

  let query = supabase
    .from("books")
    .select("id, title, author, description, phone_number, region, district, created_by, created_at");

  if (user) {
    query = query.eq("created_by", user.id);
  } else {
    query = query.eq("created_by", null); // Foydalanuvchi login qilmagan bo'lsa, hech qanday kitob ko'rsatilmaydi
  }

  if (search) {
    const searchTerm = search;
    query = query.or(
      `title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`
    );
  }

  const { data: books, error } = await query;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-4xl mb-6">
        <form className="flex gap-2">
          <Input
            type="text"
            name="search"
            placeholder="Kitob nomi yoki muallif bo‘yicha qidiring"
            className="flex-1"
          />
          <Button type="submit">Qidirish</Button>
        </form>
      </div>
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
      {books && books.length > 0 ? (
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