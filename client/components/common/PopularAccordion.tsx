'use client';
import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { getPopularLinks } from '@/services/api';

const fallbackCategories = [
  'Baby', 'Beauty', 'Books', 'Car Rentals', 'Cell Phones',
  'Clothing', 'Cosmetics', 'Electronics', 'Fast Food', 'Flights',
  'Flowers', 'Food Delivery', 'Furniture', 'Home Improvement', 'Hotels',
  'Jewelry', 'Movie Theaters', 'Pets', 'Photo', 'Photo Prints',
  'Pizza', 'Restaurants', 'Shoes', 'Toys', 'Travel',
  'TV & Home Theater', 'Video Games',
];

const fallbackStores = [
  'Amazon', 'Target', 'Walmart', 'Best Buy', 'Nike',
  'Old Navy', 'Gap', 'H&M', "Macy's", "Kohl's",
  'Nordstrom', 'Sephora', 'Ulta Beauty', 'Bath & Body Works', 'HomeDepot',
  "Lowe's", 'Wayfair', 'IKEA', 'Chewy', 'PetSmart',
  "Domino's", 'DoorDash', 'Uber Eats', 'Grubhub', 'Instacart',
];

interface LinkItem { name: string; href: string; }

function AccordionSection({ title, items, defaultOpen = false }: {
  title: string;
  items: LinkItem[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const cols = 5;
  const perCol = Math.ceil(items.length / cols);
  const columns = Array.from({ length: cols }, (_, i) =>
    items.slice(i * perCol, i * perCol + perCol)
  );

  return (
    <div className={`border ${open ? 'border-gray-200 dark:border-gray-600' : 'border-primary'} rounded-sm`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left group cursor-pointer"
      >
        <span className="text-sm font-black tracking-widest uppercase text-gray-900 dark:text-gray-100">{title}</span>
        <span className="text-gray-900 dark:text-gray-100">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-5 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-0">
            {columns.map((col, ci) => (
              <div key={ci} className="flex flex-col">
                {col.map((item) => (
                  <a key={item.name} href={item.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:font-semibold py-1 leading-snug transition-colors">
                    {item.name}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PopularAccordion() {
  const [categories, setCategories] = useState<LinkItem[]>(fallbackCategories.map(n => ({ name: n, href: '#' })));
  const [stores, setStores] = useState<LinkItem[]>(fallbackStores.map(n => ({ name: n, href: '#' })));

  useEffect(() => {
    getPopularLinks()
      .then((res) => {
        const links = res.data?.data ?? [];
        if (links.length === 0) return;
        const cats = links.filter((l: any) => l.type === 'category').map((l: any) => ({ name: l.name, href: l.href || '#' }));
        const strs = links.filter((l: any) => l.type === 'store').map((l: any) => ({ name: l.name, href: l.href || '#' }));
        if (cats.length > 0) setCategories(cats);
        if (strs.length > 0) setStores(strs);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
      <div className="flex flex-col gap-4">
        <AccordionSection title="Popular Categories" items={categories} defaultOpen />
        <AccordionSection title="Popular Stores" items={stores} />
      </div>
    </section>
  );
}
