'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ThemedMain from '@/components/ThemedMain';

import BackToTop from '@/components/common/BackToTop';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <ThemedMain>{children}</ThemedMain>
      <Footer />
      <BackToTop />
    </>
  );
}
