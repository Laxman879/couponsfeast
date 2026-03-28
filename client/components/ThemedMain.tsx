'use client';
import { useTheme } from '@/components/ThemeProvider';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';

export default function ThemedMain({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { siteConfig } = useDynamicTheme();
  const isDark = theme === 'dark';
  const bg = isDark ? '#111827' : (siteConfig?.theme?.backgroundColor || '#ffffff');

  return (
    <main className="min-h-screen lg:pt-14" style={{ backgroundColor: bg }}>
      {children}
    </main>
  );
}
