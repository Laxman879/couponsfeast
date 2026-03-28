'use client';
import { useState } from 'react';
import PromoModal from '@/components/coupon/PromoModal';

export interface TopDeal {
  _id?: string;
  id?: number;
  title: string;
  discount: string;
  image: string;
  brand?: string;
  type?: string | null;
  link?: string;
  code?: string;
  storeName?: string;
  storeLogo?: string;
  expiryDate?: string;
  details?: string;
}

export function mapDealToTopDeal(deal: any): TopDeal {
  const store = deal.store || {};
  const serverUrl = 'http://localhost:5000';
  const rawImg = deal.image || store.logo || '';
  const image = rawImg.startsWith('http') ? rawImg : rawImg ? `${serverUrl}${rawImg}` : '';
  const rawLogo = store.logo || '';
  const storeLogo = rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '';

  return {
    _id: deal._id,
    title: deal.title,
    discount: deal.discount || '',
    image,
    brand: store.storeName?.toUpperCase() || deal.title?.split(' ')[0]?.toUpperCase() || 'DEAL',
    type: deal.type === 'deal' || deal.type === 'offer' ? 'coupon' : deal.type || null,
    link: deal.link || store.websiteUrl || '',
    code: deal.couponCode || deal.code || '',
    storeName: store.storeName || '',
    storeLogo,
    expiryDate: deal.expiryDate,
    details: deal.details || deal.description || '',
  };
}

export const fallbackTopDeals: TopDeal[] = [
  { id: 1, title: "Apple AirTag Tracker (4-Pack)", discount: "39% OFF", image: "https://via.placeholder.com/120" },
  { id: 2, title: "iRobot Roomba Plus 405 Robot Vacuum", discount: "55% OFF", image: "https://via.placeholder.com/120" },
  { id: 3, title: "Amazon Fire TV Stick 4K Select", discount: "55% OFF", image: "https://via.placeholder.com/120" },
  { id: 4, title: "Stanley x Barbie Tumbler", discount: "35% OFF", image: "https://via.placeholder.com/120" },
  { id: 5, title: "Extra Product", discount: "20% OFF", image: "https://via.placeholder.com/120" },
];

export default function TopDealCard({ item }: { item: TopDeal }) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (item.link) window.open(item.link, '_blank', 'noopener,noreferrer');
    setShowModal(true);
  };

  return (
    <>
      <div className="min-w-[260px] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 flex p-3 gap-3 shadow-sm">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <img src={item.image} alt="" className="h-16 object-contain" />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div>
            <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-md">🔥 {item.discount}</span>
            <p className="text-sm mt-2 text-gray-800 dark:text-gray-200 line-clamp-2">{item.title}</p>
          </div>
          <button onClick={handleClick}
            className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 text-xs font-semibold px-3 py-2 rounded-full w-fit text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
            Check price
          </button>
        </div>
      </div>
      {showModal && (
        <PromoModal onClose={() => setShowModal(false)} title={item.title} code={item.code} discount={item.discount}
          storeName={item.storeName} storeLogo={item.storeLogo} storeUrl={item.link} expiryDate={item.expiryDate} details={item.details} />
      )}
    </>
  );
}
