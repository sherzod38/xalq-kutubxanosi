
// src/app/book/[id]/page.tsx
import { Suspense } from "react";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

async function BookContent({ params }: { params: Promise<{ id: string }> }) {
  console.log("BookPage rendering started");
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = await createSupabaseServerClient();
  
  // Kitobni olish
  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !book) {
    console.error("Book fetch error:", error?.message || "No book found", { id });
    notFound();
  }

  // Foydalanuvchi tekshiruvi (faqat DeleteButton uchun)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Book getUser error:", authError.message);
  }

  console.log("BookPage rendering completed, book title:", book.title);
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

export default function BookPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xl bg-gray-100">Yuklanmoqda...</div>}>
        <BookContent params={params} />
      </Suspense>
    </ErrorBoundary>
  );
}

export const dynamic = "force-dynamic";