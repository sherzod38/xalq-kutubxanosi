
// src/components/DeleteButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { deleteBook } from "@/app/books/actions";

export default function DeleteButton({ bookId }: { bookId: string }) {
  const handleDelete = async () => {
    if (confirm("Bu kitobni o‘chirishni xohlaysizmi?")) {
      await deleteBook(bookId);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      variant="destructive"
      className="transition-none"
    >
      O‘chirish
    </Button>
  );
}