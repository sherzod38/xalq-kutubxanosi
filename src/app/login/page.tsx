// app/login/page.tsx
'use client'; // Client komponent sifatida belgilaymiz

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { handleLogin } from '@/app/actions/auth'; // Server Action ni import qilamiz

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get('error');
    setErrorMessage(error ? decodeURIComponent(error) : null);
  }, [searchParams]);

  async function onSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      await handleLogin(formData);
      // Agar handleLogin muvaffaqiyatli bo'lsa, u redirect qiladi
    } catch (error) {
      console.error('Login xatosi:', error);
      setErrorMessage('Login jarayonida xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Tizimga Kirish</h1>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {errorMessage}
          </div>
        )}
        <form action={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email kiriting"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Parol
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Parol kiriting"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400"
          >
            {isLoading ? 'Kirish...' : 'Kirish'}
          </button>
        </form>
      </div>
    </div>
  );
}