interface AboutSectionProps {
  storeName: string;
  heading?: string;
  paragraphs?: string[];
  primaryColor?: string;
}

export default function AboutSection({ storeName, heading, paragraphs = [], primaryColor = '#7c3aed' }: AboutSectionProps) {
  const displayParagraphs = paragraphs.length ? paragraphs : [
    `People who love saving money will want to check out ${storeName}. This brand offers a wide range of products with frequent discounts and promotional offers available throughout the year.`,
    `${storeName} regularly updates its deals and coupon codes. Sign up for their newsletter to get early access to sales and exclusive member discounts.`,
  ];

  return (
    <div className="py-10 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
        {heading || `About ${storeName}`}
      </h3>
      <div className="space-y-4">
        {displayParagraphs.map((p, i) => (
          <p key={i} className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">{p}</p>
        ))}
      </div>
    </div>
  );
}
