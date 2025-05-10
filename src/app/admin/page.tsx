
// app/admin/page.tsx
"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface FormData {
  title: string;
  author: string;
  description: string;
  imageUrl: string;
}

const AdminDashboard: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      imageUrl: "",
    });
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    // Foydalanuvchi autentifikatsiyasini tekshirish
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      localStorage.setItem("authMessage", "Siz avval royxatdan oting.");
      router.push("/login");
      setLoading(false);
      return;
    }

    // Validatsiya
    if (!formData.title.trim() || !formData.author.trim() || !formData.description.trim()) {
      setError("Iltimos, barcha majburiy maydonlarni toldiring.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("books").insert([
        {
          title: formData.title,
          author: formData.author,
          description: formData.description,
          image_url: formData.imageUrl.trim() || null,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      setSuccess("Kitob muvaffaqiyatli qoshildi!");
      resetForm();
    } catch (err) {
      setError(`Kitobni qo'shishda xatolik yuz berdi: ${err instanceof Error ? err.message : 'Noma\'lum xatolik'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold text-center">
            Admin Paneli: Yangi Kitob Qoshish
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Kitob nomi <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Masalan: Alkimyogar"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Muallif <span className="text-red-500">*</span>
              </label>
              <Input
                id="author"
                name="author"
                type="text"
                placeholder="Masalan: Paulo Koelyo"
                value={formData.author}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Tavsif <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Kitob haqida qisqacha malumot..."
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full"
                rows={4}
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Rasm URL (ixtiyoriy)
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="text"
                placeholder="Masalan: https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  "Kitob qoshish"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={loading}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Tozalash
              </Button>
            </div>
          </form>

          {success && (
            <Alert className="mt-6 bg-green-50 border-green-200 animate-in fade-in">
              <AlertTitle className="text-green-700">Muvaffaqiyat!</AlertTitle>
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mt-6 animate-in fade-in">
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