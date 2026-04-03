'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import { getStores } from '@/services/api';

const fallbackStores = [
  { _id: '1', name: 'Amazon', slug: 'amazon', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773381281318/amazon-logo.jpg', couponCount: 70 },
  { _id: '2', name: 'Flipkart', slug: 'flipkart', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773826357590/flipkart-logo.jpg', couponCount: 47 },
  { _id: '3', name: 'Myntra', slug: 'myntra', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1774444164712/myntra-logo.jpg', couponCount: 54 },
  { _id: '4', name: 'Swiggy', slug: 'swiggy', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237598679/swiggy-logo.jpg', couponCount: 40 },
  { _id: '5', name: 'Zomato', slug: 'zomato', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237646847/zomato-logo.jpg', couponCount: 32 },
  { _id: '6', name: 'Blinkit', slug: 'blinkit', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237406955/blinkit-logo.jpg', couponCount: 30 },
  { _id: '7', name: 'Hostinger', slug: 'hostinger', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237471658/hostinger-logo.jpg', couponCount: 51 },
  { _id: '8', name: 'Rapido', slug: 'rapido', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237563453/rapido-logo.jpg', couponCount: 23 },
  { _id: '9', name: 'Dominos', slug: 'dominos', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237436092/dominos-logo.jpg', couponCount: 16 },
  { _id: '10', name: 'BookMyShow', slug: 'bookmyshow', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237409670/bookmyshow-logo.jpg', couponCount: 40 },
  { _id: '11', name: 'Uber', slug: 'uber', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237625847/uber-logo.jpg', couponCount: 18 },
  { _id: '12', name: 'Ajio', slug: 'ajio', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237395955/ajio-logo.jpg', couponCount: 35 },
];

export default function PopularStores() {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');
  const mutedText = isDark ? `${darkPalette.text}99` : `${textColor}80`;
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const borderClr = isDark ? `${darkPalette.text}15` : `${textColor}12`;

  const [stores, setStores] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const perPage = 12;

  useEffect(() => {
    getStores()
      .then(res => {
        const data = res.data?.data || res.data || [];
        setStores(data.length > 0 ? data : fallbackStores);
      })
      .catch(() => setStores(fallbackStores));
  }, []);

  const totalPages = Math.ceil(stores.length / perPage);
  const visibleStores = stores.slice(page * perPage, page * perPage + perPage);
  const featured = stores[0];

  const prev = () => setPage(p => Math.max(0, p - 1));
  const next = () => setPage(p => Math.min(totalPages - 1, p + 1));

  const storeSlug = (store: any) =>
    store.slug || (store.name || store.storeName || '').toLowerCase().replace(/\s+/g, '-');

  const logoUrl = (store: any) =>
    store.logo?.startsWith('http') ? store.logo : `http://localhost:5000${store.logo}`;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: textColor }}>
          Popular Stores
        </h2>
        <div className="flex items-center gap-3">
          <button onClick={prev} className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors" style={{ borderColor: borderClr, color: mutedText, backgroundColor: cardBg }}>
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
          <button onClick={next} className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors" style={{ borderColor: borderClr, color: mutedText, backgroundColor: cardBg }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Featured Store Card */}
        {featured && (
          <div className="lg:col-span-1">
            <Link
              href={`/coupons/${storeSlug(featured)}-coupons`}
              className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border no-underline group block"
              style={{ backgroundColor: '#000', borderColor: borderClr, height: 320 }}
            >
              {/* Image — shrinks on hover */}
              <div className="relative overflow-hidden h-[200px] group-hover:h-[100px] transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
                  alt="bg"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                />
                <div className="absolute top-4 left-4 z-10">
                  <p className="font-bold text-xs" style={{ color: primary }}>MOST POPULAR</p>
                  <h3 className="text-sm font-semibold text-white">Store Of The Month</h3>
                </div>
              </div>

              {/* Logo pill */}
              <div className="relative z-10 px-4 -mt-[18px]">
                <div className="w-10 h-10 rounded-full shadow-md border overflow-hidden" style={{ backgroundColor: '#ffffff', borderColor: borderClr }}>
                  <img src={logoUrl(featured)} alt={featured.name || featured.storeName} className="w-full h-full object-contain p-1" />
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pt-2 pb-4 flex flex-col" style={{ height: 'calc(100% - 200px + 18px)' }}>
                <h3 className="font-bold text-sm text-white group-hover:text-xs transition-all duration-300">
                  {featured.name || featured.storeName}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {featured.couponCount || featured.coupons?.length || 0} Coupons • {Math.max(1, Math.floor((featured.couponCount || 10) / 5))} Offers
                </p>

                <div className="flex-1" />

                {/* Button — revealed on hover */}
                <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-300 ease-in-out">
                  <div className="border-t border-dashed mb-3" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                  <span
                    className="block w-full py-2 rounded-lg font-extrabold text-sm tracking-widest text-center text-white"
                    style={{ backgroundColor: primary }}
                  >
                    VIEW COUPONS
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Store Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {visibleStores.map((store) => (
            <Link
              key={store._id}
              href={`/coupons/${storeSlug(store)}-coupons`}
              className="no-underline group text-center"
            >
              <div
                className="rounded-2xl border overflow-hidden flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{ backgroundColor: cardBg, borderColor: borderClr, height: 100 }}
              >
                <img src={logoUrl(store)} alt={store.name || store.storeName} className="w-3/4 h-3/4 object-contain" />
              </div>
              <p className="mt-2 text-sm font-semibold flex items-center justify-center gap-1" style={{ color: textColor }}>
                {store.name || store.storeName}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: primary }} />
              </p>
            </Link>
          ))}
        </div>
      </div>


    </section>
  );
}
