import type { Metadata } from 'next';
import '@/shared/styles/globals.css';

import { Poppins, Lora } from 'next/font/google';
import { Provider } from '@/app/provider';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'LMS - Learning Management System',
  description: 'Welcome to our Learning Management System. Learn and grow with our comprehensive courses.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${lora.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
