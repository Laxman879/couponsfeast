'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { getDeals, getStores, getCoupons } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import PromoModal from '@/components/coupon/PromoModal';
import ColumnSwitcher from '@/components/common/ColumnSwitcher';

export default function DealsPage() {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const siteName = siteConfig?.siteName || 'CouponsFeast';
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const textMain = isDark ? darkPalette.text : '#111827';
  const textMuted = isDark ? `${darkPalette.text}aa` : '#6b7280';
  const borderCol = isDark ? `${darkPalette.text}20` : '#e5e7eb';
  const pageBg = isDark ? darkPalette.bg : '#f1f5f9';

  const [deals, setDeals] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState('');
  const [activeStore, setActiveStore] = useState('All');
  const [modalData, setModalData] = useState<any>(null);
  const [dealCols, setDealCols] = useState(4);

  const serverUrl = 'http://localhost:5000';

  useEffect(() => {
    Promise.all([
      getDeals({ limit: 100 }),
      getStores(),
      getCoupons({ limit: 10, sortBy: 'clickCount', sortOrder: 'desc' }),
    ])
      .then(([dealRes, storeRes, couponRes]) => {
        const d = dealRes.data?.data ?? dealRes.data ?? [];
        setDeals((Array.isArray(d) ? d : []).filter((x: any) => x.isActive));
        setStores(storeRes.data?.data ?? storeRes.data ?? []);
        setTrending(couponRes.data?.data ?? couponRes.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setCountdown(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const getImage = (deal: any) => {
    const raw = deal.image || deal.store?.logo || '';
    return raw.startsWith('http') ? raw : raw ? `${serverUrl}${raw}` : '';
  };

  // Store tabs from deals
  const storeTabs = useMemo(() => {
    const names = new Set(deals.map(d => d.store?.storeName).filter(Boolean));
    return ['All', ...Array.from(names).slice(0, 8)];
  }, [deals]);

  const filteredDeals = useMemo(() => {
    if (activeStore === 'All') return deals;
    return deals.filter(d => d.store?.storeName === activeStore);
  }, [deals, activeStore]);

  const openDeal = (deal: any) => {
    const url = deal.link || deal.store?.websiteUrl;
    if (url) window.open(url, '_blank');
    const rawLogo = deal.store?.logo || '';
    setModalData({
      title: deal.title,
      code: deal.couponCode || deal.code || '',
      discount: deal.discount || '',
      storeName: deal.store?.storeName || '',
      storeLogo: rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '',
      storeUrl: url || '',
      expiryDate: deal.expiryDate || '',
      details: deal.description || deal.details || '',
    });
  };

  const featured = filteredDeals[0];
  const gridDeals = filteredDeals.slice(1);

  return (
    <div style={{ backgroundColor: pageBg, minHeight: '100vh' }}>

      {/* Header */}
      <section style={{ backgroundColor: cardBg, borderBottom: `1px solid ${borderCol}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-1 text-xs mb-3" style={{ color: textMuted }}>
            <Link href="/" className="no-underline" style={{ color: primary }}>Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: textMain }}>Deals of the Day</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold" style={{ color: textMain }}>Deals Of The Day</h1>
              <p className="text-sm" style={{ color: textMuted }}>Fresh. Handpicked. Curated.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-left sm:text-right">
                <p className="text-[10px] uppercase tracking-wide" style={{ color: textMuted }}>New Deals in</p>
                <div className="flex items-center gap-1">
                  {countdown.split(':').map((unit, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="text-lg sm:text-xl font-bold px-2 py-1 rounded-md" style={{ color: primary, backgroundColor: `${primary}10` }}>{unit}</span>
                      {i < 2 && <span className="font-bold" style={{ color: primary }}>:</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Filter Tabs */}
      <section style={{ backgroundColor: cardBg, borderBottom: `1px solid ${borderCol}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {storeTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveStore(tab)}
                className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border"
                style={{
                  backgroundColor: activeStore === tab ? primary : 'transparent',
                  color: activeStore === tab ? '#fff' : textMuted,
                  borderColor: activeStore === tab ? primary : borderCol,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ backgroundColor: cardBg }} />)}
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-semibold" style={{ color: textMain }}>No deals available</p>
            <p className="text-sm mt-1" style={{ color: textMuted }}>Check back soon for new deals</p>
          </div>
        ) : (
          <>
            {/* Featured Deal */}
            {featured && (
              <div
                className="rounded-2xl overflow-hidden flex flex-col sm:flex-row mb-8 cursor-pointer hover:shadow-xl transition-shadow"
                style={{ backgroundColor: cardBg, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
                onClick={() => openDeal(featured)}
              >
                <div className="sm:w-1/2 flex items-center justify-center p-6" style={{ backgroundColor: isDark ? darkPalette.bg : '#f3f4f6' }}>
                  <img src={getImage(featured)} alt={featured.title} className="max-h-[220px] object-contain" />
                </div>
                <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center" style={{ backgroundColor: isDark ? '#0f172a' : '#0d2545' }}>
                  <span className="text-white text-sm px-4 py-1 rounded-md w-fit mb-3 font-semibold" style={{ backgroundColor: primary }}>
                    {featured.discount || 'DEAL'}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">{featured.title}</h2>
                  <p className="text-gray-400 text-sm mt-2">By {featured.store?.storeName || 'Store'}</p>
                  {(featured.price || featured.originalPrice) && (
                    <p className="text-2xl font-bold text-white mt-3">
                      {featured.price}
                      {featured.originalPrice && <span className="text-gray-400 line-through text-base ml-2">{featured.originalPrice}</span>}
                    </p>
                  )}
                  <span className="mt-4 font-bold text-base flex items-center gap-2" style={{ color: primary }}>
                    GRAB NOW <ExternalLink className="w-4 h-4" />
                  </span>
                </div>
              </div>
            )}

            {/* Deals Grid */}
            {gridDeals.length > 0 && (
              <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ color: textMain }}>All Deals</h2>
                <ColumnSwitcher columns={dealCols} onChange={setDealCols} mobileOptions={[1, 2]} desktopOptions={[3, 4, 5]} />
              </div>
              <div className={`grid gap-5 ${dealCols === 1 ? 'grid-cols-1' : dealCols === 2 ? 'grid-cols-2' : dealCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : dealCols === 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {gridDeals.map((deal: any) => {
                  const image = getImage(deal);
                  const storeName = deal.store?.storeName || 'Store';
                  return (
                    <div
                      key={deal._id}
                      className="rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      style={{ backgroundColor: cardBg, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
                      onClick={() => openDeal(deal)}
                    >
                      {/* Image */}
                      <div className="h-[160px] overflow-hidden" style={{ backgroundColor: isDark ? darkPalette.bg : '#f3f4f6' }}>
                        {image && <img src={image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                      </div>

                      {/* Badge */}
                      <div className="flex justify-center -mt-4 relative z-10">
                        <span className="text-white text-xs px-3 py-1 rounded-md font-semibold shadow" style={{ backgroundColor: primary }}>
                          {deal.discount || 'DEAL'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: textMain }}>{deal.title}</p>
                        <p className="text-xs mt-1" style={{ color: textMuted }}>By {storeName}</p>
                        {(deal.price || deal.originalPrice) && (
                          <div className="mt-2 flex items-center gap-2">
                            {deal.price && <span className="text-base font-bold" style={{ color: textMain }}>{deal.price}</span>}
                            {deal.originalPrice && <span className="text-xs line-through" style={{ color: textMuted }}>{deal.originalPrice}</span>}
                          </div>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: primary }}>
                            GET DEAL <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              </>
            )}
          </>
        )}

        {/* Top Stores */}
        {stores.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-5" style={{ color: textMain }}>Top Stores</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {stores.slice(0, 16).map((store: any) => {
                const rawLogo = store.logo || '';
                const logo = rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '';
                return (
                  <Link key={store._id} href={`/${store.slug}-coupons`} className="no-underline group text-center">
                    <div
                      className="rounded-xl border p-4 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      style={{ backgroundColor: cardBg, borderColor: borderCol, minHeight: 70 }}
                    >
                      {logo ? (
                        <img src={logo} alt={store.storeName} className="h-8 object-contain max-w-[80%]" />
                      ) : (
                        <span className="text-sm font-bold" style={{ color: primary }}>{store.storeName?.[0]}</span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs font-semibold" style={{ color: textMain }}>{store.storeName}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Trending Deals */}
        {trending.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-5" style={{ color: textMain }}>Trending Deals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trending.slice(0, 6).map((coupon: any) => (
                <div
                  key={coupon._id}
                  className="rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: cardBg, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-white text-[10px] px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: primary }}>
                      {coupon.discount || coupon.type?.toUpperCase() || 'DEAL'}
                    </span>
                    <p className="mt-2 text-sm font-medium line-clamp-2" style={{ color: textMain }}>{coupon.title}</p>
                    <p className="text-xs mt-1" style={{ color: textMuted }}>{coupon.store?.storeName || ''}</p>
                    {coupon.clickCount > 0 && (
                      <p className="text-[10px] mt-1" style={{ color: textMuted }}>{coupon.clickCount} people used</p>
                    )}
                  </div>
                  {coupon.store?.logo && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: borderCol }}>
                      <img
                        src={coupon.store.logo.startsWith('http') ? coupon.store.logo : `${serverUrl}${coupon.store.logo}`}
                        alt="" className="w-full h-full object-contain p-1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Strip */}
      <section style={{ backgroundColor: cardBg, borderTop: `1px solid ${borderCol}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="font-semibold text-sm" style={{ color: primary }}>
            {siteName.toUpperCase()} — DESTINATION FOR TOP DEALS
          </p>
        </div>
      </section>

      {modalData && (
        <PromoModal onClose={() => setModalData(null)} title={modalData.title} code={modalData.code}
          discount={modalData.discount} storeName={modalData.storeName} storeLogo={modalData.storeLogo}
          storeUrl={modalData.storeUrl} expiryDate={modalData.expiryDate} details={modalData.details} />
      )}
    </div>
  );
}
