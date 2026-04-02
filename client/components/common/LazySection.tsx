'use client';
import { useRef, useState, useEffect, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  skeleton?: 'cards' | 'grid' | 'coupons' | 'banner' | 'stores';
}

function Skeleton({ type }: { type: string }) {
  const shimmer = 'bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl';

  if (type === 'banner') return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className={`${shimmer} h-[200px] w-full rounded-2xl`} />
    </div>
  );

  if (type === 'cards') return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className={`${shimmer} h-6 w-48 mb-6`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`${shimmer} h-[280px]`} />
        ))}
      </div>
    </div>
  );

  if (type === 'coupons') return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className={`${shimmer} h-6 w-64 mb-4`} />
      <div className="flex gap-3 mb-6">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`${shimmer} h-10 w-24`} style={{ borderRadius: 20 }} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className={`${shimmer} h-[180px]`} />
        ))}
      </div>
    </div>
  );

  if (type === 'stores') return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className={`${shimmer} h-6 w-40 mb-6`} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={`${shimmer} h-[100px] w-full`} />
            <div className={`${shimmer} h-4 w-20`} />
          </div>
        ))}
      </div>
    </div>
  );

  // Default grid
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className={`${shimmer} h-6 w-52 mb-6`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`${shimmer} h-[200px]`} />
        ))}
      </div>
    </div>
  );
}

export default function LazySection({ children, className = '', threshold = 0.1, rootMargin = '200px', skeleton = 'grid' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? (
        <div className="animate-sectionIn">{children}</div>
      ) : (
        <Skeleton type={skeleton} />
      )}
    </div>
  );
}
