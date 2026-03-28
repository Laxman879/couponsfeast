'use client';
import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { getCoupons, trackClick } from '@/services/api';
import PromoModal from '@/components/coupon/PromoModal';

const fallbackStores = [
  { name: 'Becker', cashBack: '20%', bgColor: '#ffffff', img: 'https://www.retailmenot.com/imagery/merchants/03i7YGKJifFEICrmRNaam2r.fit_limit.quality_80.size_172x172.v1766005512.jpg.webp' },
  { name: 'AliExpress', cashBack: '30%', bgColor: '#f52945', img: 'https://www.retailmenot.com/imagery/merchants/013KLv0wOMLhbZ4xMBa89JJ-color.fit_limit.quality_80.size_172x172.v1768410959.png.webp' },
  { name: "Jack's Flight Club", cashBack: '$20', bgColor: '#ffffff', img: 'https://www.retailmenot.com/imagery/merchants/04QYcFoDrRP31kiM9Tvicf8.fit_limit.quality_80.size_172x172.v1770854730.png.webp' },
  { name: 'The Home Depot', cashBack: '10%', bgColor: '#ff6600', img: 'https://www.retailmenot.com/imagery/merchants/00PdyjRpqcbuGvEnK1Ylabm-color.fit_limit.quality_80.size_172x172.v1768410887.png.webp' },
  { name: 'tarte', cashBack: '14%', bgColor: '#532d6b', img: 'https://www.retailmenot.com/imagery/merchants/028glbEKB7vNCF5Z1zOGb4e-color.fit_limit.quality_80.size_172x172.v1768410977.png.webp' },
  { name: 'Jelly Belly', cashBack: '6%', bgColor: '#ffffff', img: 'https://www.retailmenot.com/imagery/merchants/06jngQ9fKbTxe6PlDpTFYqn.fit_limit.quality_80.size_172x172.v1765232563.png.webp' },
  { name: 'Walmart', cashBack: '1%', bgColor: '#ffffff', img: 'https://www.retailmenot.com/imagery/merchants/02zLDwCqTbhlnKCTPdI0yqf.fit_limit.quality_80.size_172x172.v1772563842.png.webp' },
  { name: 'Amazon', cashBack: '10%', bgColor: '#121821', img: 'https://www.retailmenot.com/imagery/merchants/05kie42h3YvHwjr4G1w80Qq-color.fit_limit.quality_80.size_172x172.v1768410879.png.webp' },
];

function mapCouponToCashback(coupon: any) {
  const store = coupon.store || {};
  const serverUrl = 'http://localhost:5000';
  const rawLogo = store.logo || '';
  const img = rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '';
  return {
    _id: coupon._id,
    name: store.storeName || 'Store',
    cashBack: coupon.discount || '',
    bgColor: '#ffffff',
    img,
    storeUrl: coupon.affiliateUrl || store.websiteUrl || '',
    code: coupon.code || '',
    title: coupon.title || '',
    discount: coupon.discount || '',
    details: coupon.details || '',
    expiryDate: coupon.expiryDate || '',
  };
}

export default function CashBackSection() {
  const [stores, setStores] = useState<any[]>(fallbackStores);
  const [modalData, setModalData] = useState<any>(null);

  useEffect(() => {
    getCoupons({ limit: 8 })
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        const cashback = (Array.isArray(data) ? data : [])
          .filter((c: any) => c.type === 'cashback' && c.isActive);
        if (cashback.length > 0) setStores(cashback.map(mapCouponToCashback));
      })
      .catch(() => {});
  }, []);

  const handleClick = (store: any) => {
    if (store._id) trackClick(store._id).catch(() => {});
    if (store.storeUrl) window.open(store.storeUrl, '_blank', 'noopener,noreferrer');
    if (store._id) setModalData(store);
  };

  return (
    <>
      <section className="mb-16 md:mb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">cha-ching</div>
        <div className="mb-6 flex flex-wrap items-baseline justify-between lg:mb-8 gap-2">
          <h2 className="text-xl font-bold capitalize leading-tight md:leading-normal">
            <span className="text-gray-900 dark:text-gray-100">Cash Back at Stores We Love</span>
          </h2>
          <a href="/cashback" className="text-xs font-semibold uppercase tracking-widest underline underline-offset-4 hover:text-primary transition-colors text-gray-800 dark:text-gray-200">
            All Cash Back
          </a>
        </div>
        <div className="grid grid-cols-3 place-items-center gap-x-6 gap-y-8 md:grid-cols-4 lg:grid-cols-8">
          {stores.map((store, i) => (
            <div
              key={store._id || store.name || i}
              onClick={() => handleClick(store)}
              className="group mb-auto flex flex-col items-center w-full cursor-pointer"
            >
              <div
                className="mb-3 transition-shadow duration-300 ease-out group-hover:shadow-xl w-20 h-20 md:w-32 md:h-32 p-4 md:p-5 overflow-hidden rounded-full border border-gray-300"
                style={{ backgroundColor: store.bgColor || '#fff' }}
              >
                {store.img ? (
                  <img src={store.img} alt={store.name} className="aspect-square h-auto w-full object-contain" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">{store.name?.charAt(0)}</div>
                )}
              </div>
              <div className="mx-auto max-w-28 text-center text-xs leading-tight group-hover:underline group-hover:underline-offset-4 lg:text-sm text-gray-900 dark:text-gray-100">
                <Zap className="-mr-1 mb-1 inline-block h-4 w-4 text-yellow-400 group-hover:animate-bounce" fill="currentColor" />
                <strong className="lg:mr-1">{store.cashBack}</strong> Cash&nbsp;Back
              </div>
            </div>
          ))}
        </div>
      </section>

      {modalData && (
        <PromoModal
          onClose={() => setModalData(null)}
          title={modalData.title}
          code={modalData.code}
          discount={modalData.discount}
          storeName={modalData.name}
          storeLogo={modalData.img}
          storeUrl={modalData.storeUrl}
          expiryDate={modalData.expiryDate}
          details={modalData.details}
        />
      )}
    </>
  );
}
