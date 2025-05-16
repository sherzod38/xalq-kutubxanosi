import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// UUID formati uchun validatsiya
const uuidSchema = z.string().uuid();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // UUID formatini tekshirish
    const uuidResult = uuidSchema.safeParse(id);
    if (!uuidResult.success) {
      return NextResponse.json({ error: 'Noto`g`ri ID formati' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError?.message);
      return NextResponse.json({ error: 'Foydalanuvchi autentifikatsiya qilinmagan' }, { status: 401 });
    }

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Cart item delete error:', error.message, error.details, error.hint);
      return NextResponse.json({ error: 'Savatcha elementini o`chirishda xatolik' }, { status: 500 });
    }

    console.log(`Cart item ${id} deleted successfully for user ${user.id}`);
    return NextResponse.redirect(
      new URL('/cart', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
      { status: 303 } // POST dan GET ga yo‘naltirish uchun
    );
  } catch (err) {
    console.error('Cart delete processing error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// DELETE metodini qo‘llab-quvvatlash (kelajak uchun)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return POST(request, { params }); // POST logikasini qayta ishlatish
}