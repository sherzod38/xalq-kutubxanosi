// SearchForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

interface SearchFormProps {
  defaultValue?: string;
}

function SearchForm({ defaultValue = "" }: SearchFormProps) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<{ id: string; title: string; author: string }[]>([]);
  const router = useRouter();
  const supabase = createClient();

  // Debounce funksiyasi generic tur bilan
  const debounce = <T extends unknown[]>(
    func: (...args: T) => void,
    delay: number
  ) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: T) => {
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
        .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
        .limit(5);
      if (error) console.error('Search error:', error.message);
      else setSuggestions(data || []);
    },
    [supabase]
  );

  // Debounce bilan qidiruvni ishga tushirish
  const debouncedSearch = useCallback(debounce<[string]>(searchBooks, 300), [searchBooks]);

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
    setValue('');
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-xs md:max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          type="text"
          placeholder="Kitob nomi yoki muallif bo‘yicha izlash..."
          value={value}
          onChange={e => setValue(e.target.value)}
          className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-base"
        />
        <button
          type="submit"
          className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs md:text-base"
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

export default SearchForm;