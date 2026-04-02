'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'Categories', href: '/category' },
  { label: 'Stores', href: '/stores' },
  { label: 'Brands', href: '/brands' },
  { label: 'Banks', href: '/banks' },
  { label: 'Festivals', href: '/festivals' },
  { label: 'Product Deals', href: '/product-deals' },
  { label: 'Cities Deals', href: '/cities-deals' },
];

export default function MobileNavTabs() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap no-underline shrink-0 border transition-colors ${
              isActive
                ? 'bg-primary text-white border-primary'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary/30'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
