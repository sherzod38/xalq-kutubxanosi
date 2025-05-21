// app/login/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { login } from './actions';
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const recaptchaRef = useRef<any>(null);
  const [captcha, setCaptcha] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get('error');
    setErrorMessage(error ? decodeURIComponent(error) : null);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Tizimga Kirish</h1>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {errorMessage}
          </div>
        )}
        {showAlert && (
          <Alert variant="default" className="mb-4">
            <AlertTitle>Xatolik!</AlertTitle>
            <AlertDescription>
              Login yoki parolda xatolik bo‘ldi.
            </AlertDescription>
          </Alert>
        )}
        <form action={async (formData) => {
          if (!captcha) {
            setShowAlert(true);
            return;
          }
          formData.append("g-recaptcha-response", captcha);
          const result = await login(formData);
          if ((result as { error?: string })?.error) {
            setShowAlert(true);
          } else {
            window.location.href = '/admin';
          }
        }} className="space-y-6">
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
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            disabled={!captcha}
          >
            Kirish
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Akkauntingiz yo‘qmi?</span>
          <Link
            href="/register"
            className="ml-2 text-blue-600 hover:underline"
          >
            Ro‘yxatdan o‘tish
          </Link>
        </div>
      </div>
    </div>
  );
}