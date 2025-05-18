import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

// `params` ni Promise sifatida aniqlaymiz
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { id } = await params; // `params` ni await bilan ochamiz
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}