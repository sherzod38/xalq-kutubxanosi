
// src/app/book/[id]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PostgrestError } from "@supabase/supabase-js";

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

interface BookPageProps {
  params: { id: string };
}

export default async function BookPage({ params }: BookPageProps) {
  const { data: book, error } = await supabase
    .from("books")
    .select("id, title, author, description, phone_number, region, district, created_by, created_at")
    .eq("id", params.id)
    .single();

  if (error || !book) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{book.title}</h1>
        <div className="space-y-4">
          <p className="text-gray-700">
            <strong>Muallif:</strong> {book.author}
          </p>
          <p className="text-gray-600">
            <strong>Tavsif:</strong> {book.description || "Yo‘q"}
          </p>
          <p className="text-gray-600">
            <strong>Telefon:</strong> {book.phone_number || "Yo‘q"}
          </p>
          <p className="text-gray-600">
            <strong>Viloyat:</strong> {book.region || "Yo‘q"}
          </p>
          <p className="text-gray-600">
            <strong>Tuman:</strong> {book.district || "Yo‘q"}
          </p>
        </div>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";