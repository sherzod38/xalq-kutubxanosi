
// src/app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // localStorage dan xabarni o‘qish
  useEffect(() => {
    const message = localStorage.getItem("authMessage");
    if (message) {
      setAuthMessage(message);
      localStorage.removeItem("authMessage");
    }
  }, []);

  // Email validatsiyasi
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Kirish funksiyasi
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Email va parol maydonlari to‘ldirilishi shart.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Noto‘g‘ri email formati.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Kirishda xatolik: " + error.message);
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Noma’lum xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // Ro‘yxatdan o‘tish funksiyasi
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Email va parol maydonlari to‘ldirilishi shart.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Noto‘g‘ri email formati.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Parol kamida 6 belgi bo‘lishi kerak.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { email },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        setError("Ro‘yxatdan o‘tishda xatolik: " + error.message);
      } else {
        // Foydalanuvchi auth.users da yaratilganligini tekshirish
        if (data.user) {
          // public.users jadvalida foydalanuvchi saqlanganligini tekshirish
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, email")
            .eq("id", data.user.id)
            .single();

          if (userError || !userData) {
            setError("Foydalanuvchi ma’lumotlari saqlanmadi. Qayta urinib ko‘ring.");
          } else {
            setSuccess(
              "Siz muvaffaqiyatli ro‘yxatdan o‘tdingiz! Emailingizni tasdiqlang."
            );
            setEmail("");
            setPassword("");
          }
        } else {
          setError("Ro‘yxatdan o‘tish jarayonida xatolik yuz berdi.");
        }
      }
    } catch {
      setError("Noma’lum xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Kirish yoki Ro‘yxatdan o‘tish</h1>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Kirish</TabsTrigger>
            <TabsTrigger value="signup">Ro‘yxatdan o‘tish</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email manzilingizni kiriting"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Parol
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Parolingizni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Kirilmoqda..." : "Kirish"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Email manzilingizni kiriting"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Parol
                </label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Parolingizni kiriting (min 6 belgi)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Ro‘yxatdan o‘tilmoqda..." : "Ro‘yxatdan o‘tish"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        {authMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Xabar</AlertTitle>
            <AlertDescription>{authMessage}</AlertDescription>
          </Alert>
        )}
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
      </div>
    </main>
  );
};

export default LoginPage;