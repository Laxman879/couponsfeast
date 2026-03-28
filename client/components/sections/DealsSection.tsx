'use client';
import React, { useState, useEffect } from 'react';
import { getDeals } from '@/services/api';
import PromoModal from '@/components/coupon/PromoModal';

const fallbackDeals = [
  { brand: 'ATHLETA', logo: 'https://via.placeholder.com/100?text=ATHLETA', title: '30% Off Train Essentials', discount: '30% Off', type: 'coupon' },
  { brand: 'TOTAL WIRELESS', logo: 'https://via.placeholder.com/100?text=TOTAL', title: 'IPhone 13 For $49.99 W/ The Total 5G+ Unl Plan', discount: null, type: null },
  { brand: 'WALMART', logo: 'https://via.placeholder.com/100?text=Walmart', title: '25% Off Your Purchase', discount: '25% Off', type: 'coupon' },
  { brand: 'FANATICS', logo: 'https://via.placeholder.com/100?text=Fanatics', title: '30% Off Your Order', discount: '30% Off', type: 'coupon', highlight: true },
  { brand: 'SKIMS', logo: 'https://via.placeholder.com/100?text=SKIMS', title: 'Extra 50% Off Sitewide', discount: '50% Off', type: 'coupon' },
  { brand: 'REI', logo: 'https://via.placeholder.com/100?text=REI', title: '20% Off 1 Full-Price Item With Membership', discount: '20% Off', type: 'coupon', sponsored: true },
  { brand: 'PUMA', logo: 'https://via.placeholder.com/100?text=PUMA', title: '20% Off Your Order With PUMA Email Sign Up', discount: '20% Off', type: 'coupon', sponsored: true },
  { brand: 'TEMU', logo: 'https://via.placeholder.com/100?text=TEMU', title: '4% Cash Back For Purchases Sitewide', discount: '+4% Back', type: 'cashback' },
  { brand: "DICK'S", logo: 'https://via.placeholder.com/100?text=DICKS', title: 'Coupons, Promotions & Deals', discount: null, type: null },
  { brand: 'ALO', logo: 'https://via.placeholder.com/100?text=ALO', title: '30% Off Sitewide With Loyalty', discount: '30% Off', type: 'coupon' },
];

function mapDealToCard(deal: any) {
  const store = deal.store || {};
  const serverUrl = 'http://localhost:5000';
  const rawLogo = deal.image || store.logo || '';
  const logo = rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '';

  return {
    _id: deal._id,
    brand: store.storeName?.toUpperCase() || deal.title?.split(' ')[0]?.toUpperCase() || 'DEAL',
    logo,
    title: deal.title,
    discount: deal.discount || null,
    type: deal.type === 'deal' || deal.type === 'offer' ? 'coupon' : deal.type || null,
    highlight: deal.isFeatured || false,
    link: deal.link || store.websiteUrl || '',
    code: deal.couponCode || deal.code || '',
    storeName: store.storeName || '',
    storeLogo: logo,
    expiryDate: deal.expiryDate,
    details: deal.details || deal.description || '',
  };
}

function DealCard({ item, onActivate }: { item: any; onActivate: (item: any) => void }) {
  const handleClick = () => {
    if (item.link) window.open(item.link, '_blank', 'noopener,noreferrer');
    onActivate(item);
  };

  return (
    <div
      onClick={handleClick}
      style={{ border: '1px solid #e5e7eb' }}
      className="relative flex h-full cursor-pointer overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-400 dark:border-gray-600 flex-col hover:shadow-lg transition-shadow"
    >
      <div className="aspect-video w-full overflow-hidden">
        <img src={item.logo} alt={`${item.brand} ${item.title}`} className="h-full w-full object-cover" loading="lazy" />
      </div>
      {item.discount && (
        <span className="absolute left-2 top-2 flex rounded border border-gray-200 bg-white px-2 py-1 text-xs font-bold">
          {item.discount}
        </span>
      )}
      <div className="relative flex h-full flex-col justify-between px-3 py-2">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide mt-1 dark:text-gray-200">{item.brand}</h3>
          <p className="my-2 line-clamp-2 text-sm leading-5 dark:text-gray-300">{item.title}</p>
        </div>
        {item.type && (
          <p className="mt-2 self-start rounded-full bg-gray-100 dark:bg-gray-700 px-4 py-1.5 text-xs font-bold dark:text-gray-200">
            {item.type === 'coupon' ? 'Coupon code' : 'Cash Back'}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DealsSection() {
  const [deals, setDeals] = useState<any[]>(fallbackDeals);
  const [modalDeal, setModalDeal] = useState<any>(null);

  useEffect(() => {
    getDeals({ limit: 10 })
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        const active = (Array.isArray(data) ? data : []).filter((d: any) => d.isActive && !d.isFeatured);
        if (active.length > 0) setDeals(active.map(mapDealToCard));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="mb-16 md:mb-20 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="py-10 ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">March Madness Deals</h2>
          <button className="text-xs tracking-wider uppercase text-gray-600 dark:text-gray-400 border-b border-gray-400 dark:border-gray-500 hover:text-black dark:hover:text-white transition-colors">
            All March Madness Deals
          </button>
        </div>
        <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {deals.map((item, index) => (
            <DealCard key={item._id || index} item={item} onActivate={setModalDeal} />
          ))}
        </div>
      </div>

      {modalDeal && (
        <PromoModal onClose={() => setModalDeal(null)} title={modalDeal.title} code={modalDeal.code} discount={modalDeal.discount}
          storeName={modalDeal.storeName || modalDeal.brand} storeLogo={modalDeal.storeLogo || modalDeal.logo}
          storeUrl={modalDeal.link} expiryDate={modalDeal.expiryDate} details={modalDeal.details} />
      )}
    </section>
  );
}
