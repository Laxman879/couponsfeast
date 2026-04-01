'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid3X3, Store, Tag, Landmark, PartyPopper, ShoppingBag, MapPin } from "lucide-react";

const menuItems = [
  { icon: Grid3X3, label: "Categories", href: "/category" },
  { icon: Store, label: "Stores", href: "/stores" },
  { icon: Tag, label: "Brands", href: "#" },
  { icon: Landmark, label: "Banks", href: "#" },
  { icon: PartyPopper, label: "Festivals", href: "#" },
  { icon: ShoppingBag, label: "Product Deals", href: "#" },
  { icon: MapPin, label: "Cities Deals", href: "#" },
];

const popularMerchants = [
  "Air India Coupons",
  "Myntra Coupons",
  "Amazon Coupons",
  "Hostinger Coupons",
  "Etihad Coupons",
  "Samsung Coupons",
];

export default function CategorySidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <nav className="space-y-0.5 mb-8">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-md text-sm font-medium transition-colors no-underline ${
                isActive
                  ? "bg-primary text-white"
                  : "text-primary hover:bg-primary/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 border-b-2 border-primary pb-1 inline-block">
          About Categories
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">
          If there&apos;s a deal out there, we&apos;ve already found it for you. GrabOn is India&apos;s #1 coupon
          destination, bringing you the best deals on flights, fashion, food, gadgets, entertainment.
        </p>
        <button className="text-xs text-primary font-medium mt-1 hover:underline">More</button>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Popular Merchants</h3>
        <div className="space-y-2">
          {popularMerchants.map((merchant) => (
            <Link
              key={merchant}
              href="#"
              className="block text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors no-underline"
            >
              {merchant}
            </Link>
          ))}
          <button className="text-xs text-primary font-medium hover:underline">See more</button>
        </div>
      </div>
    </div>
  );
}
