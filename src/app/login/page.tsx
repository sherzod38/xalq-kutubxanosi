
// app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState(""); // Telefon raqami
  const [otp, setOtp] = useState(""); // OTP kodi
  const [step, setStep] = useState<"phone" | "otp">("phone"); // Forma holati
  const [error, setError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // localStorage dan xabarni o‘qish
  useEffect(() => {
    const message = localStorage.getItem("authMessage");
    if (message) {
      setAuthMessage(message);
      localStorage.removeItem("authMessage"); // Xabarni bir marta ko‘rsatgandan so‘ng o‘chirish
    }
  }, []);

  // Telefon raqamini yuborish (OTP so‘rash)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAuthMessage("");
    setLoading(true);

    // Telefon raqami validatsiyasi
    const phoneRegex = /^\+998[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Iltimos, to‘g‘ri telefon raqamini kiriting (masalan, +998901234567).");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true, // Agar foydalanuvchi mavjud bo‘lmasa, yaratiladi
        },
      });

      if (error) {
        setError("OTP yuborishda xatolik: " + error.message);
      } else {
        setStep("otp"); // OTP kiritish formasiga o‘tish
      }
    } catch {
      setError("Noma’lum xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // OTP’ni tasdiqlash
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAuthMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "sms",
      });

      if (error) {
        setError("OTP tasdiqlashda xatolik: " + error.message);
      } else {
        router.push("/admin"); // Muvaffaqiyatli kirganda admin sahifasiga yo‘naltirish
      }
    } catch {
      setError("Noma’lum xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // Orqaga qaytish (telefon raqami formasiga)
  const handleBack = () => {
    setStep("phone");
    setOtp("");
    setError("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Kirish</h1>
        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefon raqami
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+998901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Yuborilmoqda..." : "OTP kodini yuborish"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                OTP kodi
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="6 raqamli kodni kiriting"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
                disabled={loading}
              >
                Orqaga
              </Button>
            </div>
          </form>
        )}
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