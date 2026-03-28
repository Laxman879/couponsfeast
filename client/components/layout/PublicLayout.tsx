'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import OffersBanner from '@/components/layout/OffersBanner';
import Footer from '@/components/layout/Footer';
import ThemedMain from '@/components/ThemedMain';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="relative lg:fixed lg:top-0 lg:left-0 lg:right-0 z-50">
        <Navbar />
        <OffersBanner />
      </div>
      <ThemedMain>{children}</ThemedMain>
      <Footer />
    </>
  );
}
