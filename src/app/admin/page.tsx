
// src/app/admin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!title || !author) {
      setError("Kitob nomi va muallifi to‘ldirilishi shart.");
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Iltimos, tizimga kiring.");
        window.location.href = "/login";
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("books")
        .insert([{ title, author, description, created_by: user.id }]);

      if (error) {
        setError("Kitob qo‘shishda xatolik: " + error.message);
      } else {
        setSuccess("Kitob muvaffaqiyatli qo‘shildi!");
        setTitle("");
        setAuthor("");
        setDescription("");
        const { data } = await supabase
          .from("books")
          .select("id, title, author, description, created_by, created_at");
        setBooks(data || []);
      }
    } catch {
      setError("Noma’lum xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Iltimos, tizimga kiring.");
        window.location.href = "/login";
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", bookId)
        .eq("created_by", user.id);

      if (error) {
        setError("Kitob o‘chirishda xatolik: " + error.message);
      } else {
        setSuccess("Kitob muvaffaqiyatli o‘chirildi!");
        const { data } = await supabase
          .from("books")
          .select("id, title, author, description, created_by, created_at");
        setBooks(data || []);
      }
    } catch {
      setError("Noma’lum xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Kitob qo‘shish</h1>
        <form onSubmit={handleAddBook} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Kitob nomi
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Kitob nomini kiriting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Muallif
            </label>
            <Input
              id="author"
              type="text"
              placeholder="Muallif nomini kiriting"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              disabled={loading}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Tavsif
            </label>
            <Input
              id="description"
              type="text"
              placeholder="Kitob haqida qisqacha ma’lumot"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Qo‘shilmoqda..." : "Kitob qo‘shish"}
          </Button>
        </form>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Xatolik</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default" className="mt-4">
            <AlertTitle>Muvaffaqiyat</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <h2 className="text-xl font-bold mt-8 mb-4 text-center">Sizning kitoblaringiz</h2>
        {books.length === 0 ? (
          <p className="text-center">Hozircha kitoblar yo‘q.</p>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <div key={book.id} className="p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-gray-700">Muallif: {book.author}</p>
                  <p className="text-gray-600">{book.description || "Tavsif yo‘q"}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteBook(book.id)}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  O‘chirish
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;