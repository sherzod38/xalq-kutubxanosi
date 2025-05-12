
// src/components/ui/navbar.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();
  }, []);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          Xalq Kutubxonasi
        </Link>
        <div className="space-x-4">
          <Button asChild variant="ghost">
            <Link href="/books">Kitoblar</Link>
          </Button>
          {user && (
            <Button asChild>
              <Link href="/admin">Kitob qo‘shish</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}