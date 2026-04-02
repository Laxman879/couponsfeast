'use client';

import { useState } from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { trackClick } from '@/services/api';
import PromoModal from '@/components/coupon/PromoModal';

interface Props {
  coupon: any;
}

export default function CouponListCard({ coupon }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { siteConfig } = useDynamicTheme();
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const serverUrl = 'http://localhost:5000';

  const store = coupon.store || {};
  const storeName = coupon.storeName || store.storeName || '';
  const rawLogo = coupon.storeLogo || store.logo || '';
  const storeLogo = rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '';
  const storeUrl = coupon.affiliateUrl || coupon.websiteUrl || store.websiteUrl || '';
  const isExclusive = coupon.exclusive;
  const discount = coupon.discount || '';
  const code = coupon.code || '';

  const handleReveal = () => {
    setRevealed(true);
    if (storeUrl) window.open(storeUrl, '_blank', 'noopener,noreferrer');
    if (coupon._id) trackClick(coupon._id).catch(() => {});
    setShowModal(true);
  };

  return (
    <>
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 overflow-hidden"
      style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
      <div className="flex items-stretch">
        {/* Left: Logo / Discount */}
        <div className="w-32 sm:w-40 shrink-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 gap-2">
          {isExclusive ? (
            <div className="flex flex-col items-center gap-1">
              <div className="text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">{storeName || 'EXCLUSIVE'}</span>
                <span className="block text-xs font-black uppercase tracking-widest leading-tight" style={{ color: primary }}>EXCLUSIVE</span>
              </div>
            </div>
          ) : discount ? (
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black leading-none" style={{ color: primary }}>{discount.split(' ')[0]}</span>
              <span className="block text-xs sm:text-sm font-bold" style={{ color: `${primary}cc` }}>{discount.split(' ').slice(1).join(' ')}</span>
            </div>
          ) : (
            <span className="text-sm font-bold" style={{ color: primary }}>{storeName?.charAt(0) || '?'}</span>
          )}
        </div>

        {/* Middle: Info */}
        <div className="flex-1 px-3 sm:px-4 py-3 flex flex-col justify-center gap-1 min-w-0">
          {isExclusive && (
            <span className="inline-block text-white text-xs font-bold uppercase px-2.5 py-1 rounded w-fit tracking-wide" style={{ backgroundColor: '#14b8a6' }}>
              EXCLUSIVE
            </span>
          )}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">{coupon.title}</h3>
          {coupon.details && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{coupon.details}</p>
          )}
        </div>

        {/* Right: Verified + CTA */}
        <div className="w-36 sm:w-48 shrink-0 flex flex-col items-end justify-center gap-2 px-3 sm:px-4 py-3">
          <div className="flex items-center gap-1 text-green-600 text-xs sm:text-sm font-medium">
            <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            Verified
          </div>
          {code ? (
            <button
              onClick={handleReveal}
              className="text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all w-full text-center"
              style={{ backgroundColor: primary }}
            >
              {revealed ? (
                <span className="tracking-widest">{code}</span>
              ) : (
                'SHOW CODE'
              )}
            </button>
          ) : (
            <button
              onClick={handleReveal}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-lg transition-colors w-full text-center"
            >
              GRAB DEAL
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm font-bold" style={{ color: primary }}>{storeName}</span>
        <a href={`/coupons/${store.slug || storeName.toLowerCase().replace(/\s+/g, '-')}-coupons`}
          className="flex items-center gap-1 text-xs sm:text-sm font-medium no-underline" style={{ color: primary }}>
          View All {storeName} Offers <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
    {showModal && (
      <PromoModal onClose={() => setShowModal(false)} title={coupon.title} code={code}
        discount={discount} storeName={storeName} storeLogo={storeLogo}
        storeUrl={storeUrl} expiryDate={coupon.expiryDate} details={coupon.details} />
    )}
    </>
  );
}
