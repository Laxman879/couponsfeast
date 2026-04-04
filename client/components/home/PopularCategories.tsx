'use client';

import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

const categories = [
  ['Flight Coupons', 'Travel Coupons', 'Hotel Coupons', 'Pizza Coupons', 'Entertainment Coupons', 'Utility Bill Payments Coupons', 'Lab Tests Coupons', 'Meat & Dairy Coupons'],
  ['Fashion Coupons', 'Medicines Coupons', 'Kitchen Appliances Coupons', 'Services Coupons', 'Bike Rentals Coupons', 'Gifts & Flowers Coupons', 'Eyewear Coupons'],
  ['Electronics Coupons', 'Bus Coupons', 'OTT Coupons', 'Footwear Coupons', 'Furniture Coupons', 'Jewellery Coupons', 'Kids & Lifestyle Coupons'],
  ['Groceries Coupons', 'Education Coupons', 'Hosting Coupons', 'Lingerie Coupons', 'Recharge Coupons', 'Protein Supplements Coupons', 'Beauty Coupons'],
];

export default function PopularCategories() {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');
  const mutedText = isDark ? `${darkPalette.text}cc` : `${textColor}cc`;
  const sectionBg = isDark ? darkPalette.bg : '#f9fafb';

  return (
    <section className="py-10" style={{ backgroundColor: sectionBg }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: textColor }}>
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-12">
          {categories.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-3">
              {column.map((item, i) => {
                const slug = item.toLowerCase().replace(/ coupons$/i, '').replace(/[&\/]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
                return (
                  <a
                    key={i}
                    href={`/coupons/${slug}-coupons`}
                    className="text-sm no-underline transition-colors"
                    style={{ color: mutedText }}
                    onMouseEnter={e => (e.currentTarget.style.color = primary)}
                    onMouseLeave={e => (e.currentTarget.style.color = mutedText)}
                  >
                    {item}
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
