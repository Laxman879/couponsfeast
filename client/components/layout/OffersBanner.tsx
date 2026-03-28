import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const offers = [
  { text: 'Personalized Offers', subtext: 'Just For You' },
  { text: 'Spring Sale', subtext: 'Up to 70% Off' },
  { text: 'Free Shipping', subtext: 'On Orders $50+' },
  { text: 'New Member Bonus', subtext: 'Extra 15% Off' },
];

export default function OffersBanner() {
  const [current, setCurrent] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % offers.length);
  const prev = () => setCurrent((prev) => (prev - 1 + offers.length) % offers.length);

  return (
    <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-10">
        <ChevronLeft onClick={prev} className="w-4 h-4 cursor-pointer text-gray-700 dark:text-gray-300" />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <a href="#" className="text-purple-700 dark:text-purple-400 font-semibold">
            {offers[current].text}
          </a>
          <span className="ml-1.5">{offers[current].subtext}</span>
        </p>

        <ChevronRight onClick={next} className="w-4 h-4 cursor-pointer text-gray-700 dark:text-gray-300" />
      </div>
    </div>
  );
}
