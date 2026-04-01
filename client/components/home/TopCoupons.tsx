'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Flame, Plane, Smartphone, Shirt, UtensilsCrossed, Monitor } from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

const tabs = [
  { label: 'Most Used', icon: Flame },
  { label: 'Travel', icon: Plane },
  { label: 'Recharge', icon: Smartphone },
  { label: 'Fashion', icon: Shirt },
  { label: 'Food', icon: UtensilsCrossed },
  { label: 'Electronics', icon: Monitor },
];

const coupons = [
  {
    badge: 'GRABON EXCLUSIVE',
    title: 'Up To 50% OFF + Additional Rs 150 OFF | All Users',
    store: 'MuscleBlaze',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1741071498498.png',
    link: 'View All MuscleBlaze Coupons',
  },
  {
    badge: 'FLAT 10% OFF',
    title: 'Flat 10% OFF On Your Travel Bookings',
    store: 'Fresh Bus',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1741071498498.png',
    link: 'View All Fresh Bus Coupons',
  },
  {
    badge: 'UP TO 93% OFF',
    title: 'Up To 83% OFF + Extra 10% OFF On Web Hosting + 3 Months FREE',
    store: 'Hostinger',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237471658/hostinger-logo.jpg',
    link: 'View All Hostinger Coupons',
  },
  {
    badge: 'UP TO 20% OFF',
    title: 'Flight Bookings: Grab Up To 20% OFF + Zero Convenience Fee',
    store: 'Air India',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1741071498498.png',
    link: 'View All Air India Coupons',
  },
  {
    badge: 'GRABON EXCLUSIVE',
    title: 'Flat 40% OFF + Extra 10% OFF On All Hosting Plans',
    store: 'Ultahost',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1741071498498.png',
    link: 'View All Ultahost Coupons',
  },
  {
    badge: 'GRABON EXCLUSIVE',
    title: 'Up To 50% OFF + Extra 20% OFF + Cashback',
    store: 'Kapiva',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1741071498498.png',
    link: 'View All Kapiva Coupons',
  },
];

export default function TopCoupons() {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');
  const mutedText = isDark ? `${darkPalette.text}99` : `${textColor}80`;
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const borderClr = isDark ? `${darkPalette.text}15` : `${textColor}12`;
  const sectionBg = isDark ? darkPalette.bg : '#f9fafb';

  const [activeTab, setActiveTab] = useState('Most Used');
  const [fade, setFade] = useState(true);
  const [page, setPage] = useState(0);

  const switchTab = (label: string) => {
    setFade(false);
    setTimeout(() => {
      setActiveTab(label);
      setFade(true);
    }, 200);
  };
  const perPage = 6;
  const totalPages = Math.ceil(coupons.length / perPage);
  const visible = coupons.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-8" style={{ backgroundColor: sectionBg }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: textColor }}>
            Today&apos;s Top Coupons &amp; Offers
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: borderClr, color: mutedText, backgroundColor: cardBg }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <span
                  key={i}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === page ? 20 : 8,
                    backgroundColor: i === page ? primary : (isDark ? `${darkPalette.text}30` : '#d1d5db'),
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: borderClr, color: mutedText, backgroundColor: cardBg }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {tabs.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => switchTab(label)}
              className="flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: activeTab === label ? primary : cardBg,
                color: activeTab === label ? '#ffffff' : textColor,
                borderColor: activeTab === label ? primary : (isDark ? `${darkPalette.text}30` : '#d1d5db'),
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-300"
          style={{ opacity: fade ? 1 : 0 }}
        >
          {visible.map((item, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col cursor-pointer"
              style={{ backgroundColor: cardBg, borderColor: borderClr, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', minHeight: 200 }}
            >
              {/* Top Content */}
              <div className="flex p-5 gap-4 flex-1 items-center">
                <div
                  className="min-w-[90px] flex items-center justify-center font-bold text-center text-sm"
                  style={{ color: primary }}
                >
                  {item.badge}
                </div>
                <div className="border-l border-dashed self-stretch" style={{ borderColor: borderClr }} />
                <div className="text-sm leading-relaxed flex items-center" style={{ color: mutedText }}>
                  {item.title}
                </div>
              </div>

              {/* Bottom Strip */}
              <div
                className="flex justify-between items-center border-t px-4 py-3"
                style={{ borderColor: borderClr, backgroundColor: sectionBg }}
              >
                <div className="flex items-center gap-2">
                  <img src={item.logo} alt={item.store} className="h-6 object-contain" />
                </div>
                <div
                  className="flex items-center gap-1 text-sm cursor-pointer hover:underline"
                  style={{ color: primary }}
                >
                  {item.link}
                  <ExternalLink size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
