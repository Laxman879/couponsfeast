'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getDeals } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import PromoModal from '@/components/coupon/PromoModal';

function DealCard({ deal, primary, borderClr, cardBg, isDark, darkBg, buyLabel, onBuy }: any) {
  const store = deal.store || {};
  const serverUrl = 'http://localhost:5000';
  const rawLogo = store.logo || '';
  const logo = rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '';
  const rawImage = deal.image || '';
  const image = rawImage.startsWith('http') ? rawImage : rawImage ? `${serverUrl}${rawImage}` : '';

  const handleBuy = () => {
    const url = deal.link || store.websiteUrl || '';
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    onBuy({ ...deal, storeName: store.storeName || '', storeLogo: logo, storeUrl: deal.link || store.websiteUrl || '' });
  };

  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 border"
      style={{ backgroundColor: cardBg, borderColor: borderClr, height: 320 }} onClick={handleBuy}>
      <div className="relative overflow-hidden h-[170px] group-hover:h-[100px] transition-all duration-300"
        style={{ backgroundColor: isDark ? darkBg : '#f3f4f6' }}>
        {logo && (
          <div className="absolute top-3 left-3 w-12 h-12 rounded-full shadow-md z-10 overflow-hidden group-hover:w-9 group-hover:h-9 transition-all duration-300">
            <img src={logo} alt={store.storeName} className="w-full h-full object-cover" />
          </div>
        )}
        {image && <img src={image} alt={deal.title} className="w-full h-full object-cover transition-all duration-300" />}
      </div>
      <div className="flex justify-center -mt-4 relative z-10">
        <span className="text-white text-xs px-3 py-1 rounded-md font-semibold shadow" style={{ backgroundColor: primary }}>
          {deal.discount || 'DEAL'}
        </span>
      </div>
      <div className="px-4 pt-2 pb-3 text-center flex flex-col" style={{ height: 'calc(100% - 170px + 16px)' }}>
        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-snug line-clamp-2">{deal.description || deal.title}</p>
        {store.storeName && <p className="text-gray-400 text-xs mt-1">By {store.storeName}</p>}
        <div className="mt-1.5 flex justify-center items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{deal.price || deal.discount || ''}</span>
          {deal.originalPrice && <span className="text-gray-400 line-through text-sm">{deal.originalPrice}</span>}
        </div>
        <div className="flex-1" />
        <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-300 ease-in-out">
          <div className="border-t border-dashed mb-2" style={{ borderColor: borderClr }} />
          <button onClick={(e) => { e.stopPropagation(); handleBuy(); }}
            className="w-full py-2 rounded-lg font-extrabold text-sm tracking-widest transition-colors text-white"
            style={{ backgroundColor: primary }}>{buyLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default function DealsOfTheDay() {
  const { siteConfig, darkPalette, labels } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const borderClr = isDark ? `${darkPalette.text}15` : `${textColor}12`;
  const buyLabel = labels?.homepage?.buyNow || 'BUY NOW';

  const [deals, setDeals] = useState<any[]>([]);
  const [modalData, setModalData] = useState<any>(null);

  useEffect(() => {
    getDeals({ section: 'deals_of_day', limit: 4 })
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        setDeals((Array.isArray(data) ? data : []).filter((d: any) => d.isActive).slice(0, 4));
      }).catch(() => {});
  }, []);

  if (deals.length === 0) return null;

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: textColor }}>
            {labels?.homepage?.dealsTitle || 'Deals Of The Day'}
          </h2>
          <Link href="/deals" className="flex items-center gap-1 text-sm font-semibold no-underline transition-opacity hover:opacity-80" style={{ color: primary }}>
            {labels?.homepage?.viewMoreDeals || 'View More Deals'}<ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((deal, i) => (
            <DealCard key={deal._id || i} deal={deal} primary={primary} borderClr={borderClr}
              cardBg={cardBg} isDark={isDark} darkBg={darkPalette.bg} buyLabel={buyLabel} onBuy={setModalData} />
          ))}
        </div>
      </section>
      {modalData && (
        <PromoModal onClose={() => setModalData(null)} title={modalData.title} code={modalData.code}
          discount={modalData.discount} storeName={modalData.storeName} storeLogo={modalData.storeLogo}
          storeUrl={modalData.storeUrl} expiryDate={modalData.expiryDate} details={modalData.description || modalData.details} />
      )}
    </>
  );
}
