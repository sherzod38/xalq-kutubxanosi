import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient(); // `await` qo'shildi
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { book_id } = await request.json();
  const { error } = await supabase
    .from('cart')
    .insert({ user_id: user.id, book_id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}