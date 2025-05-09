"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient"; // Supabase client yo'li mos bo'lishi kerak

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("books") // Jadval nomi
        .select("*")
        .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);

      if (error) console.error("Search error:", error);
      else setSearchResults(data);
    };

    const delayDebounce = setTimeout(() => {
      fetchBooks();
    }, 400); // Debounce: 400ms

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <nav className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800 text-white relative">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-semibold">Logo</h1>
        <ul className="hidden sm:flex space-x-4">
          <li><Link href="/" className="hover:text-gray-400">Bosh sahifa</Link></li>
          <li><Link href="/admin" className="hover:text-gray-400">Kitob Qo&apos;shish</Link></li>
        </ul>
      </div>

      <div className="sm:hidden mt-2">
        <Button onClick={() => setIsOpen(!isOpen)}>
          <span className="material-icons">menu</span>
        </Button>
        {isOpen && (
          <div className="absolute top-16 right-0 w-48 bg-gray-800 p-4 space-y-2 z-50">
            <Link href="/" className="block text-white">Bosh sahifa</Link>
            <Link href="/admin" className="block text-white">Kitob qo&apos;shish</Link>
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <Input
          placeholder="Qidirish: nomi yoki muallif"
          className="bg-gray-700 text-white w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <Button>Kirish</Button> */}
      </div>

      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white text-black shadow-lg mt-2 rounded z-50 p-2 max-h-60 overflow-auto">
          <ul>
            {searchResults.map((book) => (
              <li key={book.id} className="p-2 border-b hover:bg-gray-100">
                <strong>{book.title}</strong> — {book.author}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
