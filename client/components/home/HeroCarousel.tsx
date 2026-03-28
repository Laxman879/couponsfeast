import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerRenderer } from '@/components/banner/BannerLayouts';
import type { BannerData } from '@/components/banner/BannerLayouts';
import PromoModal from '@/components/coupon/PromoModal';
import { TiArrowLeft } from "react-icons/ti";
import { TiArrowRight } from "react-icons/ti";

const fallbackSlides = [
  {
    id: 1, label: 'THE DAILY DROP',
    title: 'Get 20% Cash Back on Select Home Decor & Furniture',
    cta: "SHOP TODAY'S SAVINGS",
    image: 'https://media.base44.com/images/public/69c4d555df7a59f8cce467e6/e366a7b71_generated_8d74765d.png',
    isActive: true,
  },
  {
    id: 2, label: 'EXCLUSIVE OFFER',
    title: 'Up to 50% Off Top-Rated Appliances & More',
    cta: 'SHOP THE DEALS',
    image: 'https://media.base44.com/images/public/69c4d555df7a59f8cce467e6/846c27246_generated_66425718.png',
    isActive: true,
  },
  {
    id: 3, label: 'SPRING SAVINGS',
    title: 'Save Big on Outdoor Living & Garden Essentials',
    cta: 'EXPLORE NOW',
    image: 'https://media.base44.com/images/public/69c4d555df7a59f8cce467e6/28b493b43_generated_83fe65f8.png',
    isActive: true,
  },
];

interface HeroCarouselProps {
  banners?: any[];
}

export default function HeroCarousel({ banners = [] }: HeroCarouselProps) {
  const slides = banners.length > 0 ? banners : fallbackSlides;
  const count = slides.length;

  const extended = [slides[count - 1], ...slides, slides[0]];

  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [modalBanner, setModalBanner] = useState<BannerData | null>(null);
  const isTransitioning = useRef(false);

  const realIndex = ((index - 1) % count + count) % count;

  const goTo = useCallback((i: number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setAnimate(true);
    setIndex(i);
  }, []);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  // After transition ends, silently jump if we're on a clone
  const handleTransitionEnd = useCallback(() => {
    isTransitioning.current = false;
    if (index === 0) {
      setAnimate(false);
      setIndex(count);
    } else if (index === count + 1) {
      setAnimate(false);
      setIndex(1);
    }
  }, [index, count]);

  // Auto-loop
  useEffect(() => {
    if (isHovered || count <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isHovered, count]);

  // Handle CTA click — open URL in new tab + show PromoModal on current tab
  const handleCtaClick = useCallback((banner: BannerData) => {
    const store = banner.store as any;
    const link = banner.buttonLink || banner.storeUrl || store?.websiteUrl || '';
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
    setModalBanner(banner);
  }, []);

  const handleCopy = () => {};

  // Reset on slide count change
  useEffect(() => {
    setAnimate(false);
    setIndex(1);
  }, [count]);

  return (
    <div className="w-full flex flex-col items-center gap-3 sm:gap-5 mt-16 sm:mt-20 md:mt-[85px]">
      <div
        className="relative w-full group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="overflow-hidden px-[4%] md:px-[10%]">
          <div
            className={`flex ${animate ? 'transition-transform duration-500 ease-in-out' : ''}`}
            style={{ transform: `translateX(-${index * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extended.map((slide: any, i: number) => (
              <div key={`${slide._id || slide.id || i}-${i}`} className="flex-shrink-0 w-full px-2">
                <BannerRenderer banner={slide} onCtaClick={() => handleCtaClick(slide)} />
              </div>
            ))}
          </div>
        </div>

        {count > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-[5%] md:left-[11%] top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary"
              aria-label="Previous slide">
              <TiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={next}
              className="absolute right-[5%] md:right-[11%] top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary"
              aria-label="Next slide">
              <TiArrowRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center gap-2">
          {slides.map((_: any, i: number) => (
            <button key={i} onClick={() => goTo(i + 1)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === realIndex ? 'w-3 h-3 bg-black dark:bg-white' : 'w-2.5 h-2.5 bg-gray-400 dark:bg-gray-500 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      )}

      {/* PromoModal for banner CTA */}
      {modalBanner && (
        <PromoModal
          onClose={() => setModalBanner(null)}
          title={modalBanner.title}
          code={modalBanner.couponCode}
          discount={modalBanner.discount}
          storeName={(modalBanner.store as any)?.storeName || modalBanner.label}
          storeUrl={modalBanner.buttonLink || modalBanner.storeUrl || (modalBanner.store as any)?.websiteUrl}
          expiryDate={modalBanner.expiryDate}
          details={modalBanner.details}
        />
      )}
    </div>
  );
}
