'use client';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

interface FooterOneProps { config: any; }

const getSocialIcon = (iconName: string) => {
  const p = { className: 'w-5 h-5 text-white' };
  switch (iconName.toLowerCase()) {
    case 'facebook':  return <Facebook {...p} />;
    case 'twitter':   return <Twitter {...p} />;
    case 'instagram': return <Instagram {...p} />;
    case 'linkedin':  return <Linkedin {...p} />;
    case 'youtube':   return <Youtube {...p} />;
    default:          return <Facebook {...p} />;
  }
};

export default function FooterOne({ config }: FooterOneProps) {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primary   = isDark ? darkPalette.cardBg : (config?.bgColor || siteConfig?.theme?.primaryColor || '#7c3aed');
  const secondary = isDark ? darkPalette.bg : (siteConfig?.theme?.secondaryColor || '#9333ea');
  const accent    = (siteConfig?.theme as any)?.accentColor || '#f59e0b';
  const linkColor = config?.textColor || '#ffffff';

  const content = siteConfig?.footerContent;
  const col0 = content?.columns?.[0] ?? { heading: '', links: [{ label: 'Cash Back', href: '#' }, { label: 'Browse Stores', href: '/stores' }, { label: 'Browse Categories', href: '/categories' }, { label: 'Blog', href: '#' }] };
  const col1 = content?.columns?.[1] ?? { heading: 'MY RMN', links: [{ label: 'My Account', href: '#' }, { label: 'Submit a Coupon', href: '#' }, { label: 'Get Help', href: '#' }] };
  const bottomLinks = content?.bottomLinks ?? content?.columns?.[2]?.links ?? [{ label: 'Terms & Conditions', href: '/terms-and-conditions' }, { label: 'Privacy Policy', href: '/privacy-policy' }, { label: 'Sitemap', href: '/sitemap.xml' }];

  return (
    <footer className="text-white" style={{ backgroundColor: primary }}>
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="mb-8">
          {siteConfig?.logos?.footer ? (
            <img src={siteConfig.logos.footer.startsWith('http') ? siteConfig.logos.footer : `http://localhost:5000${siteConfig.logos.footer}`} alt={siteConfig.siteName} className="h-16 w-auto mb-2" />
          ) : (
            <h2 className="text-3xl md:text-4xl font-bold italic tracking-tight">
              {siteConfig?.siteName || 'CouponsFeast'}{' '}
              <span className="text-4xl md:text-5xl font-extrabold" style={{ color: accent }}>20</span>
              <span className="text-sm align-top ml-0.5">YEARS</span>
            </h2>
          )}
          <p className="text-xs tracking-widest opacity-80 mt-1 uppercase">Celebrating 20 Years of Savings</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div>
            {col0.heading && <h3 className="text-sm font-bold tracking-wide mb-4 uppercase">{col0.heading}</h3>}
            <ul className="space-y-2.5">
              {col0.links.map((link: any) => (
                <li key={link.label} className="list-none">
                  <a href={link.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity no-underline"
                    style={{ color: '#ffffff' }}>
                    {link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide mb-4 uppercase">{col1.heading || 'MY RMN'}</h3>
            <ul className="space-y-2.5">
              {col1.links.map((link: any) => (
                <li key={link.label} className="list-none">
                  <a href={link.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity no-underline"
                    style={{ color: '#ffffff' }}>
                    {link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          {config?.showContactInfo !== false && (
            <div>
              <h3 className="text-sm font-bold tracking-wide mb-4 uppercase">Contact Us</h3>
              <div className="space-y-2 text-sm opacity-90">
                {siteConfig?.footer?.email   && <p>Email: {siteConfig.footer.email}</p>}
                {siteConfig?.footer?.phone   && <p>Phone: {siteConfig.footer.phone}</p>}
                {siteConfig?.footer?.address && <p>{siteConfig.footer.address}</p>}
              </div>
            </div>
          )}
          {config?.showAppDownload !== false && (
            <div>
              <h3 className="text-sm font-bold tracking-wide mb-4 uppercase">Download the App</h3>
              <p className="text-sm opacity-90 mb-4">Get app-only offers and the best deals</p>
              <div className="flex flex-col gap-3">
                <a href="#" className="inline-flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2.5 hover:bg-gray-900 transition-colors w-fit">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                  <div className="text-left"><div className="text-[10px] leading-none">Download on the</div><div className="text-sm font-semibold leading-tight">App Store</div></div>
                </a>
                <a href="#" className="inline-flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2.5 hover:bg-gray-900 transition-colors w-fit">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                  <div className="text-left"><div className="text-[10px] leading-none">GET IT ON</div><div className="text-sm font-semibold leading-tight">Google Play</div></div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {siteConfig?.footer?.showSocialMedia && (
              <div className="flex items-center gap-5">
                {Object.entries(siteConfig.socialMedia || {}).map(([platform, data]: [string, any]) => {
                  if (!data.enabled || !data.url) return null;
                  return (
                    <a key={platform} href={data.url} className="hover:opacity-75 transition-opacity" target="_blank" rel="noopener noreferrer">
                      {getSocialIcon(data.icon)}
                    </a>
                  );
                })}
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {bottomLinks.map((link: any) => (
                <a key={link.label} href={link.href} className="text-xs no-underline opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap"
                  style={{ color: '#ffffff' }}>
                  {link.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: secondary }}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className="text-[11px] opacity-80 text-center leading-relaxed">
            {siteConfig?.footer?.copyright || '© 2026 CouponsFeast. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
