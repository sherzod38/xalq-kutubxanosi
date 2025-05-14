
// src/components/ErrorLogger.tsx
"use client";

import { useEffect } from 'react';

export function ErrorLogger() {
  useEffect(() => {
    console.log('ErrorLogger mounted');
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.message, event.error);
    });
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
    return () => {
      window.removeEventListener('error', () => {});
      window.removeEventListener('unhandledrejection', () => {});
    };
  }, []);
  return null;
}