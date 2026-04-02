'use client';
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  const { siteConfig } = useDynamicTheme();
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
      style={{ backgroundColor: primary, color: '#fff' }}
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
