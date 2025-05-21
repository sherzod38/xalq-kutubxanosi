
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, "g-recaptcha-response": captchaToken } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email va parol to'ldirilishi shart" }, { status: 400 });
    }

    // reCAPTCHA tokenini tekshirish
    if (!captchaToken) {
      return NextResponse.json({ error: "CAPTCHA to'ldirilmagan" }, { status: 400 });
    }
    const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=6LcUbUIrAAAAAMqbNquVaPSNEP4obhiHjtVdfRNM&response=${captchaToken}`,
    });
    const captchaData = await captchaRes.json();
    if (!captchaData.success) {
      return NextResponse.json({ error: "CAPTCHA xato yoki noto'g'ri" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}