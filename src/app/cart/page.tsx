// app/cart/page.tsx
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default async function CartPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return <div>Iltimos, tizimga kiring.</div>;
  }

  const { data: cartItems, error } = await supabase
    .from('cart')
    .select('*, books(*)')
    .eq('user_id', user.id);

  if (error) {
    console.error('Cart fetch error:', error);
    return <div>Xatolik yuz berdi: {error.message}</div>;
  }

  if (!cartItems || cartItems.length === 0) {
    return <div>Savatchangiz bo‘sh.</div>;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Yuklanmoqda...</div>}>
        <div>
          <h1>Savatcha</h1>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                {item.books?.title} - {item.quantity} dona
              </li>
            ))}
          </ul>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}