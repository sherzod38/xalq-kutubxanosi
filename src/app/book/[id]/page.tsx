// src/app/book/[id]/page.tsx
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Suspense } from 'react';

// Book interfeysi
interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  console.log('BookPage rendering started, id:', id);
  const supabase = await createSupabaseServerClient();
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  console.log('Book fetch result:', { bookTitle: book?.title, error: error?.message });

  if (error || !book) {
    console.error('Book fetch error:', error?.message || 'Book not found');
    throw new Error(`Book fetch failed: ${error?.message || 'Book not found'}`);
  }

  const typedBook: Book = book; // Book turi aniq belgilandi
  console.log('BookPage rendering completed, book title:', typedBook.title);

  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xl bg-gray-100">Yuklanmoqda...</div>}>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
          <h1 className="text-2xl font-bold mb-4">{typedBook.title}</h1>
          <p className="text-lg mb-2">Muallif: {typedBook.author}</p>
          <p className="text-gray-600">{typedBook.description}</p>
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}