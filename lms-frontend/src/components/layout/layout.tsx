import { Suspense } from 'react';

import Header from './header';
import Footer from './footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">Loading...</div>}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
