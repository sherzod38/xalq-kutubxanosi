
// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Suspense } from 'react';
import { ErrorLogger } from '@/components/ErrorLogger';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Xalq Kutubxonasi',
  description: 'Kitoblar almashish platformasi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
      </head>
      <body className={inter.className}>
        <ErrorLogger />
        <ErrorBoundary>
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xl bg-gray-100">Yuklanmoqda...</div>}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
}