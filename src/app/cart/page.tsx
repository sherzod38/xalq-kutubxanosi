"use client";

import React from "react";
import Link from "next/link";

const CartPage: React.FC = () => {
  return (
    <main style={{ padding: "2rem" }}>
      <Link 
        href="/" 
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Bosh sahifaga qaytish
      </Link>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Savatcha</h1>
      <p>Bu yerda savatchadagi kitoblar ro&apos;yxati va umumiy ma&apos;lumotlar chiqadi.</p>
    </main>
  );
};

export default CartPage;