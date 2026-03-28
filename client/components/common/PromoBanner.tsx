'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PromoModal from '@/components/coupon/PromoModal';
import { getPromoBanners } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';

interface PromoBannerProps {
  logo?: string;
  text?: string;
  buttonLabel?: string;
  storeName?: string;
  storeUrl?: string;
  couponCode?: string;
  discount?: string;
  expiryDate?: string;
  details?: string;
  closable?: boolean;
  gradient?: string;
  placement?: string;
}

export default function PromoBanner({
  logo: propLogo,
  text: propText,
  buttonLabel: propButtonLabel,
  storeName: propStoreName,
  storeUrl: propStoreUrl,
  couponCode: propCouponCode,
  discount: propDiscount,
  expiryDate: propExpiryDate,
  details: propDetails,
  closable = true,
  gradient: propGradient,
  placement = 'inline',
}: PromoBannerProps) {
  const [visible, setVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bannerData, setBannerData] = useState<any>(null);

  useEffect(() => {
    getPromoBanners({ placement })
      .then((res) => {
        const banners = res.data?.data ?? [];
        if (banners.length > 0) setBannerData(banners[0]);
      })
      .catch(() => {});
  }, [placement]);

  const { siteConfig } = useDynamicTheme();
  const themePrimary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const themeSecondary = siteConfig?.theme?.secondaryColor || '#9333ea';

  if (!visible) return null;

  const logo = bannerData?.logo || propLogo || 'amazon';
  const text = bannerData?.text || propText || "TODAY'S DEAL IS LIVE! SHOP 20 DAYS OF SAVINGS";
  const buttonLabel = bannerData?.buttonLabel || propButtonLabel || 'Get Deal';
  const storeName = bannerData?.storeName || propStoreName || 'Amazon';
  const storeUrl = bannerData?.storeUrl || propStoreUrl || '/view/amazon.com?u=4F543HXLWFDQPCVAPQPGLM6JA4&reference_uuid=fcc96c95-94d8-41f6-8e3d-f2dcc1237875';
  const couponCode = bannerData?.couponCode || propCouponCode;
  const discount = bannerData?.discount || propDiscount;
  const expiryDate = bannerData?.expiryDate || propExpiryDate;
  const details = bannerData?.details || propDetails;
  const gradient = bannerData?.gradient || propGradient || `linear-gradient(90deg, ${themePrimary} 0%, ${themeSecondary} 100%)`;

  const handleGetDeal = () => {
    window.open(storeUrl, '_blank', 'noopener,noreferrer');
    setShowModal(true);
  };

  return (
    <>
      <div className="w-full rounded-2xl overflow-hidden" style={{ background: gradient }}>
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-5 py-3 gap-3 sm:gap-4 relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none select-none text-white/70 text-xl">✦</div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-5">
            <div className="bg-white rounded-lg px-3 py-1.5 flex items-center gap-1 shadow-md">
              <span className="text-[10px] text-gray-400 font-medium">✦</span>
              <span className="text-sm font-black text-gray-800 tracking-tight">.{logo}</span>
            </div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-white font-black text-xs sm:text-sm md:text-base lg:text-lg tracking-wide uppercase text-center sm:text-left">
              {text}
            </span>
          </div>
          <div className="absolute right-28 md:right-36 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden sm:flex flex-col items-center gap-0.5">
            <div className="flex gap-1 items-end">
              <div className="w-5 h-6 rounded-full bg-blue-300/80 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-3 bg-white/60" />
              </div>
              <div className="w-4 h-5 rounded-full bg-secondary/80 relative" style={{ marginBottom: '2px' }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-3 bg-white/60" />
              </div>
            </div>
          </div>
          <div className="absolute right-24 md:right-32 top-2 pointer-events-none select-none text-white/60 text-xs">✦</div>
          <div className="absolute right-20 md:right-28 bottom-2 pointer-events-none select-none text-white/40 text-xs">✧</div>
          <button onClick={handleGetDeal}
            className="flex-shrink-0 bg-white text-primary font-bold text-sm px-5 py-2 rounded-full hover:bg-primary/5 transition-colors shadow-md whitespace-nowrap cursor-pointer border-0">
            {buttonLabel}
          </button>
          {closable && (
            <button onClick={() => setVisible(false)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer border-0"
              aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <PromoModal
          onClose={() => setShowModal(false)}
          title={text}
          code={couponCode}
          discount={discount}
          storeName={storeName}
          storeUrl={storeUrl}
          expiryDate={expiryDate}
          details={details}
        />
      )}
    </>
  );
}
