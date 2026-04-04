'use client';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

interface FooterTwoProps { config: any; }

export default function FooterTwo({ config }: FooterTwoProps) {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primary   = isDark ? darkPalette.cardBg : (config?.bgColor || siteConfig?.theme?.primaryColor || '#7c3aed');
  const textMain  = isDark ? darkPalette.text : (config?.textColor || '#ffffff');
  const textMuted = isDark ? (darkPalette.text + 'b3') : 'rgba(255,255,255,0.7)';
  const border    = isDark ? darkPalette.cardBg : 'rgba(107,114,128,0.3)';
  const siteName  = siteConfig?.siteName || 'CouponsFeast';
  const logoUrl   = siteConfig?.logos?.footer;

  const content = siteConfig?.footerContent;
  const tagline = content?.tagline || 'Find the best deals, coupons, and discounts from top brands.';
  const defaultCols = [
    { heading: 'Quick Links', links: [{ label: 'Home', href: '/' }, { label: 'Best Sellers', href: '/stores' }, { label: 'Offers & Deals', href: '/coupons' }, { label: 'Contact Us', href: '#' }, { label: 'FAQs', href: '#' }] },
    { heading: 'Need Help?', links: [{ label: 'Delivery Information', href: '#' }, { label: 'Return & Refund Policy', href: '#' }, { label: 'Payment Methods', href: '#' }, { label: 'Track your Order', href: '#' }, { label: 'Contact Us', href: '#' }] },
    { heading: 'Follow Us', links: [{ label: 'Instagram', href: siteConfig?.socialMedia?.instagram?.url || '#' }, { label: 'Twitter', href: siteConfig?.socialMedia?.twitter?.url || '#' }, { label: 'Facebook', href: siteConfig?.socialMedia?.facebook?.url || '#' }, { label: 'YouTube', href: siteConfig?.socialMedia?.youtube?.url || '#' }] },
  ];
  const linkSections = content?.columns?.length ? content.columns : defaultCols;

  return (
    <footer style={{ backgroundColor: primary, color: textMain }}>
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10" style={{ borderBottom: `1px solid ${border}` }}>
          <div>
            {logoUrl ? (
              <img src={logoUrl.startsWith('http') ? logoUrl : `http://localhost:5000${logoUrl}`} alt={siteName} className="h-16 w-auto mb-4" />
            ) : (
              <span className="text-2xl font-extrabold tracking-tight" style={{ color: siteConfig?.theme?.primaryColor || '#7c3aed' }}>{siteName}</span>
            )}
            <p className="max-w-[410px] mt-4 text-sm" style={{ color: textMuted }}>{tagline}</p>
          </div>
          <div className="flex flex-wrap justify-between w-full md:w-[55%] gap-5">
            {linkSections.map((section: any) => (
              <div key={section.heading}>
                <h3 className="font-semibold text-base mb-4" style={{ color: textMain }}>{section.heading}</h3>
                <ul className="text-sm space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label} className="list-none">
                      <a href={link.href} className="hover:underline transition no-underline" style={{ color: textMuted }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                        onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
                      >{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="py-4 text-center text-sm" style={{ color: textMuted }}>
          {siteConfig?.footer?.copyright || `Copyright ${new Date().getFullYear()} © ${siteName}. All Rights Reserved.`}
        </p>
      </div>
    </footer>
  );
}
