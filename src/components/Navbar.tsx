// Navbar.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import SearchForm from './SearchForm';
import { useState, useEffect, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;
    let pollCount = 0;
    const maxPolls = 3;

    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (isMounted) setUser(session?.user ?? null);
    };
    fetchUser();

    const interval = setInterval(() => {
      if (pollCount < maxPolls) {
        fetchUser();
        pollCount++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      clearInterval(interval);
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Xalq Kutubxonasi
        </Link>

        <button
          className="md:hidden block text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Mobil menyuni ochish"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        <div className="w-full order-3 md:order-none md:w-auto md:flex-1 md:flex md:justify-center mt-4 md:mt-0">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[220px] md:max-w-md flex items-center justify-center">
              <SearchForm />
            </div>
          </div>
        </div>

        <div className={`w-full md:w-auto md:flex items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0 ${menuOpen ? 'block' : 'hidden'} md:block`}>
          {/* Tizimdan chiqish tugmasi faqat user kirganda ko‘rinadi */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0 flex items-center justify-center md:w-8 md:h-8 md:p-0"
              onClick={handleSignOut}
              title="Tizimdan chiqish"
            >
              <LogOut className="w-5 h-5" />
              <span className="sr-only">Tizimdan chiqish</span>
            </Button>
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
          {/* Kirish tugmasi faqat user yo‘q bo‘lsa ko‘rinadi */}
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