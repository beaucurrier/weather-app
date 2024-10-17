import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Weather App',
  description: 'A simple weather app built with Next.js and TypeScript',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <main>{children}</main>
      </body>
    </html>
  );
}