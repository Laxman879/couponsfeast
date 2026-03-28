interface Section {
  title: string;
  body: string;
}

interface PromoCodeInfoProps {
  storeName: string;
  heading?: string;
  logoBgColor?: string;
  logoText?: string;
  logoUrl?: string;
  sections?: Section[];
  primaryColor?: string;
}

export default function PromoCodeInfo({
  storeName,
  heading,
  logoBgColor = '#fef9c3',
  logoText,
  logoUrl,
  sections = [],
  primaryColor = '#7c3aed',
}: PromoCodeInfoProps) {
  const displayHeading = heading || `${storeName} Promo Codes`;
  const left = sections.length
    ? sections.slice(0, Math.ceil(sections.length / 2))
    : [{ title: `1. Types of ${storeName} promo codes available`, body: `${storeName} offers a variety of discounts throughout the year including percentage-off sitewide sales, free shipping codes, and special offers for new sign-ups.` },
       { title: `2. When to shop with a ${storeName} coupon code`, body: `Major promotions tend to align with Black Friday, Cyber Monday, and holiday shopping events — excellent opportunities to grab products at the lowest prices of the year.` }];
  const right = sections.length
    ? sections.slice(Math.ceil(sections.length / 2))
    : [{ title: `3. Things to watch out for`, body: `Most ${storeName} promo codes apply to full-priced items but may exclude sale merchandise or gift cards. Always check whether your discount stacks with other promotions.` },
       { title: `4. How to use a ${storeName} coupon`, body: `Copy the code, add items to your cart, and paste the code at checkout in the discount field. Your savings will be applied automatically.` }];

  return (
    <div className="py-10 border-t border-gray-200 dark:border-gray-700">
      <div style={{ border: '1px solid #ddd' }} className="rounded-xl p-6 md:p-8 bg-white dark:bg-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-1">
            WHAT TO EXPECT FROM
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ color: primaryColor }}>
            {displayHeading}
          </h2>
          {left.map((s, i) => (
            <div key={i} className="mb-5">
              {s.title && <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{s.title}</h3>}
              {s.body && <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">{s.body}</p>}
            </div>
          ))}
        </div>

        {/* Right column */}
        <div>
          {/* Logo card */}
          <div
            className="rounded-lg p-8 mb-6 flex items-center justify-center min-h-[240px]"
            style={{ background: logoBgColor }}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="w-48 h-48 object-contain" />
            ) : (
              <span className="text-5xl font-bold text-gray-900">
                {logoText || storeName.slice(0, 3).toLowerCase()}
              </span>
            )}
          </div>

          {right.map((s, i) => (
            <div key={i} className="mb-5">
              {s.title && <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{s.title}</h3>}
              {s.body && <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">{s.body}</p>}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
