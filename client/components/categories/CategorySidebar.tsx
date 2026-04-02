'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid3X3, Store, Tag, Landmark, PartyPopper, ShoppingBag, MapPin } from "lucide-react";
import { getStores, getSiteConfig } from '@/services/api';

const menuItems = [
  { icon: Grid3X3, label: "Categories", href: "/category" },
  { icon: Store, label: "Stores", href: "/stores" },
  { icon: Tag, label: "Brands", href: "/brands" },
  { icon: Landmark, label: "Banks", href: "/banks" },
  { icon: PartyPopper, label: "Festivals", href: "/festivals" },
  { icon: ShoppingBag, label: "Product Deals", href: "/product-deals" },
  { icon: MapPin, label: "Cities Deals", href: "/cities-deals" },
];

export default function CategorySidebar() {
  const pathname = usePathname();
  const [stores, setStores] = useState<any[]>([]);
  const [siteName, setSiteName] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getStores().then(res => {
      const data = res.data?.data ?? res.data ?? [];
      setStores(Array.isArray(data) ? data : []);
    }).catch(() => {});
    getSiteConfig().then(res => {
      setSiteName(res.data?.siteName || res.data?.data?.siteName || '');
    }).catch(() => {});
  }, []);

  const visibleStores = showAll ? stores : stores.slice(0, 6);

  return (
    <div className="w-full">
      <nav className="space-y-0.5 mb-8">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-md text-sm font-medium transition-colors no-underline ${isActive ? "bg-primary text-white" : "text-primary hover:bg-primary/5"}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {siteName && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 border-b-2 border-primary pb-1 inline-block">
            About Categories
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">
            If there&apos;s a deal out there, we&apos;ve already found it for you. {siteName} is your #1 coupon
            destination, bringing you the best deals on flights, fashion, food, gadgets, entertainment.
          </p>
        </div>
      )}

      {stores.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Popular Merchants</h3>
          <div className="space-y-2">
            {visibleStores.map((store) => (
              <Link key={store._id} href={`/coupons/${store.slug}-coupons`}
                className="block text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors no-underline">
                {store.storeName} Coupons
              </Link>
            ))}
            {stores.length > 6 && (
              <button onClick={() => setShowAll(!showAll)} className="text-xs text-primary font-medium hover:underline">
                {showAll ? 'Show less' : 'See more'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
