'use client';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

interface FooterFourProps { config: any; }

export default function FooterFour({ config }: FooterFourProps) {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bg        = config?.bgColor || (isDark ? darkPalette.bg : '#18181b');
  const textMain  = config?.textColor || '#d4d4d8';
  const textHead  = '#ffffff';
  const textMuted = '#71717a';
  const border    = isDark ? darkPalette.cardBg : '#3f3f46';
  const iconBg    = '#27272a';
  const iconBorder = '#3f3f46';
  const siteName  = siteConfig?.siteName || 'CouponsFeast';
  const logoUrl   = siteConfig?.logos?.footer;
  const accent    = siteConfig?.theme?.primaryColor || '#7c3aed';

  const content = siteConfig?.footerContent;
  const tagline = content?.tagline || `Find the best deals, coupons, and discounts from top brands. Save money on your favorite products with ${siteName}.`;
  const defaultCols = [
    { heading: 'Products',  links: [{ label: 'All Coupons', href: '/coupons' }, { label: 'Top Stores', href: '/stores' }, { label: 'Categories', href: '/categories' }, { label: 'Trending', href: '/trending' }] },
    { heading: 'Company',   links: [{ label: 'About Us', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Contact', href: '#' }] },
    { heading: 'Resources', links: [{ label: 'Help Center', href: '#' }, { label: 'Privacy Policy', href: '#' }, { label: 'Terms of Service', href: '#' }, { label: 'Sitemap', href: '#' }] },
  ];
  const columns = content?.columns?.length ? content.columns : defaultCols;

  const socialLinks = [
    { href: siteConfig?.socialMedia?.twitter?.url || '#', icon: <path d="m5.44.5 3.777 4.994.37.49.405-.463L14.385.5h1.428l-5.296 6.054-.269.306.246.325 6.479 8.565h-4.296l-4.195-5.484-.37-.486-.403.46-4.822 5.51h-1.43l5.716-6.533.27-.308-.25-.325L1.012.5zM2.822 1.867l9.972 13.036.15.197h2.78l-.607-.801-9.86-13.037-.15-.199h-2.9z" fill="currentColor" stroke="#90a1b9" />, vb: '0 0 18 17' },
    { href: siteConfig?.socialMedia?.linkedin?.url || '#', icon: <path d="M12.167.5c1.326 0 2.598.523 3.535 1.454a4.95 4.95 0 0 1 1.465 3.512v5.793h-3.334V5.466c0-.44-.175-.86-.488-1.17a1.673 1.673 0 0 0-2.357 0 1.65 1.65 0 0 0-.488 1.17v5.793H7.167V5.466c0-1.317.527-2.58 1.464-3.512A5.02 5.02 0 0 1 12.167.5M3.833.5H.5v9.931h3.333z" stroke="#90a1b9" strokeLinecap="round" strokeLinejoin="round" fill="none" />, vb: '0 0 18 12' },
    { href: siteConfig?.socialMedia?.youtube?.url || '#', icon: <><path d="M.937 10.486a19.8 19.8 0 0 1 0-8.276 1.65 1.65 0 0 1 1.166-1.158c4.47-.736 9.03-.736 13.5 0A1.67 1.67 0 0 1 16.77 2.21a19.8 19.8 0 0 1 0 8.276 1.65 1.65 0 0 1-1.167 1.159c-4.47.735-9.03.735-13.5 0a1.67 1.67 0 0 1-1.166-1.159" stroke="#90a1b9" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="m7.187 9.466 4.166-2.483L7.187 4.5z" stroke="#90a1b9" strokeLinecap="round" strokeLinejoin="round" fill="none" /></>, vb: '0 0 18 13' },
    { href: siteConfig?.socialMedia?.instagram?.url || '#', icon: <path d="M13 .5H4.667C2.365.5.5 2.353.5 4.638v8.276c0 2.285 1.865 4.138 4.167 4.138H13c2.301 0 4.167-1.853 4.167-4.138V4.638C17.167 2.353 15.3.5 13 .5" stroke="#90a1b9" strokeLinecap="round" strokeLinejoin="round" fill="none" />, vb: '0 0 18 18' },
  ];

  return (
    <footer style={{ backgroundColor: bg, color: textMain }} className="px-4 sm:px-6 md:px-8 lg:px-20 pt-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 pb-12">
          {/* Brand */}
          <div className="flex-1 max-w-full lg:max-w-[400px]">
            <div className="mb-6">
              {logoUrl ? (
                <img src={logoUrl.startsWith('http') ? logoUrl : `http://localhost:5000${logoUrl}`} alt={siteName} className="h-16 w-auto" />
              ) : (
                <span className="text-2xl font-extrabold tracking-tight" style={{ color: accent }}>{siteName}</span>
              )}
            </div>
            <p className="text-sm leading-7 mb-7 max-w-80" style={{ color: textMuted }}>{tagline}</p>
            <div className="flex gap-4">
              {socialLinks.map((s, i) => (
                <a key={i} href={s.href} className="flex items-center justify-center rounded-full transition-colors hover:opacity-75"
                  style={{ width: 36, height: 36, backgroundColor: iconBg, border: `1px solid ${iconBorder}` }}>
                  <svg width="18" height="18" viewBox={s.vb} fill="none" xmlns="http://www.w3.org/2000/svg">{s.icon}</svg>
                </a>
              ))}
            </div>
            {config?.showAppDownload !== false && (
              <div className="flex gap-3 mt-6">
                <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg" alt="Google Play" className="h-10 w-auto rounded" style={{ border: `1px solid ${border}` }} />
                <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg" alt="App Store" className="h-10 w-auto rounded" style={{ border: `1px solid ${border}` }} />
              </div>
            )}
          </div>

          {/* Columns */}
          <div className="flex flex-wrap sm:flex-nowrap flex-1 justify-between gap-8 w-full max-w-3xl">
            {columns.map((col: any) => (
              <div key={col.heading}>
                <h3 className="text-base font-medium mb-6" style={{ color: textHead }}>{col.heading}</h3>
                <ul className="flex flex-col gap-3 list-none">
                  {col.links.map((item: any) => (
                    <li key={item.label}>
                      <a href={item.href} className="text-sm no-underline transition-opacity opacity-60 hover:opacity-100" style={{ color: '#d4d4d8' }}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {config?.showContactInfo !== false && (
          <div className="flex flex-col md:flex-row gap-6 md:gap-16 py-9 max-w-6xl" style={{ borderTop: `1px solid ${border}` }}>
            {siteConfig?.footer?.address && (
              <div className="flex items-start gap-2.5 flex-1">
                <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, backgroundColor: iconBg, border: `1px solid ${iconBorder}` }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 8.335c0 4.16-4.616 8.494-6.166 9.832a.83.83 0 0 1-1.002 0c-1.55-1.338-6.166-5.672-6.166-9.832a6.667 6.667 0 0 1 13.334 0" stroke="#45556c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M7.5 8.335 9.167 10 12.5 6.668" stroke="#45556c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <h4 className="text-base font-medium mb-0.5" style={{ color: textHead }}>Address</h4>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{siteConfig.footer.address}</p>
                </div>
              </div>
            )}
            {siteConfig?.footer?.phone && (
              <div className="flex items-start gap-2.5 flex-1">
                <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, backgroundColor: iconBg, border: `1px solid ${iconBorder}` }}>
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none"><g clipPath="url(#a)"><path d="M10.95 13.115a.79.79 0 0 0 .96-.24l.282-.368a1.58 1.58 0 0 1 1.266-.633h2.375a1.583 1.583 0 0 1 1.584 1.583v2.375a1.583 1.583 0 0 1-1.584 1.583 14.25 14.25 0 0 1-14.25-14.25 1.583 1.583 0 0 1 1.584-1.583h2.375a1.583 1.583 0 0 1 1.583 1.583V5.54a1.58 1.58 0 0 1-.633 1.267l-.37.278a.79.79 0 0 0-.232.976 11.1 11.1 0 0 0 5.06 5.054" stroke="#45556c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h19v19H0z" /></clipPath></defs></svg>
                </div>
                <div>
                  <h4 className="text-base font-medium mb-0.5" style={{ color: textHead }}>Phone</h4>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{siteConfig.footer.phone}</p>
                </div>
              </div>
            )}
            {siteConfig?.footer?.email && (
              <div className="flex items-start gap-2.5 flex-1">
                <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, backgroundColor: iconBg, border: `1px solid ${iconBorder}` }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="m18.333 5.832-7.492 4.773a1.67 1.67 0 0 1-1.674 0l-7.5-4.773" stroke="#45556c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16.667 3.332H3.333c-.92 0-1.666.746-1.666 1.667v10c0 .92.746 1.666 1.666 1.666h13.334c.92 0 1.666-.746 1.666-1.666v-10c0-.92-.746-1.667-1.666-1.667" stroke="#45556c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <h4 className="text-base font-medium mb-0.5" style={{ color: textHead }}>Email</h4>
                  <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{siteConfig.footer.email}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4" style={{ borderTop: `1px solid ${border}` }}>
          <p className="text-sm" style={{ color: textMuted }}>
            {siteConfig?.footer?.copyright || `© ${new Date().getFullYear()} ${siteName}. All Rights Reserved.`}
          </p>
          <div className="flex flex-wrap justify-center gap-5 md:gap-9">
            {(content?.bottomLinks || [{ label: 'Privacy Policy', href: '/privacy-policy' }, { label: 'Terms & Conditions', href: '/terms-and-conditions' }, { label: 'About Us', href: '/about-us' }]).map((item: any) => (
              <a key={item.label} href={item.href} className="text-sm no-underline transition-colors hover:opacity-80" style={{ color: textMuted }}>{item.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
