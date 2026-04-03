'use client';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import PromoModal from './PromoModal';
import { trackClick } from '@/services/api';

interface Coupon {
  _id: string;
  title: string;
  code?: string;
  discount?: string;
  type?: 'code' | 'sale' | 'cashback' | 'freeshipping';
  labelType?: string;
  interestedUsers?: number;
  limitedTime?: boolean;
  expiringToday?: boolean;
  addedBy?: string;
  exclusive?: boolean;
  details?: string;
  expiryDate?: string;
  affiliateUrl?: string;
  websiteUrl?: string;
  storeName?: string;
  storeLogo?: string;
  store?: {
    _id?: string;
    storeName?: string;
    logo?: string;
    websiteUrl?: string;
    slug?: string;
  };
}

export default function CouponCard({ coupon }: { coupon: Coupon }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const serverUrl = 'http://localhost:5000';
  const store = coupon.store;
  const storeUrl = coupon.affiliateUrl || coupon.websiteUrl || store?.websiteUrl || '';
  const storeName = coupon.storeName || store?.storeName || '';
  const rawLogo = coupon.storeLogo || store?.logo || '';
  const storeLogo = rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '';

  const isCashBack = coupon.type === 'cashback';
  const isSale = coupon.type === 'sale';
  const isFreeShipping = coupon.type === 'freeshipping';

  const rawDiscount = (coupon.discount || '').trim();
  const numericValue = rawDiscount.replace('%', '').trim();
  const isNumeric = /^\d+(\.\d+)?$/.test(numericValue);

  const handleActivate = () => {
    if (coupon.code) navigator.clipboard.writeText(coupon.code).catch(() => {});
    if (storeUrl) window.open(storeUrl, '_blank', 'noopener,noreferrer');
    setShowModal(true);
    if (coupon._id) trackClick(coupon._id).catch(() => {});
  };

  const renderDiscount = () => {
    const base = "text-primary flex w-fit flex-col self-center text-center text-lg font-extrabold uppercase tracking-tight mx-auto sm:text-xl md:text-3xl";
    if (isCashBack) return (
      <div className={base}>
        <p className="text-sm sm:text-base md:text-xl leading-[0.75] whitespace-nowrap">Cash</p>
        <p className="leading-none">{rawDiscount}%</p>
        <p className="leading-none">Back</p>
      </div>
    );
    if (isFreeShipping) return (
      <div className={base}>
        <p className="text-sm sm:text-base md:text-xl leading-[0.75] whitespace-nowrap">Free</p>
        <p className="leading-none">Ship</p>
        <p className="leading-none">ping</p>
      </div>
    );
    if (isSale) return <div className={base}><p className="leading-none">SALE</p></div>;
    if (isNumeric) return (
      <div className={base}>
        <p className="text-sm sm:text-base md:text-xl leading-[0.75] whitespace-nowrap">Up To</p>
        <p className="leading-none">{numericValue}%</p>
        <p className="leading-none">Off</p>
      </div>
    );
    return (
      <div className={base}>
        {rawDiscount.split(/\n|\\n/).map((line, i) => <p key={i} className="leading-none">{line}</p>)}
      </div>
    );
  };

  const labelText = coupon.labelType || (isCashBack ? 'Cash Back' : isFreeShipping ? 'Free Shipping' : isSale ? 'Sale' : 'Code');

  return (
    <>
      <div style={{ border: '1px solid #ddd' }} className={`rounded-xl overflow-hidden shadow-md ${isCashBack ? 'bg-primary/5' : 'bg-white dark:bg-gray-800'}`}>
        {/* Mobile: stack | Desktop: row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">

          {/* Mobile top row: discount + content side by side */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Discount */}
            <div className="flex items-center justify-center px-4 py-5 sm:px-6 sm:py-7 min-w-[80px] sm:min-w-[110px] flex-shrink-0">
              {renderDiscount()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 py-4 pr-3 sm:px-5 sm:py-6">
              {isCashBack && (
                <span className="text-xs text-primary font-semibold flex items-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" /> Online Cash Back
                </span>
              )}
              <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded mb-1">
                {labelText}
              </span>
              <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 dark:text-gray-100 leading-snug mb-2">{coupon.title}</h3>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {!!coupon.interestedUsers && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full">
                    {coupon.interestedUsers} interested
                  </span>
                )}
                {coupon.limitedTime && <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full">Limited time</span>}
                {coupon.expiringToday && <span className="bg-red-100 text-red-500 text-[10px] sm:text-xs px-2 py-0.5 rounded-full animate-pulse">Expiring today</span>}
                {coupon.exclusive && <span className="bg-primary/10 text-primary text-[10px] sm:text-xs px-2 py-0.5 rounded-full">Exclusive</span>}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center px-3 pb-4 sm:px-5 sm:py-6 flex-shrink-0">
            <button
              onClick={handleActivate}
              className="bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 w-full sm:w-auto sm:min-w-[130px] text-center hover:shadow-lg hover:shadow-primary/25"
            >
              {coupon.code ? 'Reveal Code' : isCashBack ? 'Get Reward' : 'Get Deal'}
            </button>
          </div>
        </div>

        {coupon.details && (
          <div className="border-t border-gray-100 dark:border-gray-700 px-3 sm:px-5 py-2 flex justify-end">
            <button onClick={() => setShowDetails(!showDetails)} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1">
              {showDetails ? 'Hide Details' : 'See Details'}
              {showDetails ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
          </div>
        )}
        {showDetails && coupon.details && (
          <div className="px-3 sm:px-5 pb-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{coupon.details}</div>
        )}
      </div>

      {showModal && (
        <PromoModal
          onClose={() => setShowModal(false)}
          title={coupon.title}
          code={coupon.code}
          discount={coupon.discount}
          storeName={storeName}
          storeLogo={storeLogo}
          storeUrl={storeUrl}
          expiryDate={coupon.expiryDate}
          details={coupon.details}
        />
      )}
    </>
  );
}
