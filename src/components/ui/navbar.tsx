
"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // App Router uchun
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  image_url: string | null;
}

interface User {
  id: string;
  email: string;
}

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter(); // App Router uchun useRouter
  const pathname = usePathname(); // Joriy sahifa yo‘lini olish

  // Foydalanuvchi holatini tekshirish
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ? { id: user.id, email: user.email! } : null);
    };

    fetchUser();

    // Auth holati o‘zgarishini kuzatish
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email! } : null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Kitoblarni qidirish
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("books")
        .select("*")
        .ilike("title", `%${searchQuery}%`);

      if (error) {
        console.error("Qidiruvda xatolik:", error);
      } else {
        setSearchResults(data || []);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Chiqish funksiyasi
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/"); // Bosh sahifaga yo‘naltirish
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Xalq Kutubxonasi
        </Link>

        <div className="flex items-center gap-6">
          {/* Qidiruv formasi */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Kitob qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-black w-64 rounded-md"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-12 bg-white text-black shadow-lg rounded-md w-64 max-h-60 overflow-y-auto z-10">
                {searchResults.map((book) => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className="block p-2 hover:bg-gray-100"
                  >
                    {book.title} - {book.author}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Navigatsiya havolalari */}
          <div className="flex gap-4 items-center">
            <Link
              href="/"
              className={`hover:underline ${pathname === "/" ? "underline" : ""}`}
            >
              Bosh sahifa
            </Link>
            {/* Admin havolasi faqat autentifikatsiyadan o‘tgan foydalanuvchilar uchun */}
            {user && (
              <Link
                href="/admin"
                className={`hover:underline ${pathname === "/admin" ? "underline" : ""}`}
              >
                Kitob qo‘shish
              </Link>
            )}
          </div>

          {/* Foydalanuvchi holati */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">{user.email}</span>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-white hover:bg-blue-700"
              >
                Chiqish
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="text-white hover:bg-blue-700"
            >
              Kirish
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;