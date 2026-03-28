'use client';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import FooterOne   from '@/components/footer/FooterOne';
import FooterTwo   from '@/components/footer/FooterTwo';
import FooterThree from '@/components/footer/FooterThree';
import FooterFour  from '@/components/footer/FooterFour';

export default function Footer() {
  const { siteConfig } = useDynamicTheme();
  const footerConfig = siteConfig?.footerConfig || {};
  const layout = footerConfig.layout || 'footer1';

  switch (layout) {
    case 'footer2': return <FooterTwo   config={footerConfig} />;
    case 'footer3': return <FooterThree config={footerConfig} />;
    case 'footer4': return <FooterFour  config={footerConfig} />;
    case 'footer1':
    default:        return <FooterOne   config={footerConfig} />;
  }
}
