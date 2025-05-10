"use client"; // bu MUHIM
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600">404 - Sahifa topilmadi</h1>
      <p className="mt-4 text-lg text-gray-700">Kechirasiz, siz izlagan sahifa mavjud emas.</p>
      <Link href="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Bosh sahifaga qaytish
      </Link>
    </main>
  );
}