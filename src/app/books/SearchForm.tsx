'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm({ defaultValue }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue || '');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = value ? `?q=${encodeURIComponent(value)}` : '';
    router.push(`/books${params}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Kitob nomi yoki muallif bo‘yicha izlash..."
        value={value}
        onChange={e => setValue(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Qidirish
      </button>
    </form>
  );
}