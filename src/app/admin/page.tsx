
// src/app/admin/page.tsx
import { Suspense } from "react";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addBook } from "./actions";
import { ErrorBoundary } from "@/components/ErrorBoundary";

async function AdminContent() {
  console.log("AdminPage rendering started");
  const supabase = await createSupabaseServerClient();
  
  // Sessiyani tekshirish
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error("Admin getSession error:", sessionError.message);
    redirect("/login");
  }
  if (session) {
    await supabase.auth.refreshSession();
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    console.error("Admin getUser error:", authError?.message || "No user found");
    redirect("/login");
  }

  console.log("AdminPage rendering completed, user:", user.id);
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Yangi kitob qo‘shish</h1>
        <form action={addBook} className="w-full max-w-md space-y-4 animate-none">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Kitob nomi
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Kitob nomini kiriting"
              required
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Muallif
            </label>
            <Input
              id="author"
              name="author"
              type="text"
              placeholder="Muallif nomini kiriting"
              required
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Tavsif
            </label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Kitob tavsifini kiriting"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon raqami
            </label>
            <Input
              id="phone_number"
              name="phone_number"
              type="text"
              placeholder="Telefon raqamini kiriting"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Viloyat
            </label>
            <Input
              id="region"
              name="region"
              type="text"
              placeholder="Viloyatni kiriting"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
              Tuman
            </label>
            <Input
              id="district"
              name="district"
              type="text"
              placeholder="Tumanni kiriting"
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-none"
          >
            Kitob qo‘shish
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xl bg-gray-100">Yuklanmoqda...</div>}>
        <AdminContent />
      </Suspense>
    </ErrorBoundary>
  );
}

export const dynamic = "force-dynamic";