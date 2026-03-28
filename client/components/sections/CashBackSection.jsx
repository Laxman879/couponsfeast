import React from 'react';
import { Zap } from 'lucide-react';

const cashBackStores = [
  {
    name: 'Becker',
    cashBack: '20%',
    bgColor: '#ffffff',
    borderColor: 'border-black',
    img: 'https://www.CouponFeast.com/imagery/merchants/03i7YGKJifFEICrmRNaam2r.fit_limit.quality_80.size_172x172.v1766005512.jpg.webp',
  },
  {
    name: 'AliExpress',
    cashBack: '30%',
    bgColor: '#f52945',
    borderColor: 'border-[#f52945]',
    img: 'https://www.CouponFeast.com/imagery/merchants/013KLv0wOMLhbZ4xMBa89JJ-color.fit_limit.quality_80.size_172x172.v1768410959.png.webp',
  },
  {
    name: "Jack's Flight Club",
    cashBack: '$20',
    bgColor: '#ffffff',
    borderColor: 'border-black',
    img: 'https://www.CouponFeast.com/imagery/merchants/04QYcFoDrRP31kiM9Tvicf8.fit_limit.quality_80.size_172x172.v1770854730.png.webp',
  },
  {
    name: 'The Home Depot',
    cashBack: '10%',
    bgColor: '#ff6600',
    borderColor: 'border-[#ff6600]',
    img: 'https://www.CouponFeast.com/imagery/merchants/00PdyjRpqcbuGvEnK1Ylabm-color.fit_limit.quality_80.size_172x172.v1768410887.png.webp',
  },
  {
    name: 'tarte',
    cashBack: '14%',
    bgColor: '#532d6b',
    borderColor: 'border-[#532d6b]',
    img: 'https://www.CouponFeast.com/imagery/merchants/028glbEKB7vNCF5Z1zOGb4e-color.fit_limit.quality_80.size_172x172.v1768410977.png.webp',
  },
  {
    name: 'Jelly Belly',
    cashBack: '6%',
    bgColor: '#ffffff',
    borderColor: 'border-black',
    img: 'https://www.CouponFeast.com/imagery/merchants/06jngQ9fKbTxe6PlDpTFYqn.fit_limit.quality_80.size_172x172.v1765232563.png.webp',
  },
  {
    name: 'Walmart',
    cashBack: '1%',
    bgColor: '#ffffff',
    borderColor: 'border-black',
    img: 'https://www.CouponFeast.com/imagery/merchants/02zLDwCqTbhlnKCTPdI0yqf.fit_limit.quality_80.size_172x172.v1772563842.png.webp',
  },
  {
    name: 'Amazon',
    cashBack: '10%',
    bgColor: '#121821',
    borderColor: 'border-[#121821]',
    img: 'https://www.CouponFeast.com/imagery/merchants/05kie42h3YvHwjr4G1w80Qq-color.fit_limit.quality_80.size_172x172.v1768410879.png.webp',
  },
];

export default function CashBackSection() {
  return (
    <section className="mb-16 md:mb-20 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Label */}
      <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">
        cha-ching
      </div>

      {/* Header Row */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between lg:mb-8 gap-2">
        <h2 className="text-xl font-bold capitalize leading-tight md:leading-normal">
          <a href="/cashback" className="hover:underline">
            Cash Back at Stores We Love
          </a>
        </h2>
        <a
          href="/cashback"
          className="text-xs font-semibold uppercase tracking-widest underline underline-offset-4 hover:text-purple-600 transition-colors"
        >
          All Cash Back
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 place-items-center gap-x-6 gap-y-8 md:grid-cols-4 lg:grid-cols-8">
        {cashBackStores.map((store) => (
          <a
            key={store.name}
            href="/cashback"
            className="group mb-auto flex flex-col items-center w-full"
          >
            {/* Circle Logo */}
            <div
              className={`mb-3 transition-shadow duration-300 ease-out group-hover:shadow-xl
                w-20 h-20 md:w-32 md:h-32 p-4 md:p-5 overflow-hidden rounded-full border ${store.borderColor}`}
              style={{ backgroundColor: store.bgColor }}
            >
              <img
                src={store.img}
                alt={store.name}
                className="aspect-square h-auto w-full object-contain"
                loading="lazy"
                width="86"
                height="86"
              />
            </div>

            {/* Label */}
            <div className="mx-auto max-w-28 text-center text-xs leading-tight group-hover:underline group-hover:underline-offset-4 lg:text-sm">
              <Zap
                className="-mr-1 mb-1 inline-block h-4 w-4 text-yellow-400 group-hover:animate-bounce"
                fill="currentColor"
              />
              <strong className="lg:mr-1">{store.cashBack}</strong> Cash&nbsp;Back
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
