// SearchForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // Client-side Supabase

export default function SearchForm() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<{ id: string; title: string; author: string }[]>([]);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Debounce funksiyasi
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Qidiruv funksiyasi
  const searchBooks = useCallback(
    async (query: string) => {
      if (!query) {
        setSuggestions([]);
        return;
      }
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author')
        .ilike('title', `%${query}%`)
        .ilike('author', `%${query}%`)
        .limit(5); // Maksimum 5 ta taklif
      if (error) console.error('Search error:', error.message);
      else setSuggestions(data || []);
    },
    [supabase]
  );

  // Debounce bilan qidiruvni ishga tushirish
  const debouncedSearch = debounce(searchBooks, 300);

  useEffect(() => {
    debouncedSearch(value);
  }, [value, debouncedSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = value ? `?q=${encodeURIComponent(value)}` : '';
    router.push(`/books${params}`);
  };

  const handleSuggestionClick = (id: string) => {
    router.push(`/book/${id}`);
    setValue(''); // Qidiruv maydonini tozalash
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          type="text"
          placeholder="Kitob nomi yoki muallif bo‘yicha izlash..."
          value={value}
          onChange={e => setValue(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Qidirish
        </button>
      </form>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.id)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-800"
            >
              {suggestion.title} - {suggestion.author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}