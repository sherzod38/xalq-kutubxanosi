
// src/app/admin/page.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Majburiy maydonlarni tekshirish
    if (!title || !author || !description || !phoneNumber || !region || !district) {
      setError("Barcha maydonlarni to‘ldiring!");
      return;
    }

    const { error } = await supabase.from("books").insert([
      {
        title,
        author,
        description,
        phone_number: phoneNumber,
        region,
        district,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      },
    ]);

    if (error) {
      setError("Kitob qo‘shishda xatolik: " + error.message);
    } else {
      setSuccess("Kitob muvaffaqiyatli qo‘shildi!");
      setTitle("");
      setAuthor("");
      setDescription("");
      setPhoneNumber("");
      setRegion("");
      setDistrict("");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Kitob qo‘shish</h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Xatolik</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default" className="mb-4">
            <AlertTitle>Muvaffaqiyat</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Sarlavha
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Kitob sarlavhasi"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Muallif
            </label>
            <Input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              placeholder="Kitob muallifi"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Tavsif
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Kitob haqida qisqacha"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
              Telefon raqami
            </label>
            <Input
              id="phone_number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="+998901234567"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Viloyat
            </label>
            <Input
              id="region"
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              placeholder="Viloyat nomi"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">
              Tuman
            </label>
            <Input
              id="district"
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
              placeholder="Tuman nomi"
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full">
            Kitob qo‘shish
          </Button>
        </form>
      </div>
    </main>
  );
}