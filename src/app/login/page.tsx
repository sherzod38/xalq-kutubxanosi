"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Ro'yxatdan o'tishda xatolik yuz berdi.");
    } else {
      setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz! Emailingizni tekshiring.");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded">
        <h1 className="text-2xl font-bold text-center">Ro&apos;yxatdan o&apos;tish</h1>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Yuklanmoqda..." : "Ro&apos;yxatdan o&apos;tish"}
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
      </div>
    </main>
  );
};

export default AuthPage;