'use client';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

interface FooterThreeProps { config: any; }

export default function FooterThree({ config }: FooterThreeProps) {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primary  = isDark ? darkPalette.cardBg : (config?.bgColor || siteConfig?.theme?.primaryColor || '#7c3aed');
  const textMain = isDark ? darkPalette.text : (config?.textColor || '#ffffff');
  const textHead = isDark ? darkPalette.text : '#1f2937';
  const border   = isDark ? darkPalette.cardBg : '#d1d5db';
  const inputBg  = isDark ? darkPalette.cardBg : '#ffffff';
  const btnBg    = isDark ? siteConfig?.theme?.primaryColor || '#6d28d9' : '#111827';
  const siteName = siteConfig?.siteName || 'CouponsFeast';
  const logoUrl  = siteConfig?.logos?.footer;
  const accent   = siteConfig?.theme?.primaryColor || '#7c3aed';

  const content = siteConfig?.footerContent;
  const tagline = content?.tagline || `Find the best deals, coupons, and discounts from top brands. Save money on your favorite products with ${siteName}.`;
  const col0 = content?.columns?.[0] ?? { heading: 'COMPANY', links: [{ label: 'Home', href: '/' }, { label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Partners', href: '#' }] };
  const col1 = content?.columns?.[1] ?? { heading: 'SUPPORT', links: [{ label: 'Help Center', href: '#' }, { label: 'Safety Information', href: '#' }, { label: 'Cancellation Options', href: '#' }, { label: 'Contact Us', href: '#' }, { label: 'Accessibility', href: '#' }] };

  return (
    <footer style={{ backgroundColor: primary, color: textMain }} className="pt-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        {/* Brand + social */}
        <div className="max-w-80">
          {logoUrl ? (
            <img src={logoUrl.startsWith('http') ? logoUrl : `http://localhost:5000${logoUrl}`} alt={siteName} className="mb-4 h-16 w-auto" />
          ) : (
            <span className="text-2xl font-extrabold tracking-tight mb-4 block" style={{ color: accent }}>{siteName}</span>
          )}
          <p className="text-sm mb-4">{tagline}</p>
          <div className="flex items-center gap-3 mt-2">
            <a href={siteConfig?.socialMedia?.instagram?.url || '#'} className="hover:opacity-75 transition" style={{ color: textMain }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75A3.25 3.25 0 017.75 4.5h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zm9.5 1a4 4 0 11-4 4 4 4 0 014-4zm0 1.5a2.5 2.5 0 102.5 2.5 2.5 2.5 0 00-2.5-2.5zm3.5-.75a.75.75 0 11.75-.75.75.75 0 01-.75.75z" /></svg>
            </a>
            <a href={siteConfig?.socialMedia?.facebook?.url || '#'} className="hover:opacity-75 transition" style={{ color: textMain }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 9H15V6.5h-1.5c-1.933 0-3.5 1.567-3.5 3.5v1.5H8v3h2.5V21h3v-7.5H16l.5-3h-3z" /></svg>
            </a>
            <a href={siteConfig?.socialMedia?.twitter?.url || '#'} className="hover:opacity-75 transition" style={{ color: textMain }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 5.92a8.2 8.2 0 01-2.36.65A4.1 4.1 0 0021.4 4a8.27 8.27 0 01-2.6 1A4.14 4.14 0 0016 4a4.15 4.15 0 00-4.15 4.15c0 .32.04.64.1.94a11.75 11.75 0 01-8.52-4.32 4.14 4.14 0 001.29 5.54A4.1 4.1 0 013 10v.05a4.15 4.15 0 003.33 4.07 4.12 4.12 0 01-1.87.07 4.16 4.16 0 003.88 2.89A8.33 8.33 0 012 19.56a11.72 11.72 0 006.29 1.84c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.35-.01-.53A8.18 8.18 0 0022 5.92z" /></svg>
            </a>
            <a href={siteConfig?.socialMedia?.linkedin?.url || '#'} className="hover:opacity-75 transition" style={{ color: textMain }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z" /></svg>
            </a>
          </div>
        </div>

        {/* Column 0 */}
        <div>
          <p className="text-lg font-semibold mb-3" style={{ color: textHead }}>{col0.heading}</p>
          <ul className="flex flex-col gap-2 text-sm">
            {col0.links.map((item: any) => (
              <li key={item.label} className="list-none">
                <a href={item.href} className="hover:underline transition no-underline opacity-70 hover:opacity-100" style={{ color: textMain }}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 1 */}
        <div>
          <p className="text-lg font-semibold mb-3" style={{ color: textHead }}>{col1.heading}</p>
          <ul className="flex flex-col gap-2 text-sm">
            {col1.links.map((item: any) => (
              <li key={item.label} className="list-none">
                <a href={item.href} className="hover:underline transition no-underline opacity-70 hover:opacity-100" style={{ color: textMain }}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="max-w-80">
          <p className="text-lg font-semibold mb-3" style={{ color: textHead }}>STAY UPDATED</p>
          <p className="text-sm mb-4">Subscribe to our newsletter for inspiration and special offers.</p>
          <div className="flex items-center">
            <input type="email" placeholder="Your email"
              className="rounded-l border h-9 px-3 outline-none text-sm w-full"
              style={{ backgroundColor: inputBg, borderColor: border, color: textHead }}
            />
            <button className="flex items-center justify-center h-9 w-9 aspect-square rounded-r transition hover:opacity-80" style={{ backgroundColor: btnBg }}>
              <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <hr style={{ borderColor: border, marginTop: '2rem' }} />
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p className="text-sm" style={{ color: textMain }}>
          {siteConfig?.footer?.copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
        </p>
        <ul className="flex items-center gap-4 text-sm">
          {(content?.bottomLinks || [{ label: 'Privacy Policy', href: '/privacy-policy' }, { label: 'Terms & Conditions', href: '/terms-and-conditions' }, { label: 'Sitemap', href: '/sitemap.xml' }]).map((item: any) => (
            <li key={item.label} className="list-none">
              <a href={item.href} className="no-underline hover:underline transition" style={{ color: textMain }}>{item.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
