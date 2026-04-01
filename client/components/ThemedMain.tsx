'use client';
import { useTheme } from '@/components/ThemeProvider';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';

export default function ThemedMain({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { siteConfig } = useDynamicTheme();
  const isDark = theme === 'dark';

  return (
    <main className="min-h-screen pt-28 lg:pt-40">
      {children}
    </main>
  );
}
