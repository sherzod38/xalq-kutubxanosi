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

  // Mobil menyuni yopish uchun overlay bosilganda
  const handleOverlayClick = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Xalq Kutubxonasi
        </Link>

        <button
          className="md:hidden block text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(true)}
          aria-label="Mobil menyuni ochish"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobil menyu uchun overlay va yon panel */}
        {/* Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
            onClick={handleOverlayClick}
          ></div>
        )}
        {/* Slide-in menyu */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
            ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0 md:shadow-none md:bg-transparent md:w-auto md:h-auto md:flex md:items-center md:space-x-4 md:relative`}
        >
          <div className="flex flex-col h-full p-6 space-y-4 md:flex-row md:space-y-0 md:p-0 md:items-center">
            {/* Yopish tugmasi faqat mobilda */}
            <button
              className="self-end mb-4 md:hidden text-gray-700"
              onClick={() => setMenuOpen(false)}
              aria-label="Menyuni yopish"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Tizimdan chiqish tugmasi */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 p-0 flex items-center justify-center"
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
              onClick={() => setMenuOpen(false)}
            >
              Kitoblar
            </Link>
            <Link
              href="/admin"
              className="block text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
            {!user && (
              <Link href="/login" className="block" onClick={() => setMenuOpen(false)}>
                <Button size="sm" className="w-full">Kirish</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Desktop uchun qidiruv */}
        <div className="w-full order-3 md:order-none md:w-auto md:flex-1 md:flex md:justify-center mt-4 md:mt-0">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[220px] md:max-w-md flex items-center justify-center">
              <SearchForm />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}