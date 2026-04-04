'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import { getCategories, getCoupons } from '@/services/api';
import {
  Plane, Shirt, Smartphone, Sparkles, Phone, MapPinned, UtensilsCrossed,
  Footprints, Sofa, Pill, Hotel, Clapperboard, Heart, Tablet, Camera,
  Gift, ShoppingBasket, Server, BookOpen, CreditCard, Monitor, Car,
  Gamepad2, Baby, Dumbbell, Music, Briefcase, Wrench, Tag,
  type LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  flight: Plane, travel: Plane, fashion: Shirt, clothing: Shirt,
  electronics: Smartphone, tech: Monitor, beauty: Sparkles, cosmetics: Sparkles,
  recharge: CreditCard, mobile: Phone, food: UtensilsCrossed, dining: UtensilsCrossed,
  footwear: Footprints, furniture: Sofa, home: Sofa, medicines: Pill, pharmacy: Pill,
  hotel: Hotel, entertainment: Clapperboard, healthcare: Heart, health: Heart,
  fitness: Dumbbell, sports: Dumbbell, tablets: Tablet, cameras: Camera,
  gifts: Gift, groceries: ShoppingBasket, grocery: ShoppingBasket,
  hosting: Server, software: Server, books: BookOpen, education: BookOpen,
  automotive: Car, gaming: Gamepad2, baby: Baby, kids: Baby,
  music: Music, business: Briefcase, tools: Wrench,
};

function getIcon(slug: string, name: string): LucideIcon {
  const s = slug?.toLowerCase() || '';
  const n = name?.toLowerCase() || '';
  return ICON_MAP[s] || ICON_MAP[n] || Object.entries(ICON_MAP).find(([k]) => s.includes(k) || n.includes(k))?.[1] || Tag;
}

export default function PopularCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [couponCounts, setCouponCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    getCategories().then(res => {
      const data = res.data?.data ?? res.data ?? [];
      setCategories((Array.isArray(data) ? data : []).slice(0, 4));
    }).catch(() => {});

    getCoupons({ limit: 100 }).then(res => {
      const data = res.data?.data ?? res.data ?? [];
      const counts: Record<string, number> = {};
      (Array.isArray(data) ? data : []).forEach((c: any) => {
        const cat = (c.category?.name || c.category || '').toLowerCase();
        if (cat) counts[cat] = (counts[cat] || 0) + 1;
      });
      setCouponCounts(counts);
    }).catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Popular Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = getIcon(cat.slug || '', cat.name || '');
          const count = couponCounts[(cat.name || '').toLowerCase()] || 0;
          return (
            <Link key={cat._id} href={`/coupons/${(cat.slug || '').replace(/-coupons$/, '')}-coupons`}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-primary/30 transition-all cursor-pointer group text-center no-underline block"
              style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-7 h-7 text-primary/70" />
                </div>
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{cat.name}</h3>
              {count > 0 && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  {count.toLocaleString()} Coupons
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
