'use client';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

interface FAQItem {
  question: string;
  answer?: string;
}

interface FAQSectionProps {
  heading?: string;
  items?: FAQItem[];
  primaryColor?: string;
  storeName?: string;
  pageType?: 'home' | 'store' | 'stores' | 'category';
}

const DEFAULT_FAQS: Record<string, FAQItem[]> = {
  home: [
    { question: 'How does CouponsFeast work?', answer: 'We collect and verify the best coupons, promo codes, and deals from thousands of stores. Simply browse, click to reveal a code, and paste it at checkout to save money instantly.' },
    { question: 'Are the coupons on CouponsFeast free to use?', answer: 'Yes, all coupons and promo codes on CouponsFeast are completely free. We never charge users for accessing deals or discount codes.' },
    { question: 'How often are new coupons added?', answer: 'We update our coupon database daily. New deals, promo codes, and offers are added as soon as they become available from our partner stores.' },
    { question: 'How do I use a coupon code?', answer: 'Click "Reveal Code" on any coupon, copy the code, then visit the store website. Add items to your cart and paste the code in the promo code field at checkout.' },
    { question: 'What types of deals are available?', answer: 'We offer coupon codes, percentage-off deals, cashback offers, free shipping promotions, buy-one-get-one deals, and exclusive sale alerts across all categories.' },
  ],
  store: [
    { question: 'Are there {storeName} coupons or promo codes available today?', answer: 'Yes! We currently have active {storeName} coupons and promo codes listed above. Check back daily as we update offers frequently to ensure you always get the best {storeName} deals.' },
    { question: 'How do I use a {storeName} coupon code?', answer: 'Click the "Reveal Code" button next to the offer you want. Copy the code, then visit {storeName} and add items to your cart. At checkout, paste the code in the promo or discount code field and the discount will be applied.' },
    { question: 'Do {storeName} coupons expire?', answer: 'Yes, most {storeName} coupons have an expiration date. We display the expiry date on each coupon when available. We recommend using coupons as soon as possible to avoid missing out.' },
    { question: 'Can I use multiple {storeName} coupon codes on one order?', answer: 'Typically, {storeName} allows only one coupon code per order. However, you can often combine a coupon code with ongoing sale prices or cashback offers for extra savings.' },
    { question: 'Does {storeName} offer free shipping?', answer: 'Check the deals listed above for any active free shipping offers from {storeName}. Free shipping promotions are updated regularly and may require a minimum order amount.' },
    { question: 'How much can I save with {storeName} coupons?', answer: 'Savings vary by offer. {storeName} discounts typically range from 10% to 50% off, plus occasional cashback deals. Check the coupon list above for the current best discount available.' },
    { question: 'Are these {storeName} coupons verified and working?', answer: 'Yes, our team regularly verifies all {storeName} coupons. Each offer is tested and updated to ensure it works. If a code does not work, please try another one from the list.' },
    { question: 'Does {storeName} offer cashback or rewards?', answer: 'Some {storeName} offers include cashback or reward points. Look for coupons labeled "Cash Back" in the list above. Cashback amounts and terms vary by offer.' },
    { question: 'How often are new {storeName} coupons added?', answer: 'We update {storeName} coupons daily. New promo codes, sales, and deals are added as soon as they become available. Bookmark this page and check back regularly for the latest offers.' },
    { question: 'What should I do if a {storeName} coupon code does not work?', answer: 'First, check if the coupon has expired or has specific terms (minimum order, specific products). Try another code from our list. If issues persist, the offer may have been recently discontinued by {storeName}.' },
  ],
  stores: [
    { question: 'How many stores are listed on CouponsFeast?', answer: 'We feature coupons and deals from thousands of popular online stores across all categories including fashion, electronics, food, travel, beauty, and more.' },
    { question: 'How do I find coupons for a specific store?', answer: 'Use the search bar at the top of this page to find any store by name. You can also filter stores by category to narrow down your search.' },
    { question: 'Are all listed stores verified?', answer: 'Yes, every store on our platform is verified. We only list legitimate retailers and regularly check that their coupons and deals are active and working.' },
    { question: 'Can I request a store to be added?', answer: 'We are constantly adding new stores. If your favorite store is not listed, check back soon as we update our store directory regularly with new retailers.' },
    { question: 'Do all stores offer coupon codes?', answer: 'Not all stores offer coupon codes. Some stores provide deals through automatic discounts, cashback offers, or sale events. We list all types of savings available for each store.' },
    { question: 'How do I know which store has the best deals?', answer: 'Each store page shows the number of active coupons and the best available discount. Stores with more offers and higher discounts are great places to start saving.' },
    { question: 'Are the store coupons free to use?', answer: 'Yes, all coupons and deals listed for every store are completely free. We never charge for accessing or using any discount code on our platform.' },
    { question: 'Can I browse stores by category?', answer: 'Yes! Use the category filter buttons above the store grid to browse stores by category such as Fashion, Electronics, Food, Beauty, Travel, and more.' },
    { question: 'How often are new stores added?', answer: 'We add new stores weekly. Our team continuously partners with popular retailers to bring you the widest selection of coupons and deals available online.' },
    { question: 'Do stores offer exclusive deals through CouponsFeast?', answer: 'Yes, many stores provide exclusive coupon codes and deals only available through our platform. Look for coupons marked "Exclusive" for the best savings.' },
  ],
  category: [
    { question: 'What categories of coupons are available?', answer: 'We offer coupons across all major categories including Fashion, Electronics, Food & Dining, Travel, Beauty, Home & Garden, Health, Sports, Baby & Kids, and many more.' },
    { question: 'How do I find coupons in a specific category?', answer: 'Browse the category cards on this page and click on any category to see all available coupons and deals. You can also use the search bar to find categories by name.' },
    { question: 'Which category has the most deals?', answer: 'Deal availability varies, but Fashion, Electronics, and Food & Dining typically have the highest number of active coupons. Each category card shows the current deal count.' },
    { question: 'Are category coupons updated regularly?', answer: 'Yes, coupons in every category are updated daily. We continuously add new deals and remove expired ones to ensure you always see active, working offers.' },
    { question: 'Can I use coupons from different categories in one order?', answer: 'That depends on the store. If a store sells products across multiple categories, you can usually apply one coupon code to your entire order regardless of product categories.' },
    { question: 'Do all categories have coupon codes?', answer: 'Most categories have coupon codes available. Some categories may primarily feature sale deals, cashback offers, or automatic discounts instead of traditional coupon codes.' },
    { question: 'How do cashback deals work in each category?', answer: 'Cashback deals give you a percentage of your purchase back. Click the cashback offer, shop through the link provided, and earn cash back on qualifying purchases in that category.' },
    { question: 'Are there seasonal deals by category?', answer: 'Yes! Categories like Fashion have seasonal sales, Electronics peak during Black Friday, and Travel deals are best during off-peak seasons. We highlight seasonal offers as they become available.' },
    { question: 'Can I get alerts for new deals in a category?', answer: 'Bookmark your favorite category page and check back regularly. We update deals daily so you will always find fresh coupons and offers in every category.' },
    { question: 'What is the best way to maximize savings by category?', answer: 'Compare multiple coupons within a category, stack coupon codes with sale prices when possible, and check for cashback offers. Combining these strategies can significantly increase your total savings.' },
  ],
};

export default function FAQSection({ heading = 'Frequently Asked Questions', items = [], primaryColor, storeName, pageType = 'store' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const headingColor = isDark ? darkPalette.text : '#111827';
  const questionColor = isDark ? darkPalette.text : '#1f2937';
  const answerColor = isDark ? `${darkPalette.text}cc` : '#4b5563';
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const iconColor = '#9ca3af';
  const iconHover = isDark ? darkPalette.text : '#374151';

  const replaceName = (text: string) => storeName ? text.replace(/\{storeName\}/g, storeName) : text.replace(/\{storeName\}\s?/g, '');

  const fallback = DEFAULT_FAQS[pageType] || DEFAULT_FAQS.store;
  const validItems = items.filter(faq => faq.question?.trim());
  const displayItems = (validItems.length ? validItems : fallback).map(faq => ({
    question: replaceName(faq.question),
    answer: faq.answer ? replaceName(faq.answer) : undefined
  }));

  if (displayItems.length === 0) return null;

  return (
    <div className="py-10 border-t" style={{ borderColor }}>
      <h2 className="text-3xl font-bold mb-8" style={{ color: headingColor }}>{replaceName(heading)}</h2>
      <div>
        {displayItems.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} style={{ borderBottom: `1px solid ${borderColor}` }}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between py-4 text-left group bg-transparent border-none outline-none cursor-pointer"
              >
                <span className="text-base font-medium pr-4" style={{ color: questionColor }}>{faq.question}</span>
                <span
                  className="flex-shrink-0 transition-colors"
                  style={{ color: iconColor }}
                  onMouseEnter={e => (e.currentTarget.style.color = iconHover)}
                  onMouseLeave={e => (e.currentTarget.style.color = iconColor)}
                >
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              {isOpen && faq.answer && (
                <p className="pb-4 text-[15px] leading-relaxed pr-8" style={{ color: answerColor }}>{faq.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
