
// src/app/books/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";

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

const BooksList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    async function fetchBooks() {
      let query = supabase
        .from("books")
        .select("id, title, author, description, phone_number, region, district, created_by, created_at");

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        setError("Kitoblarni olishda xatolik: " + error.message);
      } else {
        setBooks(data || []);
      }
    }
    fetchBooks();
  }, [searchTerm]);

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Kitoblar ro‘yxati</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Xatolik</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {books.length === 0 ? (
        <p className="text-center">Hozircha kitoblar yo‘q.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book.id} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-gray-700">Muallif: {book.author}</p>
              <p className="text-gray-600">{book.description || "Tavsif yo‘q"}</p>
              <p className="text-gray-600">Telefon: {book.phone_number || "Yo‘q"}</p>
              <p className="text-gray-600">Viloyat: {book.region || "Yo‘q"}</p>
              <p className="text-gray-600">Tuman: {book.district || "Yo‘q"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BooksPage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <Suspense fallback={<p className="text-center">Yuklanmoqda...</p>}>
        <BooksList />
      </Suspense>
    </main>
  );
};

export default BooksPage;

// Sahifani dinamik qilish uchun
export const dynamic = "force-dynamic";