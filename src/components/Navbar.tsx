// Navbar.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
// import { LogOut } from 'lucide-react';
import SearchForm from './SearchForm';
import { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = useMemo(() => createClient(), []);

  

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/login';
  };

  // Mobil menyuni yopish uchun overlay bosilganda
  const handleOverlayClick = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center w-full md:w-auto">
          <Link href="/" className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
            Xalq Kutubxonasi
          </Link>
          {/* Hamburger menyu tugmasi Xalq Kutubxonasi yonida */}
          <button
            className="md:hidden ml-2 text-gray-700 focus:outline-none"
            onClick={() => setMenuOpen(true)}
            aria-label="Mobil menyuni ochish"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* SearchForm faqat mobilda ostida, desktopda yonida */}
        <div className="w-full md:hidden flex justify-center mb-2">
          <div className="w-full max-w-[220px] flex items-center justify-center">
            <SearchForm />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Desktop uchun SearchForm va tugmalar */}
          <div className="hidden md:flex items-center gap-2 w-full">
            <div className="max-w-[220px] md:max-w-md flex items-center">
              <SearchForm />
            </div>
            <Link
              href="/books"
              className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
            >
              Kitoblar
            </Link>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
            >
              Admin
            </Link>
            {user ? (
              <Button
                variant="destructive"
                size="sm"
                className="w-auto px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
                onClick={handleSignOut}
                title="Tizimdan chiqish"
              >
                Tizimdan chiqish
              </Button>
            ) : (
              <Link href="/login">
                <Button size="sm" className="w-full">Kirish</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobil menyu uchun overlay va yon panel */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
            onClick={handleOverlayClick}
          ></div>
        )}
        {/* Slide-in menyu (o'ngdan chiqadi) */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
            ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
            md:hidden`}
        >
          <div className="flex flex-col h-full p-6 space-y-4">
            {/* Yopish tugmasi faqat mobilda */}
            <button
              className="self-end mb-4 text-gray-700"
              onClick={() => setMenuOpen(false)}
              aria-label="Menyuni yopish"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
            {user ? (
              <Button
                variant="destructive"
                size="sm"
                className="w-full px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
                onClick={() => { handleSignOut(); setMenuOpen(false); }}
                title="Tizimdan chiqish"
              >
                Tizimdan chiqish
              </Button>
            ) : (
              <Link href="/login" className="block" onClick={() => setMenuOpen(false)}>
                <Button size="sm" className="w-full">Kirish</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}