'use client';
import React, { useState, useEffect } from 'react';
import { getCoupons, trackClick } from '@/services/api';
import PromoModal from '@/components/coupon/PromoModal';

const fallbackCards = [
  {
    id: 1, href: "#", theme: "white",
    logo: "https://www.retailmenot.com/imagery/merchants/070XWzV7N2uxDgr4I0s13A1.fit_limit.quality_80.size_40x40.v1764008602.png.webp",
    logoWidth: 40, logoHeight: 40, logoAlt: "Myprotein",
    title: "CouponsFeast Exclusive! Extra 10% Off All Creatine", cta: "Reveal Code",
    image: "https://www.retailmenot.com/imagery/homepage-feature-cards/01kkex4xvnz94nwsfgahh41h4q-image.fit_limit.quality_80.size_160x170.v1773248083.webp",
    code: 'CREATINE10', storeUrl: '#', storeName: 'Myprotein', discount: '10% Off',
  },
  {
    id: 2, href: "#", theme: "white",
    logo: "https://www.retailmenot.com/imagery/merchants/02guoi2wt6N76ZYcr0L2O86.fit_limit.quality_80.size_72x40.v1768410917.png.webp",
    logoWidth: 72, logoHeight: 40, logoAlt: "Ace Hardware",
    title: "5% Cash Back for Purchases Sitewide", cta: "Shop Now",
    image: "https://www.retailmenot.com/imagery/homepage-feature-cards/01kkex6xm8db06hgwa77vaeyd0-image.fit_limit.quality_80.size_160x170.v1773248149.webp",
    code: '', storeUrl: '#', storeName: 'Ace Hardware', discount: '5% Cash Back',
  },
  {
    id: 3, href: "/cashback", theme: "purple",
    logo: null, logoAlt: "CouponsFeast",
    title: "Guaranteed Cash Back from 4,000+ Brands", cta: "Shop CouponsFeast",
    image: "https://www.retailmenot.com/imagery/homepage-feature-cards/01kk9s71sgrffp151xmrahh9fj-image.fit_limit.quality_80.size_160x170.v1773076186.png.webp",
    code: '', storeUrl: '/cashback', storeName: 'CouponsFeast', discount: '',
  },
];

function DefaultLogo({ name, isPurple }: { name?: string; isPurple?: boolean }) {
  return (
    <div className={`mt-3 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${isPurple ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-500'}`}>
      {name?.substring(0, 2)?.toUpperCase() || '?'}
    </div>
  );
}

function FeatureCard({ card, onClick }: { card: any; onClick: () => void }) {
  const isPurple = card.theme === "purple" || card.type === "cashback";

  return (
    <div
      onClick={onClick}
      className={`
        flex h-[170px] w-full min-w-[320px] flex-shrink-0 justify-between rounded-xl
        shadow-lg transition-shadow duration-300 ease-out hover:shadow-xl
        lg:w-0 lg:flex-1 lg:min-w-0 cursor-pointer
        ${isPurple ? "bg-primary/10" : "bg-white dark:bg-gray-800"}
      `}
    >
      <div className="flex flex-col pl-5 pr-4 justify-start overflow-hidden">
        {card.logo ? (
          <img
            src={card.logo}
            alt={card.logoAlt || card.title}
            className="mt-3 object-contain flex-shrink-0 max-w-[72px] max-h-[40px]"
          />
        ) : (
          <DefaultLogo name={card.logoAlt || card.storeName} isPurple={isPurple} />
        )}
        <p className={`my-3 text-sm font-semibold leading-tight line-clamp-3 ${isPurple ? "text-primary" : "text-gray-900 dark:text-gray-100"}`}>
          {card.title}
        </p>
        <p className={`text-xs uppercase tracking-widest underline underline-offset-4 font-bold ${isPurple ? "text-primary" : "text-gray-800 dark:text-gray-200"}`}>
          {card.cta || (card.code ? 'Reveal Code' : 'Shop Now')}
        </p>
      </div>
      {(card.image || card.featuredImage) && (
        <img
          src={card.image || card.featuredImage}
          alt="" role="presentation" loading="lazy" width={160} height={170}
          className="h-full w-[160px] flex-shrink-0 rounded-xl object-cover"
        />
      )}
    </div>
  );
}

function mapCouponToCard(coupon: any) {
  const store = coupon.store || {};
  const domain = store.websiteUrl
    ? store.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    : store.slug ? `${store.slug}.com` : '';
  const serverUrl = 'http://localhost:5000';
  const logo = coupon.customLogo
    ? (coupon.customLogo.startsWith('http') ? coupon.customLogo : `${serverUrl}${coupon.customLogo}`)
    : store.logo
      ? (store.logo.startsWith('http') ? store.logo : `${serverUrl}${store.logo}`)
      : '';

  return {
    _id: coupon._id,
    theme: coupon.type === 'cashback' ? 'purple' : 'white',
    logo, logoWidth: 40, logoHeight: 40,
    logoAlt: store.storeName || '',
    title: coupon.title,
    cta: coupon.code ? 'Reveal Code' : 'Shop Now',
    image: coupon.featuredImage || '',
    code: coupon.code || '',
    discount: coupon.discount || '',
    storeName: store.storeName || '',
    storeLogo: logo,
    storeUrl: coupon.affiliateUrl || store.websiteUrl || (domain ? `https://${domain}` : ''),
    expiryDate: coupon.expiryDate || '',
    details: coupon.details || '',
  };
}

export default function FeaturedCoupons({ title, limit = 3 }: { title?: string; limit?: number }) {
  const [cards, setCards] = useState<any[]>(fallbackCards);
  const [modalCard, setModalCard] = useState<any>(null);

  useEffect(() => {
    getCoupons()
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        const featured = (Array.isArray(data) ? data : [])
          .filter((c: any) => c.isFeatured && c.isActive)
          .slice(0, limit)
          .map(mapCouponToCard);
        if (featured.length > 0) setCards(featured);
      })
      .catch(() => {});
  }, [limit]);

  const handleClick = (card: any) => {
    if (card._id) trackClick(card._id).catch(() => {});
    if (card.storeUrl && card.storeUrl !== '#') {
      window.open(card.storeUrl, '_blank', 'noopener,noreferrer');
    }
    setModalCard(card);
  };

  return (
    <section className="mt-10 mb-16 md:mt-14 md:mb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="mb-4 text-xl font-bold capitalize leading-tight md:leading-normal dark:text-gray-100">
        {title || "The Best Coupons, Promo Codes & Cash Back Offers"}
      </h1>

      <div className="-mb-8 -ml-8 -mr-4 flex items-center gap-4 overflow-x-auto px-8 pb-8 font-bold lg:overflow-visible lg:mx-0 lg:px-0 lg:mr-0">
        {cards.map((card) => (
          <FeatureCard key={card._id || card.id} card={card} onClick={() => handleClick(card)} />
        ))}
      </div>

      {modalCard && (
        <PromoModal
          onClose={() => setModalCard(null)}
          title={modalCard.title}
          code={modalCard.code}
          discount={modalCard.discount}
          storeName={modalCard.storeName || modalCard.logoAlt}
          storeLogo={modalCard.storeLogo || modalCard.logo}
          storeUrl={modalCard.storeUrl}
          expiryDate={modalCard.expiryDate}
          details={modalCard.details}
        />
      )}
    </section>
  );
}
