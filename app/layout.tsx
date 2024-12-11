import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SnowBackground } from '@/components/ui/snow-background';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Secret Santa',
  description: 'Spread joy with anonymous gifting!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SnowBackground />
        {children}
      </body>
    </html>
  );
}