'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import { getBanners } from '@/services/api';
import PromoModal from '@/components/coupon/PromoModal';

export default function HeroBanner() {
  const { siteConfig, darkPalette, labels } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const secondary = siteConfig?.theme?.secondaryColor || '#9333ea';
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');
  const mutedText = isDark ? `${darkPalette.text}99` : `${textColor}80`;
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const borderClr = isDark ? `${darkPalette.text}20` : `${textColor}15`;
  const accentColor = siteConfig?.theme?.accentColor || '#f59e0b';

  const [leftBrands, setLeftBrands] = useState<any[]>([]);
  const [rightCards, setRightCards] = useState<any[]>([]);
  const [activeLeft, setActiveLeft] = useState(0);
  const [activeRight, setActiveRight] = useState(0);
  const [modalData, setModalData] = useState<any>(null);

  useEffect(() => {
    const shopNow = labels?.homepage?.shopNow || 'SHOP NOW';
    getBanners()
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        const active = (Array.isArray(data) ? data : []).filter((b: any) => b.isActive);

        const left = active.filter((b: any) => b.bannerType !== 'hero_right').map((b: any) => ({
          name: b.label || b.title?.split(' ')[0] || '',
          bgColor: b.bgColor || '#673de6',
          title: b.discount || b.title || '',
          sub1: (b.title && b.title !== b.label) ? b.title : '',
          sub2: b.secondDiscount || (b.couponCode ? `CODE: ${b.couponCode}` : ''),
          sub2desc: b.secondDiscountDesc ?? b.description ?? '',
          cta: b.cta ?? '',
          image: b.image || '',
          emoji: b.emoji || '',
          link: b.storeUrl || b.buttonLink || '',
          isImageOnly: !!(b.image && !b.discount && !b.title && !b.cta),
          // modal data
          storeName: (b.store as any)?.storeName || b.label || '',
          storeLogo: (b.store as any)?.logo || '',
          code: b.couponCode || '',
          discount: b.discount || '',
          details: b.description || '',
          expiryDate: b.expiryDate || '',
        }));

        const right = active.filter((b: any) => b.bannerType === 'hero_right').map((b: any) => ({
          name: b.label || b.title?.split(' ')[0] || '',
          badge: b.discount || 'DEAL',
          desc: b.title ?? '',
          cta: b.cta ?? '',
          emoji: b.emoji || '',
          image: b.image || '',
          cardBgColor: b.cardBgColor || '',
          link: b.storeUrl || b.buttonLink || '',
          storeName: (b.store as any)?.storeName || b.label || '',
          code: b.couponCode || '',
          discount: b.discount || '',
          details: b.description || '',
          expiryDate: b.expiryDate || '',
        }));

        if (left.length > 0) setLeftBrands(left);
        if (right.length > 0) setRightCards(right);
      })
      .catch((err) => console.error('HeroBanner fetch error:', err));
  }, [labels]);

  const brand = leftBrands[activeLeft];
  const rightCard = rightCards[activeRight];

  const prevSlide = useCallback(() => setActiveLeft((p) => (p - 1 + leftBrands.length) % leftBrands.length), [leftBrands.length]);
  const nextSlide = useCallback(() => setActiveLeft((p) => (p + 1) % leftBrands.length), [leftBrands.length]);

  useEffect(() => {
    if (leftBrands.length <= 1) return;
    const id = setInterval(nextSlide, 4000);
    return () => clearInterval(id);
  }, [activeLeft, nextSlide, leftBrands.length]);

  useEffect(() => {
    if (rightCards.length <= 1) return;
    const id = setInterval(() => setActiveRight((p) => (p + 1) % rightCards.length), 5000);
    return () => clearInterval(id);
  }, [activeRight, rightCards.length]);

  if (leftBrands.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 pt-4">
      <div className="flex gap-3">
        {/* LEFT: Main Banner */}
        <div className="flex-1 min-w-0">
          <div className="relative rounded-xl overflow-hidden">
            <div className="min-h-[280px] md:min-h-[350px] flex flex-col justify-center relative cursor-pointer"
              onClick={() => {
                if (brand.code) navigator.clipboard.writeText(brand.code).catch(() => {});
                if (brand.link) window.open(brand.link, '_blank', 'noopener,noreferrer');
                setModalData(brand);
              }}
              style={{ background: !brand.image ? `linear-gradient(135deg, ${brand.bgColor}, ${brand.bgColor}cc)` : undefined }}>
              {brand.image && (
                <>
                  <img src={brand.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  {!brand.isImageOnly && <div className="absolute inset-0 bg-black/40" />}
                </>
              )}
              {!brand.isImageOnly && (
              <div className="relative z-10 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white text-lg font-extrabold uppercase tracking-wide">{brand.name}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-1">{brand.title}</h2>
                {brand.sub1 && <p className="text-white/80 text-sm font-medium mb-3">{brand.sub1}</p>}

                {brand.sub2 && (
                  <>
                    <div className="border-t border-white/30 my-2 w-3/4" style={{ borderStyle: 'dashed' }} />
                    <h3 className="text-xl md:text-2xl font-extrabold text-white mb-1">{brand.sub2}</h3>
                    <p className="text-white/80 text-sm font-medium mb-4">{brand.sub2desc}</p>
                  </>
                )}

                {brand.cta && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (brand.code) navigator.clipboard.writeText(brand.code).catch(() => {});
                    if (brand.link) window.open(brand.link, '_blank', 'noopener,noreferrer');
                    setModalData(brand);
                  }}
                  className="px-6 py-2.5 font-extrabold text-sm rounded-md transition-all w-fit shadow-lg tracking-wide cursor-pointer"
                  style={{ backgroundColor: cardBg, color: primary }}>
                  {brand.cta}
                </button>
                )}
              </div>
              )}

              {!brand.image && brand.emoji && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl md:text-9xl opacity-90 select-none">
                  {brand.emoji}
                </div>
              )}
            </div>
          </div>

          {/* Left brand tabs */}
          <div className="flex items-center overflow-x-auto scrollbar-hide py-3 gap-1 border-b" style={{ borderColor: borderClr }}>
            {leftBrands.map((b, i) => (
              <button key={b.name + i} onClick={() => setActiveLeft(i)}
                className="relative px-3 py-1.5 text-sm whitespace-nowrap transition-all font-medium rounded-sm"
                style={{ color: i === activeLeft ? primary : mutedText, fontWeight: i === activeLeft ? 600 : 500 }}>
                {b.name}
                {i === activeLeft && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Card Panel */}
        {rightCard && (
          <div className="w-[260px] shrink-0 hidden md:flex flex-col">
            <div className="rounded-t-xl flex-1 flex flex-col justify-between min-h-[180px] md:min-h-[230px] relative overflow-hidden cursor-pointer"
              onClick={() => {
                if (rightCard.code) navigator.clipboard.writeText(rightCard.code).catch(() => {});
                if (rightCard.link) window.open(rightCard.link, '_blank', 'noopener,noreferrer');
                setModalData(rightCard);
              }}
              style={{ background: !rightCard.image ? (rightCard.cardBgColor ? `linear-gradient(135deg, ${rightCard.cardBgColor}, ${rightCard.cardBgColor}cc)` : `linear-gradient(135deg, ${primary}, ${secondary})`) : undefined }}>
              {rightCard.image ? (
                <img src={rightCard.image} alt="" className="w-full h-full object-cover absolute inset-0" />
              ) : rightCard.emoji ? (
                <div className="text-6xl absolute right-4 bottom-2 opacity-70 select-none">{rightCard.emoji}</div>
              ) : null}
              <div className="relative z-10 p-5">
                <span className="inline-block px-2 py-0.5 text-xs font-bold rounded mb-2 backdrop-blur-sm" style={{ backgroundColor: `${primary}cc`, color: '#ffffff' }}>{rightCard.badge}</span>
              </div>
            </div>

            <div className="border border-t-0 rounded-b-xl p-4 shadow-sm" style={{ backgroundColor: cardBg, borderColor: borderClr }}>
              <p className="text-xs font-bold mb-1" style={{ color: mutedText }}>{rightCard.badge}</p>
              <p className="text-xs leading-relaxed mb-3" style={{ color: textColor }}>{rightCard.desc}</p>
              {rightCard.cta && <button onClick={(e) => {
                    e.stopPropagation();
                    if (rightCard.code) navigator.clipboard.writeText(rightCard.code).catch(() => {});
                    if (rightCard.link) window.open(rightCard.link, '_blank', 'noopener,noreferrer');
                    setModalData(rightCard);
                  }}
                className="text-xs font-bold hover:underline tracking-wide cursor-pointer" style={{ color: primary }}>{rightCard.cta}</button>}
            </div>

            {/* Right tabs */}
            <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide border-b" style={{ borderColor: borderClr }}>
              {rightCards.map((rc, i) => (
                <button key={rc.name + i} onClick={() => setActiveRight(i)}
                  className="relative px-3 py-1.5 text-sm whitespace-nowrap transition-all font-medium rounded-sm"
                  style={{ color: i === activeRight ? primary : mutedText, fontWeight: i === activeRight ? 600 : 500 }}>
                  {rc.name}
                  {i === activeRight && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="w-full text-center text-xs py-3 flex items-center justify-center gap-2" style={{ color: mutedText }}>
        <span className="w-6 h-px inline-block" style={{ backgroundColor: accentColor }} />
        · {labels?.homepage?.tagline || "India's Leading Coupons & Deals Marketplace"} ·
        <span className="w-6 h-px inline-block" style={{ backgroundColor: accentColor }} />
      </p>

      {modalData && (
        <PromoModal onClose={() => setModalData(null)} title={modalData.sub1 || modalData.desc || modalData.title}
          code={modalData.code} discount={modalData.discount} storeName={modalData.storeName}
          storeLogo={modalData.storeLogo} storeUrl={modalData.link}
          expiryDate={modalData.expiryDate} details={modalData.details} />
      )}
    </section>
  );
}
