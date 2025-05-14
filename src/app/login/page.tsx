
// src/app/login/page.tsx
"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, signup } from "./actions";

export default function LoginPage() {
  console.log('LoginPage rendering started');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  async function handleLogin(formData: FormData) {
    const result = await login(formData);
    if (result?.error) {
      setLoginError(result.error);
    }
  }

  async function handleSignup(formData: FormData) {
    const result = await signup(formData);
    if (result?.error) {
      setSignupError(result.error);
    }
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xl bg-gray-100">Yuklanmoqda...</div>}>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Xalq Kutubxonasi</h1>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Kirish</TabsTrigger>
                <TabsTrigger value="signup">Ro‘yxatdan o‘tish</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form action={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Email kiriting"
                      required
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                      Parol
                    </label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="Parol kiriting"
                      required
                      className="mt-1 w-full"
                    />
                  </div>
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertTitle>Xato</AlertTitle>
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full">
                    Kirish
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form action={handleSignup} className="space-y-4">
                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Email kiriting"
                      required
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                      Parol
                    </label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Parol kiriting"
                      required
                      className="mt-1 w-full"
                    />
                  </div>
                  {signupError && (
                    <Alert variant="destructive">
                      <AlertTitle>Xato</AlertTitle>
                      <AlertDescription>{signupError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full">
                    Ro‘yxatdan o‘tish
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <Alert className="mt-4">
              <AlertTitle>Diqqat</AlertTitle>
              <AlertDescription>
                Ro‘yxatdan o‘tish yoki kirish uchun to‘g‘ri email va parol kiriting.
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}