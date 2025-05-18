// src/components/ErrorBoundary.tsx
"use client";
import { Component, PropsWithChildren } from 'react';

export class ErrorBoundary extends Component<PropsWithChildren> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Xatolik yuz berdi.</h1>;
    }
    return this.props.children;
  }
}