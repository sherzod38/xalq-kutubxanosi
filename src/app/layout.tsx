
// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Suspense } from 'react';

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
        <link rel="stylesheet" href="/globals.css" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Yuklanmoqda...</div>}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
}