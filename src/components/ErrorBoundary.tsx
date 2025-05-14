
// src/components/ErrorBoundary.tsx
"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
  errorStack: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: null, errorStack: null };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message,
      errorStack: error.stack || null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught error:", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Xatolik yuz berdi</h2>
            <p className="mb-4">{this.state.errorMessage || "Iltimos, sahifani yangilang yoki keyinroq urinib ko‘ring."}</p>
            {this.state.errorStack && (
              <pre className="text-left text-sm text-red-600 max-w-md mx-auto">{this.state.errorStack}</pre>
            )}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Sahifani yangilash
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}