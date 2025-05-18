// src/app/books/page.tsx
import { createSupabaseServerClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Suspense } from 'react';
import SearchForm from './SearchForm';

// Book interfeysi
interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  created_at?: string; // Supabase jadvalidagi umumiy maydon
  updated_at?: string; // Supabase jadvalidagi umumiy maydon
}

export default async function BooksPage({ searchParams }: { searchParams: { q?: string } }) {
  // Qidiruv so‘rovi
  const q = searchParams?.q || '';
  const supabase = await createSupabaseServerClient();

  let query = supabase.from('books').select('*');
  if (q) {
    // title yoki author bo‘yicha qidiruv
    query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%`);
  }
  const { data: books, error } = await query;

  if (error) {
    throw new Error(`Books fetch failed: ${error.message}`);
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xl bg-gray-100">Yuklanmoqda...</div>}>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
          <h1 className="text-2xl font-bold mb-4">Kitoblar</h1>
          <SearchForm defaultValue={q} />
          {(!books || books.length === 0) ? (
            <p>Kitoblar topilmadi.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book: Book) => (
                <li key={book.id} className="p-4 bg-white rounded-lg shadow">
                  <Link href={`/book/${book.id}`}>
                    <h2 className="text-xl font-semibold">{book.title}</h2>
                    <p className="text-gray-600">{book.author}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}