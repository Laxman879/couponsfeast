'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import StoresDropdown from '@/components/layout/StoresDropdown';

interface NavLink { name: string; url: string; hasDropdown?: boolean; }

interface NavbarThreeProps {
  navLinks: NavLink[];
  config: any;
}

export default function NavbarThree({ navLinks, config }: NavbarThreeProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [storesDropdownOpen, setStoresDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { siteConfig, darkPalette } = useDynamicTheme();

  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const secondary = siteConfig?.theme?.secondaryColor || '#9333ea';
  const accent = (siteConfig?.theme as any)?.accentColor || '#f59e0b';
  const siteName = siteConfig?.siteName || 'CouponsFeast';
  const logoUrl = siteConfig?.logos?.navbar;
  const showThemeToggle = config?.showThemeToggle ?? true;
  const ctaText = config?.ctaText || 'Get Started';
  const ctaLink = config?.ctaLink || '/';
  const bannerText = config?.bannerText || 'Exclusive Price Drop! Hurry,';
  const bannerHighlight = config?.bannerHighlight || 'Offer Ends Soon!';
  const showBanner = config?.showBanner ?? true;

  const navBg = isDark ? darkPalette.cardBg : '#faf8ff';
  const navText = isDark ? darkPalette.text : '#111827';
  const navBorder = isDark ? darkPalette.cardBg : '#e5e7eb';
  const linkHover = isDark ? 'hover:text-gray-300' : 'hover:text-gray-500';
  const mobileBg = isDark ? darkPalette.bg : '#faf8ff';
  const ctaBg = isDark ? 'transparent' : '#faf8ff';
  const ctaBorder = isDark ? 'rgba(255,255,255,0.3)' : '#d1d5db';

  return (
    <div className="text-sm w-full">
      {/* Announcement Banner */}
      {showBanner && (
        <div
          className="text-center font-medium py-2 text-white"
          style={{ background: `linear-gradient(to right, ${primary}, ${secondary}, ${accent})` }}
        >
          <p>
            {bannerText}{' '}
            <span className="underline underline-offset-2">{bannerHighlight}</span>
          </p>
        </div>
      )}

      {/* Main Nav */}
      <nav
        className="relative h-[70px] flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 shadow transition-all"
        style={{ backgroundColor: navBg, color: navText, borderBottom: `1px solid ${navBorder}` }}
      >
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 no-underline">
          {logoUrl ? (
            <img src={logoUrl.startsWith('http') ? logoUrl : `http://localhost:5000${logoUrl}`} alt={siteName} className="h-8 w-auto" />
          ) : (
            <span className="font-extrabold text-xl tracking-tight" style={{ color: primary }}>
              {siteName}
            </span>
          )}
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center space-x-8 md:pl-16">
          {navLinks.map((link) => link.hasDropdown ? (
            <li key={link.name} className="list-none relative"
              onMouseEnter={() => setStoresDropdownOpen(true)}
              onMouseLeave={() => setTimeout(() => setStoresDropdownOpen(false), 150)}
            >
              <button
                className={`transition font-medium flex items-center gap-1 bg-transparent border-none outline-none cursor-pointer ${linkHover}`}
                style={{ color: navText }}
                onClick={() => setStoresDropdownOpen(!storesDropdownOpen)}
              >
                {link.name}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${storesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {storesDropdownOpen && <StoresDropdown onClose={() => setStoresDropdownOpen(false)} />}
            </li>
          ) : (
            <li key={link.name} className="list-none">
              <Link
                href={link.url}
                className={`transition no-underline font-medium ${linkHover}`}
                style={{ color: navText }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {showThemeToggle && (
            <button onClick={toggleTheme} className="p-1.5 transition" style={{ color: navText }}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          <Link
            href={ctaLink}
            className="hidden md:inline-block px-8 py-2 rounded-full text-sm font-medium transition active:scale-95 no-underline"
            style={{
              backgroundColor: ctaBg,
              color: navText,
              border: `1px solid ${ctaBorder}`,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : '#f9fafb')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = ctaBg)}
          >
            {ctaText}
          </Link>

          <button
            className="inline-block md:hidden transition active:scale-90"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: navText }}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="absolute top-[70px] left-0 w-full shadow-sm p-6 md:hidden z-50"
            style={{ backgroundColor: mobileBg, borderTop: `1px solid ${navBorder}` }}
          >
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.name} className="list-none">
                  <Link
                    href={link.url}
                    className={`text-sm font-medium transition no-underline ${linkHover}`}
                    style={{ color: navText }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={ctaLink}
              className="mt-6 inline-block text-sm px-8 py-2.5 rounded-full transition active:scale-95 no-underline"
              style={{ backgroundColor: ctaBg, color: navText, border: `1px solid ${ctaBorder}` }}
              onClick={() => setMobileOpen(false)}
            >
              {ctaText}
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
