
// src/app/book/[id]/page.tsx
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

export default async function BookPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createSupabaseServerClient();

  const { data: book, error } = await supabase
    .from("books")
    .select("id, title, author, description, phone_number, region, district, created_by, created_at")
    .eq("id", id)
    .single();

  if (error || !book) {
    notFound();
  }

  const typedBook: Book = book;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{typedBook.title}</h1>
        <div className="space-y-4">
          <p className="text-gray-700">
            <strong>Muallif:</strong> {typedBook.author}
          </p>
          <p className="text-gray-600">
            <strong>Tavsif:</strong> {typedBook.description || "Yo‘q"}
          </p>
          <p className="text-gray-600">
            <strong>Telefon:</strong> {typedBook.phone_number || "Yo‘q"}
          </p>
          <p className="text-gray-600">
            <strong>Viloyat:</strong> {typedBook.region || "Yo‘q"}
          </p>
          <p className="text-gray-600">
            <strong>Tuman:</strong> {typedBook.district || "Yo‘q"}
          </p>
        </div>
        <Button asChild variant="link" className="mt-4 transition-none">
          <Link href="/books">Orqaga</Link>
        </Button>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";