
// src/app/layout.tsx
import { Inter } from "next/font/google";
import "../styles/global.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Xalq Kutubxonasi",
  description: "Kitoblar almashish platformasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-100">Yuklanmoqda...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}