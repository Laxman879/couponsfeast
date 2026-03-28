'use client';

import { useEffect, useState } from 'react';
import { getBanners } from '@/services/api';
import HeroCarousel from '@/components/home/HeroCarousel';

interface HeroBannerProps {
  data: { title?: string; image?: string };
}

export default function HeroBanner({ data }: HeroBannerProps) {
  const [banners, setBanners] = useState<any[] | null>(null);

  useEffect(() => {
    getBanners()
      .then((res) => {
        const list = res.data?.data ?? res.data ?? [];
        const active = (Array.isArray(list) ? list : []).filter((b: any) => b.isActive);
        setBanners(active.length > 0 ? active : null);
      })
      .catch(() => setBanners(null));
  }, []);

  return <HeroCarousel banners={banners ?? undefined} />;
}
