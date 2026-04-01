'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

const collections = [
  {
    title: 'Hostinger Coupons',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237471658/hostinger-logo.jpg',
    bg: 'https://cdn.grabon.in/gograbon/images/banners/banner-1773985985134.jpg',
    coupons: [
      { badge: 'DOMAIN EXCLUSIVE', desc: 'Hostinger Domain Coupon: Up To 87% OFF + Extra 10% OFF' },
      { badge: 'UP TO 83% OFF', desc: 'Special Coupon Code: Up To 83% OFF + Extra 15% OFF On 48 Months Plan' },
      { badge: 'UP TO 93% OFF', desc: 'Exclusive Offer: FREE Domain + 3 Months FREE + Up To 83% OFF + Additional 10% OFF' },
    ],
  },
  {
    title: 'Uber Coupons',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237619521/uber-logo.jpg',
    bg: 'https://cdn.grabon.in/gograbon/images/banners/banner-1774978392101.jpg',
    coupons: [
      { badge: 'FLAT 50% OFF', desc: 'Flat 50% OFF on Uber Moto Bookings' },
      { badge: 'FLAT 50% OFF', desc: '50% OFF on Auto Bookings' },
    ],
  },
  {
    title: 'Savaari Coupons',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237574186/savaari-logo.jpg',
    bg: 'https://cdn.grabon.in/gograbon/images/banners/banner-1773985999942.jpg',
    coupons: [
      { badge: 'UP TO ₹500 OFF', desc: 'Get ₹500 OFF on first booking' },
    ],
  },
  {
    title: 'Redrail Coupons',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237565709/redrail-logo.jpg',
    bg: 'https://cdn.grabon.in/gograbon/images/banners/banner-1773811929693.jpg',
    coupons: [
      { badge: 'FLAT ₹100 OFF', desc: 'Flat ₹100 OFF on ticket booking' },
    ],
  },
];

function CollectionCard({ item, primary, cardBg, borderClr, textColor, mutedText, accentColor }: any) {
  const [index, setIndex] = useState(0);
  const total = item.coupons.length;
  const prev = () => setIndex(i => (i - 1 + total) % total);
  const next = () => setIndex(i => (i + 1) % total);

  return (
    <div
      className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
      style={{ backgroundColor: cardBg, borderColor: borderClr }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm shrink-0">
          <img src={item.logo} alt={item.title} className="w-full h-full object-cover" />
        </div>
        <p className="font-semibold text-sm" style={{ color: textColor }}>{item.title}</p>
      </div>

      {/* Image area with overlay */}
      <div className="relative mx-4 mb-4 h-[300px] sm:h-[330px] md:h-[350px] rounded-xl overflow-hidden">
        {/* Background image — always full, never resizes */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${item.bg})` }}
        />

        {/* Overlay panel — slides up on hover, covers image except top 10px */}
        <div
          className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-t-xl px-4 flex flex-col items-center justify-center"
          style={{ backgroundColor: cardBg, top: 10 }}
        >
          <p className="font-bold text-base text-center" style={{ color: primary }}>
            {item.coupons[index].badge}
          </p>
          <p className="text-xs mt-1 text-center line-clamp-2 leading-relaxed" style={{ color: mutedText }}>
            {item.coupons[index].desc}
          </p>

          {/* Prev / Dots / Next */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <button onClick={prev} className="w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer" style={{ backgroundColor: borderClr, color: mutedText }}>
                <ChevronLeft className="w-3 h-3" />
              </button>
              <div className="flex gap-1.5">
                {item.coupons.map((_: any, i: number) => (
                  <span
                    key={i}
                    onClick={() => setIndex(i)}
                    className="h-2 rounded-full cursor-pointer transition-all"
                    style={{
                      width: i === index ? 20 : 8,
                      backgroundColor: i === index ? accentColor : borderClr,
                    }}
                  />
                ))}
              </div>
              <button onClick={next} className="w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer" style={{ backgroundColor: borderClr, color: mutedText }}>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Redeem Button */}
          <button
            className="w-full mt-2 py-2 rounded-lg font-extrabold text-sm tracking-widest text-white transition-colors hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: primary }}
          >
            REDEEM NOW
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Collections() {
  const { siteConfig, darkPalette } = useDynamicTheme();
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

  return (
    <section className="py-8" style={{ backgroundColor: sectionBg }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: textColor }}>
          {siteName} Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {collections.map((item, i) => (
            <CollectionCard
              key={i}
              item={item}
              primary={primary}
              cardBg={cardBg}
              borderClr={borderClr}
              textColor={textColor}
              mutedText={mutedText}
              accentColor={accentColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
