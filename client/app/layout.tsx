'use client';
import { Provider } from 'react-redux';
import { store } from '@/store';
import CssBaseline from '@mui/material/CssBaseline';
import DynamicThemeProvider from '@/components/DynamicThemeProvider';
import { ThemeProvider as CustomThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';
import PublicLayout from '@/components/layout/PublicLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0d9488" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Coupon Feast",
              "url": "https://couponsfeast.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://couponsfeast.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body>
        <Provider store={store}>
          <CustomThemeProvider>
          <DynamicThemeProvider>
            <CssBaseline />
            <PublicLayout>{children}</PublicLayout>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { background: '#363636', color: '#fff' },
                success: { duration: 3000, iconTheme: { primary: '#4ade80', secondary: '#fff' } },
                error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                loading: { iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
              }}
            />
          </DynamicThemeProvider>
          </CustomThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
