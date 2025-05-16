import { createSupabaseServerClient } from '@/utils/supabase/server';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Book interfeysi
interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  phone_number?: string;
  region?: string;
  district?: string;
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
        <main className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{typedBook.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Muallif</h2>
                <p className="text-gray-600">{typedBook.author}</p>
              </div>
              {typedBook.description && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Tavsif</h2>
                  <p className="text-gray-600">{typedBook.description}</p>
                </div>
              )}
              {typedBook.phone_number && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Telefon raqami</h2>
                  <p className="text-gray-600">{typedBook.phone_number}</p>
                </div>
              )}
              {typedBook.region && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Viloyat</h2>
                  <p className="text-gray-600">{typedBook.region}</p>
                </div>
              )}
              {typedBook.district && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Tuman</h2>
                  <p className="text-gray-600">{typedBook.district}</p>
                </div>
              )}
              {typedBook.created_at && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Yaratilgan sana</h2>
                  <p className="text-gray-600">{new Date(typedBook.created_at).toLocaleDateString('uz-UZ')}</p>
                </div>
              )}
              {typedBook.updated_at && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Yangilangan sana</h2>
                  <p className="text-gray-600">{new Date(typedBook.updated_at).toLocaleDateString('uz-UZ')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}