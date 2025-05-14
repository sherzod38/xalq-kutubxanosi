
// src/app/page.tsx
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Link from 'next/link';

export default function HomePage() {
  console.log('HomePage rendering started');
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xl bg-gray-100">Yuklanmoqda...</div>}>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
          <h1 className="text-3xl font-bold mb-6">Xalq Kutubxonasi</h1>
          <p className="text-lg mb-4">Kitoblar almashish platformasiga xush kelibsiz!</p>
          <Link href="/books" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Kitoblarni ko‘rish
          </Link>
          <Link href="/login" className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Kirish
          </Link>
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}