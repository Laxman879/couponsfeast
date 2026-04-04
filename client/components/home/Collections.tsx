'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import { getDeals } from '@/services/api';
import PromoModal from '@/components/coupon/PromoModal';

function CollectionCard({ item, primary, cardBg, borderClr, textColor, mutedText, accentColor, redeemLabel, onRedeem }: any) {
  const [index, setIndex] = useState(0);
  const total = item.coupons?.length || 0;
  const prev = () => setIndex(i => (i - 1 + total) % total);
  const next = () => setIndex(i => (i + 1) % total);

  if (total === 0) return null;

  const handleRedeem = (e: any) => {
    e.stopPropagation();
    const link = item.coupons[index]?.link || item.link || '';
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
    onRedeem(item);
  };

  return (
    <div className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
      style={{ backgroundColor: cardBg, borderColor: borderClr }} onClick={handleRedeem}>
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        {item.logo && (
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm shrink-0">
            <img src={item.logo} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-sm" style={{ color: primary }}>{item.discount || item.title}</p>
          <p className="text-xs leading-snug line-clamp-2 mt-0.5" style={{ color: mutedText }}>{item.description || item.title}</p>
        </div>
      </div>
      <div className="relative mx-4 mb-4 h-[300px] sm:h-[330px] md:h-[350px] rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: item.bg ? `url(${item.bg})` : undefined, backgroundColor: item.bg ? undefined : `${primary}20` }} />
        <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-t-xl px-4 flex flex-col items-center justify-center"
          style={{ backgroundColor: cardBg, top: 10 }}>
          <p className="font-bold text-base text-center" style={{ color: primary }}>{item.coupons[index]?.badge || ''}</p>
          <p className="text-xs mt-1 text-center line-clamp-2 leading-relaxed" style={{ color: mutedText }}>{item.coupons[index]?.desc || ''}</p>
          {total > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer" style={{ backgroundColor: borderClr, color: mutedText }}><ChevronLeft className="w-3 h-3" /></button>
              <div className="flex gap-1.5">
                {item.coupons.map((_: any, i: number) => (
                  <span key={i} onClick={(e) => { e.stopPropagation(); setIndex(i); }} className="h-2 rounded-full cursor-pointer transition-all"
                    style={{ width: i === index ? 20 : 8, backgroundColor: i === index ? accentColor : borderClr }} />
                ))}
              </div>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer" style={{ backgroundColor: borderClr, color: mutedText }}><ChevronRight className="w-3 h-3" /></button>
            </div>
          )}
          <button onClick={handleRedeem}
            className="w-full mt-2 py-2 rounded-lg font-extrabold text-sm tracking-widest text-white transition-colors hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: primary }}>{redeemLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default function Collections() {
  const { siteConfig, darkPalette, labels } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const siteName = siteConfig?.siteName || 'CouponsFeast';
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');
  const mutedText = isDark ? `${darkPalette.text}99` : `${textColor}80`;
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const borderClr = isDark ? `${darkPalette.text}15` : `${textColor}12`;
  const sectionBg = isDark ? darkPalette.bg : '#f9fafb';
  const accentColor = siteConfig?.theme?.accentColor || '#84cc16';
  const collectionsTitle = labels?.homepage?.collectionsTitle || 'Collections';
  const redeemLabel = labels?.homepage?.redeemNow || 'REDEEM NOW';

  const [collections, setCollections] = useState<any[]>([]);
  const [modalData, setModalData] = useState<any>(null);

  useEffect(() => {
    getDeals({ section: 'collections' })
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        const deals = (Array.isArray(data) ? data : []).filter((d: any) => d.isActive);
        setCollections(deals.map((deal: any) => {
          const store = deal.store || {};
          return {
            title: deal.title, description: deal.description || '', logo: deal.logo || store.logo || '', bg: deal.image || '',
            link: deal.link || store.websiteUrl || '', discount: deal.discount || '',
            storeName: store.storeName || '', code: deal.couponCode || '',
            details: deal.description || '', expiryDate: deal.expiryDate || '',
            coupons: [{ badge: deal.discount || 'DEAL', desc: deal.description || deal.title, link: deal.link || '' }],
          };
        }));
      }).catch(() => {});
  }, []);

  if (collections.length === 0) return null;

  return (
    <>
      <section className="py-8" style={{ backgroundColor: sectionBg }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: textColor }}>{siteName} {collectionsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {collections.map((item, i) => (
              <CollectionCard key={i} item={item} primary={primary} cardBg={cardBg} borderClr={borderClr}
                textColor={textColor} mutedText={mutedText} accentColor={accentColor} redeemLabel={redeemLabel}
                onRedeem={setModalData} />
            ))}
          </div>
        </div>
      </section>
      {modalData && (
        <PromoModal onClose={() => setModalData(null)} title={modalData.title} code={modalData.code}
          discount={modalData.discount} storeName={modalData.storeName} storeLogo={modalData.logo}
          storeUrl={modalData.link} expiryDate={modalData.expiryDate} details={modalData.details} />
      )}
    </>
  );
}
