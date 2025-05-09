"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import Navbar from "@/components/ui/navbar";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  image_url: string | null;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Kitoblarni yuklashda xatolik:", error);
      } else {
        setBooks(data || []);
      }
      setLoading(false);
    }

    fetchBooks();
  }, []);

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  return (
    <main className="container mx-auto py-8 px-4">
      {/* <Navbar /> */}
      <h1 className="text-3xl font-bold mb-8">Kitoblar Ro&apos;yxati</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Muallif: {book.author}</p>
              <p className="mt-2 text-gray-600">{book.description}</p>
              {book.image_url && (
                <Image
                  src={book.image_url}
                  alt={book.title}
                  className="mt-4 w-full h-48 object-cover rounded"
                />
              )}
              <a
                href={`/book/${book.id}`}
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Batafsil →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {books.length === 0 && (
        <p className="text-center text-gray-500">Hozircha kitoblar yo&apos;q</p>
      )}
    </main>
  );
}

