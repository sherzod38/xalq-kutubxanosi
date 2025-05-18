import { createSupabaseServerClient } from '@/utils/supabase/server';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
}

interface CartRow {
  id: string;
  book_id: string;
  books: Book[] | null;
}

interface CartItem {
  id: string;
  book: Book;
}

export default async function CartPage() {
  console.log('CartPage rendering started');
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Auth error:', authError?.message || 'User not authenticated');
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  let cartItems: CartItem[] = [];
  let errorMessage: string | null = null;

  try {
    const { data, error } = await supabase
      .from('cart')
      .select(`
        id,
        book_id,
        books!cart_book_id_fkey (id, title, author)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Cart fetch error:', error.message, error.details, error.hint);
      errorMessage = 'Savatcha ma\'lumotlarini olishda xatolik yuz berdi.';
      throw new Error(error.message);
    }

    console.log('Raw Supabase data:', JSON.stringify(data, null, 2)); // Debug log
    cartItems = (data || []).map((item: CartRow) => {
      if (!item.books || item.books.length === 0) {
        console.warn(`No book data for cart item ${item.id}, book_id: ${item.book_id}`);
        return null;
      }
      return {
        id: item.id,
        book: item.books[0],
      };
    }).filter((item): item is CartItem => item !== null);

    console.log('Cart fetch result:', { itemCount: cartItems.length }); // Debug log
  } catch (err) {
    console.error('Cart processing error:', err);
    errorMessage = 'Savatcha ma\'lumotlarini qayta ishlashda xatolik yuz berdi.';
  }

  console.log('CartPage rendering completed');

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Yuklanmoqda...</div>}>
        <main className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
          <div className="w-full max-w-4xl">
            <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
              ← Bosh sahifaga qaytish
            </Link>
            <h1 className="text-3xl font-bold mb-6">Savatcha</h1>
            {errorMessage ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-red-600">{errorMessage}</p>
                  <Link href="/books">
                    <Button className="mt-4">Kitoblarni ko‘rish</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : cartItems.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-600">Savatchangiz bo‘sh.</p>
                  <Link href="/books">
                    <Button className="mt-4">Kitoblarni ko‘rish</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.book.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600">Muallif: {item.book.author}</p>
                      </div>
                      <form action={`/api/cart/delete/${item.id}`} method="POST">
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4 mr-2" />
                          O‘chirish
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}