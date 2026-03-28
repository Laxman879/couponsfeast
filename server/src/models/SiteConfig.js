import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema({
  siteName: { type: String, default: "CouponsFeast" },
  siteDescription: { type: String, default: "Find the best deals, coupons, and discounts from top brands. Save money on your favorite products with CouponsFeast." },
  contactEmail: { type: String, default: "support@couponsfeast.com" },
  themeName: { type: String, default: "purple" },
  
  // SEO & Meta Tags
  seo: {
    metaTitle: { type: String, default: "CouponsFeast - Best Deals & Coupons" },
    metaDescription: { type: String, default: "Find the best deals, coupons, and discounts from top brands. Save money on your favorite products with CouponsFeast." },
    metaKeywords: [{ type: String }],
    favicon: { type: String, default: "/favicon.ico" },
    ogTitle: { type: String, default: "CouponsFeast - Best Deals & Coupons" },
    ogDescription: { type: String, default: "Find the best deals, coupons, and discounts from top brands." },
    ogImage: { type: String, default: "/og-image.jpg" },
    twitterCard: { type: String, default: "summary_large_image" },
    twitterSite: { type: String, default: "@couponsfeast" }
  },
  
  // Theme & Colors
  theme: {
    primaryColor: { type: String, default: "#7c3aed" },
    secondaryColor: { type: String, default: "#9333ea" },
    backgroundColor: { type: String, default: "#ffffff" },
    textColor: { type: String, default: "#111827" },
    accentColor: { type: String, default: "#f59e0b" },
    successColor: { type: String, default: "#10b981" },
    errorColor: { type: String, default: "#ef4444" },
    warningColor: { type: String, default: "#f59e0b" }
  },
  
  // Typography
  fonts: {
    heading: { type: String, default: "Inter" },
    body: { type: String, default: "Roboto" },
    mono: { type: String, default: "Fira Code" }
  },
  
  // Logos
  logos: {
    navbar: { type: String, default: "/uploads/navbar-logo.png" },
    footer: { type: String, default: "/uploads/footer-logo.png" },
    favicon: { type: String, default: "/uploads/favicon.ico" },
    ogImage: { type: String, default: "/uploads/og-image.jpg" }
  },
  
  // Social Media
  socialMedia: {
    facebook: {
      label: { type: String, default: "Facebook" },
      url: { type: String, default: "https://facebook.com/couponsfeast" },
      icon: { type: String, default: "facebook" },
      enabled: { type: Boolean, default: true }
    },
    twitter: {
      label: { type: String, default: "Twitter" },
      url: { type: String, default: "https://twitter.com/couponsfeast" },
      icon: { type: String, default: "twitter" },
      enabled: { type: Boolean, default: true }
    },
    instagram: {
      label: { type: String, default: "Instagram" },
      url: { type: String, default: "https://instagram.com/couponsfeast" },
      icon: { type: String, default: "instagram" },
      enabled: { type: Boolean, default: true }
    },
    linkedin: {
      label: { type: String, default: "LinkedIn" },
      url: { type: String, default: "https://linkedin.com/company/couponsfeast" },
      icon: { type: String, default: "linkedin" },
      enabled: { type: Boolean, default: false }
    },
    youtube: {
      label: { type: String, default: "YouTube" },
      url: { type: String, default: "https://youtube.com/couponsfeast" },
      icon: { type: String, default: "youtube" },
      enabled: { type: Boolean, default: false }
    },
    tiktok: {
      label: { type: String, default: "TikTok" },
      url: { type: String, default: "https://tiktok.com/@couponsfeast" },
      icon: { type: String, default: "tiktok" },
      enabled: { type: Boolean, default: false }
    }
  },
  
  // Navbar Configuration
  navbar: {
    layout: { type: String, default: 'navbar2' },
    style: { type: String, default: 'solid' },
    bgColor: { type: String, default: '' },
    textColor: { type: String, default: '' },
    showSearch: { type: Boolean, default: true },
    showThemeToggle: { type: Boolean, default: true },
    sticky: { type: Boolean, default: true },
    ctaText: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
    bannerText: { type: String, default: '' },
    bannerHighlight: { type: String, default: '' },
    showBanner: { type: Boolean, default: true }
  },

  // Footer Configuration
  footer: {
    copyright: { type: String, default: "© CouponsFeast 2026" },
    email: { type: String, default: "support@couponsfeast.com" },
    phone: { type: String, default: "+1 (555) 123-4567" },
    address: { type: String, default: "123 Coupon Street, Deal City, DC 12345" },
    showSocialMedia: { type: Boolean, default: true },
    showNewsletter: { type: Boolean, default: true }
  },

  // Footer Config (style/customization)
  footerConfig: {
    layout: { type: String, default: 'footer1' },
    style: { type: String, default: 'standard' },
    bgColor: { type: String, default: '' },
    textColor: { type: String, default: '' },
    showAppDownload: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: true }
  },

  // Footer Content (editable columns per layout)
  footerContent: {
    tagline: { type: String, default: 'Find the best deals, coupons, and discounts from top brands.' },
    columns: [{
      heading: { type: String },
      links: [{ label: { type: String }, href: { type: String } }]
    }]
  },

  // Promo Card (homepage video/promo section)
  promoCard: {
    title: { type: String, default: 'Earn Up To $100 ExtraBucks At CVS' },
    description: { type: String, default: "Steal this influencer's top picks from her latest CVS beauty haul." },
    ctaText: { type: String, default: 'Click To Watch Video' },
    ctaLink: { type: String, default: '#' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=400&fit=crop' },
    videoUrl: { type: String, default: '' },
    bgColor: { type: String, default: '#2563eb' },
    enabled: { type: Boolean, default: true }
  },

  // Global FAQs
  faqs: {
    heading: { type: String, default: 'Frequently Asked Questions' },
    items: { type: [{ question: String, answer: String }], default: [] }
  }
}, { timestamps: true });

export const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);