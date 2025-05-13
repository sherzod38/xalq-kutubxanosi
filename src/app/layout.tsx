// src/app/layout.tsx
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
      <head>
        <link rel="preload" href="/_next/static/css/globals.css" as="style" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-100">Yuklanmoqda...</div>}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
}