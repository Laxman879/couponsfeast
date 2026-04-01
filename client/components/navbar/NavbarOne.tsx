'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MenuIcon, XIcon, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import StoresDropdown from '@/components/layout/StoresDropdown';

interface NavLink { name: string; url: string; hasDropdown?: boolean; }

interface NavbarOneProps {
  navLinks: NavLink[];
  config: any;
}

export default function NavbarOne({ navLinks, config }: NavbarOneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { siteConfig } = useDynamicTheme();

  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const siteName = siteConfig?.siteName || 'CouponsFeast';
  const logoUrl = siteConfig?.logos?.navbar;
  const showThemeToggle = config?.showThemeToggle ?? true;
  const ctaText = config?.ctaText || 'Get Started';
  const ctaLink = config?.ctaLink || '/';

  const navBg = isDark
    ? 'bg-gray-900/80 border-gray-700/70'
    : 'bg-white/50 border-gray-200/70';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-700';
  const hoverText = isDark ? 'hover:text-white' : 'hover:text-black';
  const dropdownBg = isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100';
  const dropdownHover = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const iconBg = isDark ? 'bg-gray-700' : 'bg-gray-800';
  const mobileBg = isDark ? 'bg-gray-900/95' : 'bg-white/20';
  const ctaBg = isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:opacity-90';

  return (
    <>
      <nav className={`sticky top-0 z-50 flex w-full items-center justify-between border-b ${navBg} px-4 py-3.5 backdrop-blur-md md:px-16 lg:px-24`}>
        {/* Logo */}
        <Link href="/">
          {logoUrl ? (
            <img src={logoUrl.startsWith('http') ? logoUrl : `http://localhost:5000${logoUrl}`} alt={siteName} className="h-8 w-auto" />
          ) : (
            <span className="font-extrabold text-xl tracking-tight" style={{ color: primary }}>{siteName}</span>
          )}
        </Link>

        {/* Desktop Links */}
        <div className={`hidden items-center space-x-6 md:flex ${textColor}`}>
          {navLinks.map((link) => link.hasDropdown ? (
            <div key={link.name} className="group relative"
              onMouseEnter={() => setOpenDropdown(link.name)}
              onMouseLeave={() => setTimeout(() => setOpenDropdown(null), 150)}
            >
              <div className={`flex cursor-pointer items-center gap-1 ${hoverText}`}
                onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}>
                {link.name}
                <ChevronDown className={`mt-px size-4 transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`} />
              </div>
              {openDropdown === link.name && <StoresDropdown onClose={() => setOpenDropdown(null)} />}
            </div>
          ) : (
            <Link key={link.name} href={link.url} className={`transition ${hoverText} no-underline ${textColor}`}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {showThemeToggle && (
            <button onClick={toggleTheme} className={`p-2 rounded-full transition ${hoverText} ${textColor}`}>
              {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
          )}
          <Link href={ctaLink} className={`hidden rounded-full px-6 py-2 text-sm font-medium transition md:inline-block ${ctaBg}`}>
            {ctaText}
          </Link>
          <button onClick={() => setIsOpen(true)} className={`transition active:scale-90 md:hidden ${textColor}`}>
            <MenuIcon className="size-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 text-lg font-medium backdrop-blur-2xl transition duration-300 md:hidden ${mobileBg} ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {navLinks.map((link) => (
          <div key={link.name} className="text-center">
            {link.hasDropdown ? (
              <>
                <button onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                  className={`flex items-center justify-center gap-1 ${textColor}`}>
                  {link.name}
                  <ChevronDown className={`size-4 transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === link.name && (
                  <div className="mt-2 flex flex-col gap-2 text-sm">
                    <Link href={link.url} className={`block ${textColor} transition ${hoverText} no-underline`} onClick={() => setIsOpen(false)}>
                      View All {link.name}
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <Link href={link.url} className={`block ${textColor} transition ${hoverText} no-underline`} onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            )}
          </div>
        ))}
        <Link href={ctaLink} className={`rounded-full px-8 py-2.5 text-sm font-medium transition ${ctaBg}`} onClick={() => setIsOpen(false)}>
          {ctaText}
        </Link>
        <button onClick={() => setIsOpen(false)} className="rounded-md bg-gray-900 p-2 text-white ring-white active:ring-2">
          <XIcon />
        </button>
      </div>
    </>
  );
}
