'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

interface Props {
  storeName?: string;
  logoUrl?: string;
  totalCoupons: number;
  couponCount: number;
  offerCount: number;
  freshCount: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function CouponBanner({ storeName, logoUrl, totalCoupons, couponCount, offerCount, freshCount, activeTab, onTabChange }: Props) {
  const { siteConfig } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const cardBg = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const textMain = isDark ? '#f9fafb' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const avgRating = 3.4;
  const votes = 83;

  const tabs = [
    { key: 'all', label: 'All', count: totalCoupons },
    { key: 'coupons', label: 'Coupons', count: couponCount },
    { key: 'offers', label: 'Offers', count: offerCount },
    { key: 'fresh', label: 'Fresh', count: freshCount },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: cardBg, borderColor }}>
      <div className="flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="flex-1 p-6">
          <div className="flex items-start gap-5">
            {/* Logo/Image */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border shrink-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800" style={{ borderColor }}>
              {logoUrl ? (
                <img src={logoUrl} alt={`${storeName} Coupons`} className="w-full h-full object-contain p-2" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white rounded-2xl" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}cc)` }}>
                  {storeName?.[0] || '?'}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold leading-tight" style={{ color: textMain }}>
                Today {storeName} Coupons &amp; Offers
              </h1>
              <p className="text-sm sm:text-base mt-1.5" style={{ color: textMuted }}>
                Best {totalCoupons} Coupons &amp; Offers last validated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>

              {/* Mobile Rating */}
              <div className="flex items-center gap-2 mt-3 lg:hidden">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4" fill={i <= Math.round(avgRating) ? '#facc15' : '#d1d5db'} stroke="none" />
                  ))}
                </div>
                <span className="text-xs font-medium" style={{ color: textMuted }}>Rate This</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-5 border-t pt-4" style={{ borderColor }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  backgroundColor: activeTab === tab.key ? primary : 'transparent',
                  color: activeTab === tab.key ? '#ffffff' : textMuted,
                  border: activeTab === tab.key ? 'none' : `1px solid ${borderColor}`,
                }}
              >
                {tab.label} <span className="font-normal opacity-80">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Section - Rating (desktop) */}
        <div className="hidden lg:flex flex-col items-center justify-center px-8 border-l" style={{ borderColor, minWidth: 200 }}>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className="w-7 h-7"
                  fill={i <= (hoverRating || rating || Math.round(avgRating)) ? '#facc15' : '#d1d5db'}
                  stroke="none"
                />
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold" style={{ color: textMain }}>
            {avgRating} / 5 <span className="font-normal" style={{ color: textMuted }}>({votes} Votes)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
