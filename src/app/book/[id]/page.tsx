"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  image_url: string | null;
}

const BookPage: React.FC = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    async function fetchBook() {
      if (!id) return;

      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Kitobni yuklashda xatolik:", error);
        setError("Kitob topilmadi yoki xatolik yuz berdi.");
      } else if (data) {
        setBook(data);
      } else {
        setError("Kitob topilmadi.");
      }
      setLoading(false);
    }

    fetchBook();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto py-8 px-4">Yuklanmoqda...</div>;
  }

  if (error || !book) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-red-600">Xatolik</h1>
        <p>{error || "Kitob topilmadi."}</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{book.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-lg">Muallif: {book.author}</p>
          <p className="mt-4 text-gray-600">{book.description}</p>
          {book.image_url && (
            <Image
              src={book.image_url}
              alt={book.title}
              width={400}
              height={500}
              className="mt-6 w-full max-w-md h-auto object-cover rounded"
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default BookPage;