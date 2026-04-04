'use client';

import { useState, useEffect } from 'react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import { getDeals } from '@/services/api';
import PromoModal from '@/components/coupon/PromoModal';

function OfferCard({ offer, primary, textColor, mutedText, cardBg, borderClr, isDark, darkBg, redeemLabel, onRedeem }: any) {
  const handleRedeem = () => {
    if (offer.link) window.open(offer.link, '_blank', 'noopener,noreferrer');
    onRedeem(offer);
  };

  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 border"
      style={{ backgroundColor: cardBg, borderColor: borderClr, height: 320 }} onClick={handleRedeem}>
      <div className="relative overflow-hidden shrink-0 h-[160px] group-hover:h-[80px] transition-all duration-300"
        style={{ backgroundColor: isDark ? darkBg : '#f3f4f6' }}>
        {offer.image && <img src={offer.image} alt={offer.brandName} className="w-full h-full object-cover object-center" />}
      </div>
      {offer.logo && (
        <div className="relative z-10 px-4 -mt-[18px]">
          <div className="w-10 h-10 rounded-full shadow-md border overflow-hidden" style={{ backgroundColor: '#ffffff', borderColor: borderClr }}>
            <img src={offer.logo} alt={offer.brandName} className="w-full h-full object-contain p-1" />
          </div>
        </div>
      )}
      <div className="px-5 pt-2 pb-4 flex flex-col" style={{ height: offer.logo ? 'calc(100% - 160px + 18px)' : 'calc(100% - 160px)' }}>
        <h3 className="font-bold text-base uppercase tracking-wide mb-1 group-hover:text-sm group-hover:mb-0.5 transition-all duration-300"
          style={{ color: offer.isExclusive ? primary : textColor }}>{offer.badgeText}</h3>
        <p className="text-sm leading-relaxed line-clamp-2 transition-all duration-300" style={{ color: mutedText }}>
          {offer.description || offer.title}
        </p>
        <div className="flex-1" />
        <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-300 ease-in-out">
          <div className="border-t border-dashed mb-3" style={{ borderColor: borderClr }} />
          <button onClick={(e) => { e.stopPropagation(); handleRedeem(); }}
            className="w-full py-2.5 rounded-lg font-extrabold text-sm tracking-widest transition-colors"
            style={{ backgroundColor: primary, color: '#ffffff' }}>{redeemLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default function PopularOffers() {
  const { siteConfig, darkPalette, labels } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');
  const mutedText = isDark ? `${darkPalette.text}99` : `${textColor}80`;
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const borderClr = isDark ? `${darkPalette.text}15` : `${textColor}12`;
  const redeemLabel = labels?.homepage?.redeemNow || 'REDEEM NOW';

  const [offers, setOffers] = useState<any[]>([]);
  const [modalData, setModalData] = useState<any>(null);

  useEffect(() => {
    getDeals({ section: 'popular_offers', limit: 4 })
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        const serverUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        setOffers((Array.isArray(data) ? data : []).map((d: any) => {
          const storeLogo = d.logo || (d.store?.logo ? (d.store.logo.startsWith('http') ? d.store.logo : `${serverUrl}${d.store.logo}`) : '');
          return {
            title: d.title || '', description: d.description || '', badgeText: d.discount || 'DEAL', image: d.image || '',
            logo: storeLogo, brandName: d.store?.storeName || '', isExclusive: d.isFeatured || false,
            link: d.link || d.store?.websiteUrl || '', code: d.couponCode || '',
            discount: d.discount || '', storeName: d.store?.storeName || '',
            details: d.description || '', expiryDate: d.expiryDate || '',
          };
        }));
      }).catch(() => {});
  }, []);

  if (offers.length === 0) return null;

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: textColor }}>
          {labels?.homepage?.popularOffersTitle || 'Popular Offers of the Day'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {offers.map((offer, i) => (
            <OfferCard key={i} offer={offer} primary={primary} textColor={textColor} mutedText={mutedText}
              cardBg={cardBg} borderClr={borderClr} isDark={isDark} darkBg={darkPalette.bg}
              redeemLabel={redeemLabel} onRedeem={setModalData} />
          ))}
        </div>
      </section>
      {modalData && (
        <PromoModal onClose={() => setModalData(null)} title={modalData.title} code={modalData.code}
          discount={modalData.discount} storeName={modalData.storeName || modalData.brandName}
          storeLogo={modalData.logo} storeUrl={modalData.link} expiryDate={modalData.expiryDate} details={modalData.details} />
      )}
    </>
  );
}
