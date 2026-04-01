'use client';

import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

const offers = [
  {
    isExclusive: true,
    badgeText: 'GRABON EXCLUSIVE',
    title: 'Exclusive Offer - Get Up To Rs 500 OFF On Your Bus Ticket Bookings',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=220&fit=crop&crop=top',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1755522568013.jpg',
    brandName: 'redBus',
  },
  {
    isExclusive: false,
    badgeText: 'EOFY Sale',
    title: 'Up To 40% OFF Select PCs & Accessories + 10% OFF on Monitor & Poly headset',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=220&fit=crop&crop=top',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1769688659324.jpg',
    brandName: 'HP',
  },
  {
    isExclusive: true,
    badgeText: 'GRABON EXCLUSIVE',
    title: 'Grab Up To Rs 500 On Your First Car Rental Booking!',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=220&fit=crop&crop=top',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1761828655846.jpg',
    brandName: 'SAVAARI',
  },
  {
    isExclusive: true,
    badgeText: 'SITEWIDE OFF',
    title: 'Subscribe To Monthly & Annual Plan & Save 20% OFF!',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=220&fit=crop&crop=top',
    logo: 'https://cdn.grabon.in/gograbon/images/merchant/1760160985107.jpg',
    brandName: 'INTERNXT',
  },
];

function OfferCard({ offer, primary, textColor, mutedText, cardBg, borderClr, isDark, darkBg }: any) {
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 border"
      style={{ backgroundColor: cardBg, borderColor: borderClr, height: 320 }}
    >
      {/* Top Image — shrinks on hover */}
      <div
        className="relative overflow-hidden shrink-0 h-[160px] group-hover:h-[80px] transition-all duration-300"
        style={{ backgroundColor: isDark ? darkBg : '#f3f4f6' }}
      >
        <img
          src={offer.image}
          alt={offer.brandName}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Logo pill — sits between image and content */}
      <div className="relative z-10 px-4 -mt-[18px]">
        <div
          className="w-10 h-10 rounded-full shadow-md border overflow-hidden"
          style={{ backgroundColor: '#ffffff', borderColor: borderClr }}
        >
          <img src={offer.logo} alt={offer.brandName} className="w-full h-full object-contain p-1" />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-2 pb-4 flex flex-col" style={{ height: 'calc(100% - 160px + 18px)' }}>
        <h3
          className="font-bold text-base uppercase tracking-wide mb-1 group-hover:text-sm group-hover:mb-0.5 transition-all duration-300"
          style={{ color: offer.isExclusive ? primary : textColor }}
        >
          {offer.badgeText}
        </h3>

        <p
          className="text-sm leading-relaxed line-clamp-2 transition-all duration-300"
          style={{ color: mutedText }}
        >
          {offer.title}
        </p>

        {/* Spacer pushes button to bottom */}
        <div className="flex-1" />

        {/* Dashed separator + REDEEM NOW — revealed on hover */}
        <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-300 ease-in-out">
          <div className="border-t border-dashed mb-3" style={{ borderColor: borderClr }} />
          <button
            className="w-full py-2.5 rounded-lg font-extrabold text-sm tracking-widest transition-colors"
            style={{ backgroundColor: primary, color: '#ffffff' }}
          >
            REDEEM NOW
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PopularOffers() {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');
  const mutedText = isDark ? `${darkPalette.text}99` : `${textColor}80`;
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const borderClr = isDark ? `${darkPalette.text}15` : `${textColor}12`;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: textColor }}>
        Popular Offers of the Day
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {offers.map((offer, i) => (
          <OfferCard
            key={i}
            offer={offer}
            primary={primary}
            textColor={textColor}
            mutedText={mutedText}
            cardBg={cardBg}
            borderClr={borderClr}
            isDark={isDark}
            darkBg={darkPalette.bg}
          />
        ))}
      </div>
    </section>
  );
}
