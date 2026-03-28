'use client';
import { useRef, useState, useEffect } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { getDeals } from '@/services/api';
import TopDealCard, { fallbackTopDeals, mapDealToTopDeal } from './TopDealCard';
import type { TopDeal } from './TopDealCard';
import PromoModal from '@/components/coupon/PromoModal';

export default function TopDealsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [deals, setDeals] = useState<TopDeal[]>(fallbackTopDeals);

  const [allDeals, setAllDeals] = useState<TopDeal[]>([]);

  useEffect(() => {
    getDeals({ limit: 10 })
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        const activeDeals = (Array.isArray(data) ? data : []).filter((d: any) => d.isActive);
        const featured = activeDeals.filter((d: any) => d.isFeatured);
        const nonFeatured = activeDeals.filter((d: any) => !d.isFeatured);
        if (featured.length > 0) setDeals(featured.map(mapDealToTopDeal));
        else if (activeDeals.length > 0) setDeals(activeDeals.map(mapDealToTopDeal));
        if (nonFeatured.length > 0) setAllDeals(nonFeatured.map(mapDealToTopDeal));
        else if (activeDeals.length > 0) setAllDeals(activeDeals.map(mapDealToTopDeal));
      })
      .catch(() => {});
  }, []);

  const [modalDeal, setModalDeal] = useState<TopDeal | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    const next =
      direction === 'left'
        ? (active - 1 + deals.length) % deals.length
        : (active + 1) % deals.length;
    setActive(next);
    scrollRef.current?.scrollTo({ left: next * 300, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
      {/* Carousel - Original UI */}
      <div className="">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-black dark:bg-gray-700 text-white rounded-full flex items-center justify-center text-xs">
              amazon
            </div>
            <div>
              <h2 className="text-lg font-bold dark:text-gray-100">Today&apos;s Top Deals</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Presented by Amazon</p>
            </div>
          </div>
          <button className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-full text-sm dark:text-gray-200">
            View more deals
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 shadow p-2 rounded-full dark:text-gray-200"
          >
            <IoIosArrowBack />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-10"
          >
            {deals.map((item, i) => (
              <TopDealCard key={item._id || item.id || i} item={item} />
            ))}
          </div>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 shadow p-2 rounded-full dark:text-gray-200"
          >
            <IoIosArrowForward />
          </button>
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {deals.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-8 rounded-full ${active === index ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'}`}
            />
          ))}
        </div>
      </div>

      {/* Grid Section - Same UI as DealsSection */}
      <div className="py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Top Deals</h2>
          <button className="text-xs tracking-wider uppercase text-gray-600 dark:text-gray-400 border-b border-gray-400 dark:border-gray-500 hover:text-black dark:hover:text-white transition-colors">
            All Top Deals
          </button>
        </div>
        <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {allDeals.map((item, i) => (
            <div
              key={item._id || item.id || `grid-${i}`}
              className="relative flex h-full cursor-pointer overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-400 dark:border-gray-600 flex-col"
              onClick={() => {
                if (item.link) window.open(item.link, '_blank', 'noopener,noreferrer');
                setModalDeal(item);
              }}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              {item.discount && (
                <span className="absolute left-2 top-2 flex rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-xs font-bold dark:text-gray-200">
                  {item.discount}
                </span>
              )}
              <div className="relative flex h-full flex-col justify-between px-3 py-2">
                <div>
                  {item.brand && (
                    <h3 className="text-xs font-bold uppercase tracking-wide mt-1 dark:text-gray-200">{item.brand}</h3>
                  )}
                  <p className="my-2 line-clamp-2 text-sm leading-5 dark:text-gray-300">{item.title}</p>
                </div>
                {item.type && (
                  <p className="mt-2 self-start rounded-full bg-gray-100 dark:bg-gray-700 px-4 py-1.5 text-xs font-bold dark:text-gray-200">
                    {item.type === 'coupon' ? 'Coupon code' : 'Cash Back'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalDeal && (
        <PromoModal onClose={() => setModalDeal(null)} title={modalDeal.title} code={modalDeal.code} discount={modalDeal.discount}
          storeName={modalDeal.storeName} storeLogo={modalDeal.storeLogo} storeUrl={modalDeal.link} expiryDate={modalDeal.expiryDate} details={modalDeal.details} />
      )}
    </section>
  );
}
