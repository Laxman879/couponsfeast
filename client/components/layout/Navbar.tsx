'use client';
import { useState, useEffect } from 'react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { getNavigation } from '@/services/api';
import NavbarOne from '@/components/navbar/NavbarOne';
import NavbarTwo from '@/components/navbar/NavbarTwo';
import NavbarThree from '@/components/navbar/NavbarThree';

interface NavLink { name: string; url: string; hasDropdown?: boolean; }

export default function Navbar() {
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { siteConfig } = useDynamicTheme();

  const navbarConfig = siteConfig?.navbar || {};
  const layout = navbarConfig.layout || 'navbar2';

  const fetchNavData = async () => {
    try {
      const res = await getNavigation();
      const menu = res.data?.menu || [];
      if (menu.length === 0) {
        setNavLinks([
          { name: 'Home', url: '/' },
          { name: 'Stores', url: '/stores', hasDropdown: true },
          { name: 'Categories', url: '/categories' },
        ]);
        return;
      }
      const links = menu.map((link: any) => ({
        ...link,
        url: link.url === '/home' ? '/' : link.url,
        hasDropdown: link.name.toLowerCase().includes('store'),
      }));
      setNavLinks(links);
    } catch {
      setNavLinks([
        { name: 'Home', url: '/' },
        { name: 'Stores', url: '/stores', hasDropdown: true },
        { name: 'Categories', url: '/categories' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavData();
    const interval = setInterval(fetchNavData, 30000);
    const onStorage = (e: StorageEvent) => { if (e.key === 'cms-updated') fetchNavData(); };
    const onCustom = () => fetchNavData();
    window.addEventListener('storage', onStorage);
    window.addEventListener('cms-updated', onCustom);
    return () => { clearInterval(interval); window.removeEventListener('storage', onStorage); window.removeEventListener('cms-updated', onCustom); };
  }, []);

  if (loading) return (
    <nav className="sticky top-0 z-50 h-16 bg-gray-100 animate-pulse" />
  );

  switch (layout) {
    case 'navbar1': return <NavbarOne navLinks={navLinks} config={navbarConfig} />;
    case 'navbar3': return <NavbarThree navLinks={navLinks} config={navbarConfig} />;
    case 'navbar2':
    default:        return <NavbarTwo navLinks={navLinks} config={navbarConfig} />;
  }
}
