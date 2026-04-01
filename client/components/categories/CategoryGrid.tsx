import { useMemo } from 'react';
import {
  Plane, Shirt, Smartphone, Sparkles, Phone, MapPinned,
  UtensilsCrossed, Footprints, Sofa, Pill, Hotel,
  Clapperboard, Heart, Tablet, Camera, Gift, ShoppingBasket,
  Server, BookOpen, CreditCard,
} from "lucide-react";
import CategoryCard from "./CategoryCard";

const allCategories = [
  { icon: Plane, name: "Flight" },
  { icon: Shirt, name: "Fashion" },
  { icon: Smartphone, name: "Electronics" },
  { icon: Sparkles, name: "Beauty" },
  { icon: CreditCard, name: "Recharge" },
  { icon: MapPinned, name: "Travel" },
  { icon: UtensilsCrossed, name: "Food" },
  { icon: Phone, name: "Mobile" },
  { icon: Footprints, name: "Footwear" },
  { icon: Sofa, name: "Furniture" },
  { icon: Pill, name: "Medicines" },
  { icon: Hotel, name: "Hotel" },
  { icon: Clapperboard, name: "Entertainment" },
  { icon: Heart, name: "Healthcare & Sports/Fitness" },
  { icon: Tablet, name: "Tablets" },
  { icon: Camera, name: "Cameras" },
  { icon: Gift, name: "Gifts and Flowers" },
  { icon: ShoppingBasket, name: "Groceries" },
  { icon: Server, name: "Hosting" },
  { icon: BookOpen, name: "Books and Media" },
];

export default function CategoryGrid({ activeLetter, search, columns }: { activeLetter: string; search: string; columns: number }) {
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
  }, [activeLetter, search]);

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
        <div key={cat.name} className="animate-scaleIn" style={{ animationDelay: `${i * 30}ms` }}>
          <CategoryCard icon={cat.icon} name={cat.name} />
        </div>
      ))}
    </div>
  );
}
