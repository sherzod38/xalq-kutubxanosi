'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!captcha) {
      setErrorMessage("Iltimos, CAPTCHA ni to‘ldiring!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, "g-recaptcha-response": captcha }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Ro‘yxatdan o‘tishda xatolik yuz berdi');
      }
    } catch {
      setErrorMessage('Ro‘yxatdan o‘tishda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setCaptcha(null);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Ro‘yxatdan o‘tish</h1>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {errorMessage}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6">
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
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LcUbUIrAAAAAKvezmm5LfUOXxMxIcox0GQZGixh"
              onChange={setCaptcha}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !captcha}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400"
          >
            {isLoading ? "Ro‘yxatdan o‘tilmoqda..." : "Ro‘yxatdan o‘tish"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Akkauntingiz bormi?</span>
          <Link href="/login" className="ml-2 text-blue-600 hover:underline">
            Kirish
          </Link>
        </div>
      </div>
    </div>
  );
}