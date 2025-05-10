"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Routerni faqat mijoz tomonida ishlatish
    const handleGoHome = () => {
      router.push("/");
    };

    // Bosh sahifaga qaytish tugmasi
    const button = document.getElementById("go-home-button");
    if (button) {
      button.addEventListener("click", handleGoHome);
    }

    return () => {
      if (button) {
        button.removeEventListener("click", handleGoHome);
      }
    };
  }, [router]);

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600">404 - Sahifa topilmadi</h1>
      <p className="mt-4 text-lg text-gray-700">Kechirasiz, siz izlagan sahifa mavjud emas.</p>
      <Button id="go-home-button" className="mt-6">
        Bosh sahifaga qaytish
      </Button>
    </main>
  );
};

export default NotFoundPage;