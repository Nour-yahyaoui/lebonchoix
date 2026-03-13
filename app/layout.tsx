// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/language-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RealEstate Tunisia',
  description: 'Find your dream property in Tunisia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <LanguageProvider> {/* This should wrap everything */}
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}