
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

interface PageProps {
  params: Promise<{ id: string }>; // params Promise sifatida aniqlanadi
}

export default async function BookPage({ params }: PageProps) {
  const { id } = await params; // params ni await bilan ochamiz
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("books")
    .select("id, title, author, description, phone_number, region, district, created_by, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound(); // Agar kitob topilmasa, 404 sahifasiga yo‘naltirish
  }

  const book: Book = data;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
        <p className="text-gray-600 mb-2">Muallif: {book.author}</p>
        <p className="text-gray-500 mb-4">{book.description || "Tavsif yo‘q"}</p>
        {book.phone_number && (
          <p className="text-gray-600 mb-2">Telefon: {book.phone_number}</p>
        )}
        {book.region && <p className="text-gray-600 mb-2">Viloyat: {book.region}</p>}
        {book.district && <p className="text-gray-600 mb-4">Tuman: {book.district}</p>}
        <Button asChild variant="outline" className="transition-none">
          <Link href="/books">Orqaga</Link>
        </Button>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic"; // Sahifani har doim dinamik qilish