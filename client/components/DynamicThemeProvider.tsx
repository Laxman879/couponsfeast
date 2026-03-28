'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getSiteConfig } from '@/services/api';

interface SiteTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

interface SiteFonts {
  heading: string;
  body: string;
}

interface SiteConfigData {
  siteName: string;
  theme: SiteTheme;
  fonts: SiteFonts;
  logo: string;
  logos?: { navbar?: string; footer?: string; favicon?: string; ogImage?: string };
  footer: { copyright: string; email: string; phone?: string; address?: string };
  navbar?: {
    layout?: string; style?: string; bgColor?: string; textColor?: string;
    showSearch?: boolean; showThemeToggle?: boolean; sticky?: boolean;
    ctaText?: string; ctaLink?: string;
    bannerText?: string; bannerHighlight?: string; showBanner?: boolean;
  };
  footerConfig?: {
    layout?: string; style?: string; bgColor?: string; textColor?: string;
    showAppDownload?: boolean; showContactInfo?: boolean;
  };
  socialMedia?: Record<string, { label: string; url: string; icon: string; enabled: boolean }>;
  footerContent?: {
    tagline?: string;
    columns?: Array<{ heading: string; links: Array<{ label: string; href: string }> }>;
  };
}

interface DynamicThemeContextType {
  siteConfig: SiteConfigData | null;
  loading: boolean;
  refreshConfig: () => void;
}

const DynamicThemeContext = createContext<DynamicThemeContextType>({
  siteConfig: null,
  loading: true,
  refreshConfig: () => {}
});

export const useDynamicTheme = () => useContext(DynamicThemeContext);

// Theme palette map — mirrors globals.css
const THEME_PALETTES: Record<string, { primary: string; secondary: string; bg: string; text: string }> = {
  purple: { primary: '#7c3aed', secondary: '#9333ea', bg: '#ffffff', text: '#111827' },
  blue:   { primary: '#2563eb', secondary: '#1d4ed8', bg: '#ffffff', text: '#111827' },
  green:  { primary: '#16a34a', secondary: '#15803d', bg: '#ffffff', text: '#111827' },
  orange: { primary: '#ea580c', secondary: '#c2410c', bg: '#ffffff', text: '#111827' },
  red:    { primary: '#dc2626', secondary: '#b91c1c', bg: '#ffffff', text: '#111827' },
  rose:   { primary: '#e11d48', secondary: '#be123c', bg: '#ffffff', text: '#111827' },
  teal:   { primary: '#0d9488', secondary: '#0f766e', bg: '#ffffff', text: '#111827' },
  dark:   { primary: '#8b5cf6', secondary: '#a78bfa', bg: '#111827', text: '#f9fafb' },
};

export default function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfigData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSiteConfig = async () => {
    try {
      const response = await getSiteConfig();
      setSiteConfig(response.data);
    } catch (error) {
      console.error('Error fetching site config:', error);
      // Fallback theme
      setSiteConfig({
        siteName: 'CouponsFeast',
        theme: {
          primaryColor: '#7c3aed',
          secondaryColor: '#9333ea',
          backgroundColor: '#ffffff',
          textColor: '#111827'
        },
        fonts: {
          heading: 'Inter',
          body: 'Roboto'
        },
        logo: '/uploads/logo.png',
        footer: {
          copyright: '© CouponsFeast 2026',
          email: 'support@couponsfeast.com'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteConfig();
    const interval = setInterval(fetchSiteConfig, 30000);
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cms-updated') fetchSiteConfig();
    };
    const handleCmsUpdated = () => fetchSiteConfig();
    const handleCmsPreview = (e: Event) => {
      const theme = (e as CustomEvent).detail;
      setSiteConfig(prev => prev ? { ...prev, theme: { ...prev.theme, ...theme } } : prev);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cms-updated', handleCmsUpdated);
    window.addEventListener('cms-preview', handleCmsPreview);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cms-updated', handleCmsUpdated);
      window.removeEventListener('cms-preview', handleCmsPreview);
    };
  }, []);

  // Create Material-UI theme based on backend config
  const themeName = (siteConfig as any)?.themeName || 'purple';
  const palette = THEME_PALETTES[themeName] || THEME_PALETTES.purple;
  const muiTheme = createTheme({
    palette: {
      primary:    { main: palette.primary },
      secondary:  { main: palette.secondary },
      background: { default: palette.bg },
      text:       { primary: palette.text },
    },
    typography: {
      fontFamily: siteConfig?.fonts?.body || 'Roboto',
      h1: { fontFamily: siteConfig?.fonts?.heading || 'Roboto' },
      h2: { fontFamily: siteConfig?.fonts?.heading || 'Roboto' },
      h3: { fontFamily: siteConfig?.fonts?.heading || 'Roboto' },
      h4: { fontFamily: siteConfig?.fonts?.heading || 'Roboto' },
      h5: { fontFamily: siteConfig?.fonts?.heading || 'Roboto' },
      h6: { fontFamily: siteConfig?.fonts?.heading || 'Roboto' },
    },
  });

  // Apply theme by setting data-theme on <html> — CSS variables handle the rest
  useEffect(() => {
    if (!siteConfig) return;
    const themeName = (siteConfig as any).themeName || 'purple';
    document.documentElement.setAttribute('data-theme', themeName);
    // fonts still need setProperty
    document.documentElement.style.setProperty('--heading-font', siteConfig.fonts?.heading || 'Roboto');
    document.documentElement.style.setProperty('--body-font',    siteConfig.fonts?.body    || 'Roboto');
  }, [siteConfig]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading theme...</div>
      </div>
    );
  }

  // Merge palette into siteConfig.theme so all consumers get correct colors
  const resolvedConfig = siteConfig ? {
    ...siteConfig,
    theme: {
      ...siteConfig.theme,
      primaryColor:   palette.primary,
      secondaryColor: palette.secondary,
      backgroundColor: palette.bg,
      textColor:      palette.text,
    }
  } : null;

  return (
    <DynamicThemeContext.Provider 
      value={{ 
        siteConfig: resolvedConfig, 
        loading, 
        refreshConfig: fetchSiteConfig 
      }}
    >
      <ThemeProvider theme={muiTheme}>
        <div 
          style={{
            backgroundColor: resolvedConfig?.theme?.backgroundColor || '#ffffff',
            color: resolvedConfig?.theme?.textColor || '#111827',
            fontFamily: siteConfig?.fonts?.body || 'Roboto',
            minHeight: '100vh'
          }}
        >
          {children}
        </div>
      </ThemeProvider>
    </DynamicThemeContext.Provider>
  );
}