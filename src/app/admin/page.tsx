"use client"; // ← Bu MUHIM!


import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminDashboard: React.FC = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    const { error } = await supabase.from("books").insert([
      {
        title,
        author,
        description,
        image_url: imageUrl ? imageUrl : null,
      },
    ]);

    setLoading(false);

    if (error) {
      setError("Kitobni qo'shishda xatolik yuz berdi.");
    } else {
      setSuccess("Kitob muvaffaqiyatli qo'shildi!");
      setTitle("");
      setAuthor("");
      setDescription("");
      setImageUrl("");
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Kitob nomi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Muallif"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <Textarea
              placeholder="Tavsif"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Rasm URL (ixtiyoriy)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Yuklanmoqda..." : "Kitob qo'shish"}
            </Button>
          </form>
          {success && (
            <Alert className="mt-4">
              <AlertTitle>Muvaffaqiyat!</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Xatolik!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminDashboard;