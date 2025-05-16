import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Xalq Kutubxonasi',
  description: 'Kitoblar dunyosiga xush kelibsiz',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('RootLayout rendering started');
  return (
    <html lang="uz">
      <body className={inter.className}>
        <ErrorBoundary>
          <Navbar />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}