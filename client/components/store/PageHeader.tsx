'use client';
import { useState } from 'react';

interface PageHeaderProps {
  storeName: string;
  logoUrl?: string;
  logoBgColor?: string;
  verifiedOffers: number;
  date: string;
}

export default function PageHeader({
  storeName,
  logoUrl,
  logoBgColor = '#000000',
  verifiedOffers,
  date,
}: PageHeaderProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Logo circle */}
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg"
        style={{ background: logoBgColor }}
      >
        {logoUrl && !imgFailed ? (
          <img
            src={logoUrl}
            alt={storeName}
            className="w-full h-full object-contain p-2"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="text-white text-2xl font-bold uppercase">
            {storeName?.charAt(0) ?? '?'}
          </span>
        )}
      </div>

      {/* Text */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {storeName} Coupons &amp; Promo Codes
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">
          {verifiedOffers} VERIFIED OFFERS ON {date}
        </p>
      </div>
    </div>
  );
}
