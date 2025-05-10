
// app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState(""); // Telefon raqami uchun holat

  // localStorage dan xabarni o‘qish
  useEffect(() => {
    const message = localStorage.getItem("authMessage");
    if (message) {
      setAuthMessage(message);
      localStorage.removeItem("authMessage"); // Xabarni bir marta korsatgandan song o‘chirish
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAuthMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      phone: phoneNumber, // Telefon raqamini ishlatish
      password,
    });

    if (error) {
      setError("Kirishda xatolik: " + error.message);
    } else {
      router.push("/admin"); // Muvaffaqiyatli kirganda admin sahifasiga yonaltirish
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Kirish</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon raqami
            </label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Telefon raqamini kiriting"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Parol
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Parol kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Kirish
          </Button>
        </form>
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
      </div>
    </main>
  );
};

export default LoginPage;