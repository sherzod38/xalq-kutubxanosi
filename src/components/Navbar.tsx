import Link from 'next/link';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default async function Navbar() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Xalq Kutubxonasi
        </Link>

        {/* Navigatsiya linklari */}
        <div className="flex items-center space-x-4">
          <Link
            href="/books"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Kitoblar
          </Link>
          <Link
            href="/cart"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Savat
          </Link>
          {user ? (
            <>
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
              <form action="/auth/signout" method="post">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Chiqish
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Kirish</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}