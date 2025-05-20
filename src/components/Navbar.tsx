// Navbar.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import SearchForm from './SearchForm';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export default async function Navbar() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  async function handleSignOut() {
    "use server";
    await supabase.auth.signOut();
  }

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Xalq Kutubxonasi
        </Link>

        <button
          className="md:hidden block text-gray-700 focus:outline-none"
          type="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="w-full order-3 md:order-none md:w-auto md:flex-1 md:flex md:justify-center mt-4 md:mt-0">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[220px] md:max-w-md flex items-center justify-center">
              <SearchForm />
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto md:flex items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
          {user && (
            <form action={handleSignOut}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 w-full"
                type="submit"
              >
                <LogOut className="w-4 h-4" />
                Tizimdan chiqish
              </Button>
            </form>
          )}
          <Link
            href="/books"
            className="block text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
          >
            Kitoblar
          </Link>
          <Link
            href="/admin"
            className="block text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
          >
            Admin
          </Link>
          {!user && (
            <Link href="/login" className="block">
              <Button size="sm" className="w-full">Kirish</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}