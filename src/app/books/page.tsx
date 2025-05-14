// src/app/books/page.tsx
import { createSupabaseServerClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Suspense } from 'react';

export default async function BooksPage() {
  console.log('BooksPage rendering started');
  const supabase = await createSupabaseServerClient();
  const { data: books, error } = await supabase.from('books').select('*');

  console.log('Books fetch result:', { booksCount: books?.length, error: error?.message });

  if (error) {
    console.error('Books fetch error:', error.message);
    throw new Error(`Books fetch failed: ${error.message}`);
  }

  if (!books || books.length === 0) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xl bg-gray-100">Yuklanmoqda...</div>}>
          <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Kitoblar</h1>
            <p>Kitoblar topilmadi.</p>
          </main>
        </Suspense>
      </ErrorBoundary>
    );
  }

  console.log('BooksPage rendering completed, books count:', books.length);

  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xl bg-gray-100">Yuklanmoqda...</div>}>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
          <h1 className="text-2xl font-bold mb-4">Kitoblar</h1>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book: any) => (
              <li key={book.id} className="p-4 bg-white rounded-lg shadow">
                <Link href={`/book/${book.id}`}>
                  <h2 className="text-xl font-semibold">{book.title}</h2>
                  <p className="text-gray-600">{book.author}</p>
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}