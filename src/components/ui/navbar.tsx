
// src/components/ui/navbar.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/books");
    }
  };

  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-black text-lg font-bold">
          Xalq Kutubxonasi
        </Link>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Kitob yoki muallif qidiring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </form>
          <Button asChild variant="ghost">
            <Link href="/books">Kitoblar</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin">Kitob qo‘shish</Link>
          </Button>
          {user ? (
            <Button variant="outline" onClick={handleSignOut}>
              Chiqish
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href="/login">Kirish</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}