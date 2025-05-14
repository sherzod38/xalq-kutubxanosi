
// src/app/layout.tsx
"use client";

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Suspense, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Xalq Kutubxonasi',
  description: 'Kitoblar almashish platformasi',
};

function ErrorLogger() {
  useEffect(() => {
    console.log('ErrorLogger mounted');
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.message, event.error);
    });
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
    return () => {
      window.removeEventListener('error', () => {});
      window.removeEventListener('unhandledrejection', () => {});
    };
  }, []);
  return null;
}

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