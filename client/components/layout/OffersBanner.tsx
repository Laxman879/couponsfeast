'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';

const offers = [
  { text: 'Personalized Offers', subtext: 'Just For You' },
  { text: 'Spring Sale', subtext: 'Up to 70% Off' },
  { text: 'Free Shipping', subtext: 'On Orders $50+' },
  { text: 'New Member Bonus', subtext: 'Extra 15% Off' },
];

export default function OffersBanner() {
  const [current, setCurrent] = useState(0);
  const { theme } = useTheme();
  const { siteConfig, darkPalette } = useDynamicTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';

  const bg = isDark ? darkPalette.cardBg : '#ffffff';
  const text = isDark ? darkPalette.text : '#374151';
  const border = isDark ? darkPalette.cardBg : '#e5e7eb';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % offers.length);
  const prev = () => setCurrent((prev) => (prev - 1 + offers.length) % offers.length);

  return (
    <div style={{ backgroundColor: bg, borderBottom: `1px solid ${border}` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-10">
        <ChevronLeft onClick={prev} className="w-4 h-4 cursor-pointer" style={{ color: text }} />
        <p className="text-sm" style={{ color: text }}>
          <a href="#" className="font-semibold" style={{ color: primary }}>
            {offers[current].text}
          </a>
          <span className="ml-1.5">{offers[current].subtext}</span>
        </p>
        <ChevronRight onClick={next} className="w-4 h-4 cursor-pointer" style={{ color: text }} />
      </div>
    </div>
  );
}
