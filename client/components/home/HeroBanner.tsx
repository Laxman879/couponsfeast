'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

const leftBrands = [
  { name: 'Hostinger', bg: 'bg-gradient-to-r from-[#673de6] to-[#4a1fa8]', title: 'UP TO 90% OFF', sub1: 'On Web Hosting Plans', sub2: 'FLAT ₹199/mo', sub2desc: 'On Premium Hosting', cta: 'GRAB NOW', emoji: '🌐' },
  { name: 'Redrail', bg: 'bg-gradient-to-r from-[#1a5276] to-[#2980b9]', title: 'UP TO ₹200 OFF', sub1: 'On Train Ticket Bookings', sub2: 'FLAT ₹50 OFF', sub2desc: 'On First Booking', cta: 'BOOK NOW', emoji: '🚂' },
  { name: 'Dell', bg: 'bg-gradient-to-r from-[#0057b8] to-[#003f8a]', title: 'UP TO 40% OFF', sub1: 'On Laptops & Accessories', sub2: 'EXTRA 12% OFF', sub2desc: 'On Monitor Bundles', cta: 'SHOP NOW', emoji: '💻' },
  { name: 'Flipkart', bg: 'bg-gradient-to-r from-[#2874f0] to-[#1a5dc2]', title: 'UP TO 80% OFF', sub1: 'Big Billion Days Sale', sub2: '10% BANK OFFER', sub2desc: 'On All Bank Cards', cta: 'SHOP NOW', emoji: '🛒' },
  { name: 'Amazon', bg: 'bg-gradient-to-r from-[#232f3e] to-[#37475a]', title: 'UP TO 75% OFF', sub1: 'Great Indian Festival', sub2: 'EXTRA 10% OFF', sub2desc: 'On Specific Products', cta: 'BUY NOW', emoji: '📦' },
  { name: 'Ajio', bg: 'bg-gradient-to-r from-[#c0392b] to-[#96281b]', title: 'FLAT 50% OFF', sub1: 'On All Fashion Brands', sub2: 'EXTRA 20% OFF', sub2desc: 'On Nykaa Collections', cta: 'EXPLORE', emoji: '👗' },
  { name: 'HP', bg: 'bg-gradient-to-r from-[#0055a5] to-[#003d75]', title: 'UP TO ₹15000 OFF', sub1: 'On Laptops & Printers', sub2: 'EMI FROM ₹999', sub2desc: 'No Cost EMI Available', cta: 'SHOP NOW', emoji: '🖥️' },
  { name: 'Radisson', bg: 'bg-gradient-to-r from-[#8b0000] to-[#c0392b]', title: 'UP TO 25% OFF', sub1: 'On Hotel Bookings', sub2: 'FREE BREAKFAST', sub2desc: 'On Select Properties', cta: 'BOOK NOW', emoji: '🏨' },
  { name: 'Air India', bg: 'bg-gradient-to-r from-[#c0392b] to-[#922b21]', title: 'UP TO ₹3000 OFF', sub1: 'On International Flights', sub2: 'FLAT ₹300 OFF', sub2desc: 'On Domestic Flights', cta: 'BOOK NOW', emoji: '✈️', isAirIndia: true },
];

const rightCards = [
  { name: 'UBER', bg: 'bg-gradient-to-br from-gray-800 to-black', badge: 'FLAT 50% OFF', desc: 'Exclusive Offer: Flat 50% OFF On Your First 3 Rides', cta: 'GRAB NOW', emoji: '🚕' },
  { name: 'Udemy', bg: 'bg-gradient-to-br from-purple-700 to-purple-900', badge: 'UP TO 97% OFF', desc: 'Save Up To 97% On Best Selling Courses This Week', cta: 'LEARN NOW', emoji: '📚' },
  { name: 'Google Workspace', bg: 'bg-gradient-to-br from-blue-600 to-blue-800', badge: 'FREE TRIAL', desc: 'Up To ₹4,000 OFF On Minimum Starter Plan For First 6 Months', cta: 'GRAB NOW', emoji: '🔧' },
];

export default function HeroBanner() {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const secondary = siteConfig?.theme?.secondaryColor || '#9333ea';
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');
  const mutedText = isDark ? `${darkPalette.text}99` : `${textColor}80`;
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const borderClr = isDark ? `${darkPalette.text}20` : `${textColor}15`;
  const accentColor = siteConfig?.theme?.accentColor || '#f59e0b';

  const [activeLeft, setActiveLeft] = useState(8);
  const [activeRight, setActiveRight] = useState(0);

  const brand = leftBrands[activeLeft];
  const rightCard = rightCards[activeRight];

  const prevSlide = useCallback(() => setActiveLeft((p) => (p - 1 + leftBrands.length) % leftBrands.length), []);
  const nextSlide = useCallback(() => setActiveLeft((p) => (p + 1) % leftBrands.length), []);

  useEffect(() => {
    const id = setInterval(nextSlide, 4000);
    return () => clearInterval(id);
  }, [activeLeft, nextSlide]);

  useEffect(() => {
    const id = setInterval(() => setActiveRight((p) => (p + 1) % rightCards.length), 5000);
    return () => clearInterval(id);
  }, [activeRight]);

  return (
    <section className="max-w-7xl mx-auto px-4 pt-4">
      <div className="flex gap-3">
        {/* LEFT: Main Banner */}
        <div className="flex-1 min-w-0">
          <div className="relative rounded-xl overflow-hidden">
            <div className={`${brand.bg} p-6 md:p-8 min-h-[180px] md:min-h-[200px] flex flex-col justify-center relative`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white text-lg font-extrabold uppercase tracking-wide">
                  {brand.name}
                </span>
                {brand.isAirIndia && <span className="text-white text-lg">✈</span>}
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                {brand.title}
              </h2>
              <p className="text-white/80 text-sm font-medium mb-3">{brand.sub1}</p>

              <div className="border-t border-white/30 my-2 w-3/4" style={{ borderStyle: 'dashed' }} />

              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-1">{brand.sub2}</h3>
              <p className="text-white/80 text-sm font-medium mb-4">{brand.sub2desc}</p>

              <button
                className="px-6 py-2.5 font-extrabold text-sm rounded-md transition-all w-fit shadow-lg tracking-wide"
                style={{ backgroundColor: cardBg, color: primary }}
              >
                {brand.cta}
              </button>

              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl md:text-9xl opacity-90 select-none">
                {brand.emoji}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 backdrop-blur rounded-full flex items-center justify-center transition-colors shadow z-10"
              style={{ backgroundColor: `${cardBg}cc`, color: textColor }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 backdrop-blur rounded-full flex items-center justify-center transition-colors shadow z-10"
              style={{ backgroundColor: `${cardBg}cc`, color: textColor }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Left brand tabs */}
          <div className="flex items-center overflow-x-auto scrollbar-hide py-3 gap-1 border-b" style={{ borderColor: borderClr }}>
            {leftBrands.map((b, i) => (
              <button
                key={b.name}
                onClick={() => setActiveLeft(i)}
                className="relative px-3 py-1.5 text-sm whitespace-nowrap transition-all font-medium rounded-sm"
                style={{ color: i === activeLeft ? primary : mutedText, fontWeight: i === activeLeft ? 600 : 500 }}
              >
                {b.name}
                {i === activeLeft && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Card Panel */}
        <div className="w-[260px] shrink-0 hidden md:flex flex-col">
          <div className={`${rightCard.bg} rounded-t-xl p-5 flex-1 flex flex-col justify-between min-h-[140px] relative overflow-hidden`}>
            <div className="text-6xl absolute right-4 bottom-2 opacity-70 select-none">{rightCard.emoji}</div>
            <div className="relative z-10">
              <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-xs font-bold rounded mb-2">
                {rightCard.badge}
              </span>
            </div>
          </div>

          <div className="border border-t-0 rounded-b-xl p-4 shadow-sm" style={{ backgroundColor: cardBg, borderColor: borderClr }}>
            <p className="text-xs font-bold mb-1" style={{ color: mutedText }}>{rightCard.badge}</p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: textColor }}>{rightCard.desc}</p>
            <button className="text-xs font-bold hover:underline tracking-wide" style={{ color: primary }}>{rightCard.cta}</button>
          </div>

          {/* Right tabs */}
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide border-b" style={{ borderColor: borderClr }}>
            {rightCards.map((rc, i) => (
              <button
                key={rc.name}
                onClick={() => setActiveRight(i)}
                className="relative px-3 py-1.5 text-sm whitespace-nowrap transition-all font-medium rounded-sm"
                style={{ color: i === activeRight ? primary : mutedText, fontWeight: i === activeRight ? 600 : 500 }}
              >
                {rc.name}
                {i === activeRight && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="w-full text-center text-xs py-3 flex items-center justify-center gap-2" style={{ color: mutedText }}>
        <span className="w-6 h-px inline-block" style={{ backgroundColor: accentColor }} />
        · India&apos;s Leading Coupons &amp; Deals Marketplace ·
        <span className="w-6 h-px inline-block" style={{ backgroundColor: accentColor }} />
      </p>
    </section>
  );
}
