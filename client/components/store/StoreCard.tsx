'use client';
import React, { memo } from 'react';
import Link from 'next/link';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

interface StoreCardProps {
  store: {
    _id: string;
    storeName?: string;
    name?: string;
    slug: string;
    logo?: string;
    description?: string;
    category?: string;
    websiteUrl?: string;
  };
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const name = store.storeName || store.name || 'Store';
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const cardBorder = isDark ? darkPalette.cardBg : '#f3f4f6';
  const nameColor = isDark ? darkPalette.text : '#1f2937';
  const descColor = isDark ? (darkPalette.text + 'aa') : '#6b7280';
  const logoBg = isDark ? darkPalette.cardBg : '#f9fafb';

  const domain = store.websiteUrl
    ? store.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    : `${store.slug}.com`;

  return (
    <Link href={`/view/${domain}`} className="no-underline block group">
      <div className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col items-center text-center h-full"
        style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
        <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-3 overflow-hidden" style={{ backgroundColor: logoBg }}>
          {store.logo ? (
            <img src={store.logo} alt={name} className="w-full h-full object-contain p-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold rounded-xl" style={{ backgroundColor: primary }}>
              {name.charAt(0)}
            </div>
          )}
        </div>
        <p className="text-sm font-bold mb-1 truncate w-full" style={{ color: nameColor }}>{name}</p>
        {store.description && (
          <p className="text-xs line-clamp-2 mb-3" style={{ color: descColor }}>{store.description}</p>
        )}
        <span className="mt-auto text-xs font-semibold px-3 py-1.5 rounded-full text-white transition-opacity group-hover:opacity-90" style={{ backgroundColor: primary }}>
          View Coupons
        </span>
      </div>
    </Link>
  );
};

export default memo(StoreCard);
