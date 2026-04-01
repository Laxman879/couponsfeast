'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getDeals } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

const fallbackDeals = [
  { _id: '1', title: 'Portronics SoundDrum P Wireless Bluetooth Speaker', store: { storeName: 'Flipkart', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773826357590/flipkart-logo.jpg', websiteUrl: 'https://flipkart.com' }, image: 'https://cdn.grabon.in/gograbon/images/deal/1761711084907/flipkart-portronics-sounddrum-p-wireless-bluetooth-speaker.JPG', discount: '50% OFF', price: '₹1999', originalPrice: '₹3999' },
  { _id: '2', title: 'boAt Airdopes 141 Bluetooth Truly Wireless Earbuds', store: { storeName: 'Amazon', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773381281318/amazon-logo.jpg', websiteUrl: 'https://amazon.in' }, image: 'https://cdn.grabon.in/gograbon/images/deal/1761711084907/flipkart-portronics-sounddrum-p-wireless-bluetooth-speaker.JPG', discount: '70% OFF', price: '₹899', originalPrice: '₹2999' },
  { _id: '3', title: 'Noise ColorFit Pro 4 Max Smartwatch', store: { storeName: 'Myntra', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1774444164712/myntra-logo.jpg', websiteUrl: 'https://myntra.com' }, image: 'https://cdn.grabon.in/gograbon/images/deal/1761711084907/flipkart-portronics-sounddrum-p-wireless-bluetooth-speaker.JPG', discount: '60% OFF', price: '₹2499', originalPrice: '₹5999' },
  { _id: '4', title: 'Samsung Galaxy M14 5G (6GB RAM, 128GB)', store: { storeName: 'Samsung', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773381281318/amazon-logo.jpg', websiteUrl: 'https://samsung.com' }, image: 'https://cdn.grabon.in/gograbon/images/deal/1761711084907/flipkart-portronics-sounddrum-p-wireless-bluetooth-speaker.JPG', discount: '30% OFF', price: '₹10999', originalPrice: '₹15999' },
];

function DealCard({ deal, primary, borderClr, cardBg, isDark, darkBg }: any) {
  const store = deal.store || {};
  const serverUrl = 'http://localhost:5000';
  const rawLogo = store.logo || '';
  const logo = rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '';
  const rawImage = deal.image || '';
  const image = rawImage.startsWith('http') ? rawImage : rawImage ? `${serverUrl}${rawImage}` : '';

  const handleBuy = () => {
    const url = deal.link || store.websiteUrl || '';
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 border"
      style={{ backgroundColor: cardBg, borderColor: borderClr, height: 320 }}
    >
      {/* Image — shrinks on hover */}
      <div
        className="relative overflow-hidden h-[170px] group-hover:h-[100px] transition-all duration-300 flex items-center justify-center"
        style={{ backgroundColor: isDark ? darkBg : '#f3f4f6' }}
      >
        {logo && (
          <div className="absolute top-3 left-3 w-12 h-12 rounded-full shadow-md z-10 overflow-hidden group-hover:w-9 group-hover:h-9 transition-all duration-300">
            <img src={logo} alt={store.storeName} className="w-full h-full object-cover" />
          </div>
        )}
        {image && <img src={image} alt={deal.title} className="w-full h-full object-cover transition-all duration-300" />}
      </div>

      {/* Discount Badge */}
      <div className="flex justify-center -mt-4 relative z-10">
        <span className="text-white text-xs px-3 py-1 rounded-md font-semibold shadow" style={{ backgroundColor: primary }}>
          {deal.discount || 'DEAL'}
        </span>
      </div>

      {/* Content — fixed space, button revealed inside */}
      <div className="px-4 pt-2 pb-3 text-center flex flex-col" style={{ height: 'calc(100% - 170px + 16px)' }}>
        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-snug line-clamp-2">{deal.title}</p>
        <p className="text-gray-400 text-xs mt-1">By {store.storeName}</p>
        <div className="mt-1.5 flex justify-center items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{deal.price || deal.discount || ''}</span>
          {deal.originalPrice && <span className="text-gray-400 line-through text-sm">{deal.originalPrice}</span>}
        </div>

        <div className="flex-1" />

        {/* BUY NOW — revealed on hover, no height change since card is fixed */}
        <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-300 ease-in-out">
          <div className="border-t border-dashed mb-2" style={{ borderColor: borderClr }} />
          <button
            onClick={handleBuy}
            className="w-full py-2 rounded-lg font-extrabold text-sm tracking-widest transition-colors text-white"
            style={{ backgroundColor: primary }}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DealsOfTheDay() {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const borderClr = isDark ? `${darkPalette.text}15` : `${textColor}12`;

  const [deals, setDeals] = useState<any[]>(fallbackDeals);

  useEffect(() => {
    getDeals({ limit: 4 })
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        const active = (Array.isArray(data) ? data : []).filter((d: any) => d.isActive);
        if (active.length > 0) setDeals(active.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: textColor }}>
          Deals Of The Day
        </h2>
        <Link
          href="/deals"
          className="flex items-center gap-1 text-sm font-semibold no-underline transition-opacity hover:opacity-80"
          style={{ color: primary }}
        >
          View More Deals
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {deals.slice(0, 4).map((deal, i) => (
          <DealCard key={deal._id || i} deal={deal} primary={primary} borderClr={borderClr} cardBg={cardBg} isDark={isDark} darkBg={darkPalette.bg} />
        ))}
      </div>
    </section>
  );
}
