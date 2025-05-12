
// src/app/books/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase
        .from("books")
        .select("id, title, author, description, created_by, created_at");

      if (error) {
        setError("Kitoblarni olishda xatolik: " + error.message);
      } else {
        setBooks(data || []);
      }
    }
    fetchBooks();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Kitoblar ro‘yxati</h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Xatolik</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {books.length === 0 ? (
          <p>Hozircha kitoblar yo‘q.</p>
        ) : (
          <ul className="space-y-4">
            {books.map((book) => (
              <li key={book.id} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-gray-700">Muallif: {book.author}</p>
                <p className="text-gray-600">{book.description || "Tavsif yo‘q"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default BooksPage;