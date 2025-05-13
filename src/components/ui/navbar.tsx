
// src/components/ui/navbar.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              Bosh sahifa
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/books">
                  <Button variant="outline">Mening kitoblarim</Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline">Kitob qo&apos;shish</Button>
                </Link>
                <Button onClick={handleSignOut} variant="destructive">
                  Chiqish
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button>Kirish</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}