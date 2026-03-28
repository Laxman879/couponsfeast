interface Sale {
  title: string;
  desc: string;
}

interface StoreInfoProps {
  storeName: string;
  heading?: string;
  subheading?: string;
  sales?: Sale[];
}

export default function StoreInfo({ storeName, heading, subheading, sales = [] }: StoreInfoProps) {
  const displaySales = sales.length ? sales : [
    { title: `${storeName} Black Friday Sale`, desc: `${storeName} typically runs a Black Friday sale featuring major discounts across its range. Check back for the latest deals.` },
    { title: `${storeName} Cyber Monday Sale`, desc: `The brand is expected to participate in Cyber Monday with site-wide deals and promo codes.` },
    { title: `${storeName} Seasonal Sale`, desc: `During seasonal events, ${storeName} typically offers markdowns on popular products and accessories.` },
  ];

  return (
    <div className="py-10 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {heading || `${storeName} Store Info`}
      </h2>

      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
        {subheading || `What are the best ${storeName} sales and seasonal discounts?`}
      </h3>

      <ul className="space-y-4">
        {displaySales.map((sale, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 bg-gray-900 dark:bg-gray-100 rounded-full flex-shrink-0" />
            <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">
              <strong className="text-gray-900 dark:text-gray-100">{sale.title} –</strong> {sale.desc}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
