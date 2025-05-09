"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-semibold">Logo</h1>
        <ul className="hidden sm:flex space-x-4">
          <li><Link href="/" className="hover:text-gray-400">Bosh sahifa</Link></li>
          {/* <li><Link href="/book" className="hover:text-gray-400">Kitoblar</Link></li> */}
          {/* <li><Link href="/cart" className="hover:text-gray-400">Savatcha</Link></li> */}
          <li><Link href="/admin" className="hover:text-gray-400">Kitob Qo&apos;shish</Link></li>
        </ul>
      </div>

      <div className="sm:hidden">
        <Button onClick={() => setIsOpen(!isOpen)}>
          <span className="material-icons">menu</span>
        </Button>
        {isOpen && (
          <div className="absolute top-16 right-0 w-48 bg-gray-800 p-4 space-y-2">
            <Link href="/" className="block text-white">Bosh sahifa</Link>
            {/* <Link href="/book" className="block text-white">Kitoblar</Link> */}
            {/* <Link href="/cart" className="block text-white">Savatcha</Link> */}
            <Link href="/admin" className="block text-white">Kitob qo&apos;shish</Link>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <Input placeholder="Qidirish" className="bg-gray-700 text-white" />
        {/* <Button>Kirish</Button> */}
      </div>
    </nav>
  );
}
