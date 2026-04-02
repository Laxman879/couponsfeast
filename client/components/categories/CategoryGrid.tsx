'use client';
import { useMemo, useEffect, useState } from 'react';
import {
  Plane, Shirt, Smartphone, Sparkles, Phone, MapPinned, UtensilsCrossed,
  Footprints, Sofa, Pill, Hotel, Clapperboard, Heart, Tablet, Camera,
  Gift, ShoppingBasket, Server, BookOpen, CreditCard, Monitor, Car,
  Gamepad2, Baby, Dumbbell, Music, Briefcase, Wrench, Tag,
  type LucideIcon
} from "lucide-react";
import CategoryCard from "./CategoryCard";
import { getCategories } from '@/services/api';

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

export default function CategoryGrid({ activeLetter, search, columns }: { activeLetter: string; search: string; columns: number }) {
  const [allCategories, setAllCategories] = useState<any[]>([]);

  useEffect(() => {
    getCategories().then(res => {
      const data = res.data?.data ?? res.data ?? [];
      setAllCategories((Array.isArray(data) ? data : []).map((c: any) => ({
        name: c.name,
        slug: c.slug,
        icon: getIcon(c.slug || '', c.name || ''),
      })));
    }).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = allCategories;
    if (activeLetter !== 'ALL') {
      list = list.filter(c => c.name.charAt(0).toUpperCase() === activeLetter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [activeLetter, search, allCategories]);

  if (allCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">No categories found. Add categories from admin.</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">No categories found</p>
      </div>
    );
  }

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  }[columns] || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid ${gridClass} gap-4`} key={columns}>
      {filtered.map((cat, i) => (
        <div key={cat.slug || cat.name} className="animate-scaleIn" style={{ animationDelay: `${i * 30}ms` }}>
          <CategoryCard icon={cat.icon} name={cat.name} />
        </div>
      ))}
    </div>
  );
}
