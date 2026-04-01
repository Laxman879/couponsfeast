import { Plane, Shirt, Smartphone, Sparkles } from "lucide-react";
import Link from "next/link";

const categories = [
  { icon: Plane, name: "Flight", slug: "flight", coupons: 511, offers: 759 },
  { icon: Shirt, name: "Fashion", slug: "fashion", coupons: 1347, offers: 5146 },
  { icon: Smartphone, name: "Electronics", slug: "electronics", coupons: 321, offers: 2011 },
  { icon: Sparkles, name: "Beauty", slug: "beauty", coupons: 1354, offers: 4565 },
];

export default function PopularCategories() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Popular Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/coupons/${cat.slug}-coupons`}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-primary/30 transition-all cursor-pointer group text-center no-underline block"
            style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
          >
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <cat.icon className="w-7 h-7 text-primary/70" />
              </div>
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{cat.name}</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              {cat.coupons.toLocaleString()} Coupons • {cat.offers.toLocaleString()} Offers
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
