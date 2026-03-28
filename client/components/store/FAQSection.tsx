'use client';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer?: string;
}

interface FAQSectionProps {
  heading?: string;
  items?: FAQItem[];
  primaryColor?: string;
}

export default function FAQSection({ heading = 'Frequently Asked Questions', items = [], primaryColor = '#7c3aed' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const displayItems = items.length ? items : [
    { question: 'Are there deals available today?', answer: 'Yes! We regularly update our deals. Check the coupons listed above for the latest active offers.' },
    { question: 'How do I use a promo code?', answer: 'Copy the code, add items to your cart, and paste it in the discount or promo code field at checkout.' },
    { question: 'Do coupons expire?', answer: 'Yes, most coupons have an expiry date. Always check the expiration before using a code.' },
    { question: 'Can I stack multiple coupon codes?', answer: 'Most stores only allow one coupon code per order. Check the terms of each offer for details.' },
    { question: 'Is there a free shipping offer available?', answer: 'Check the deals listed above — we list any active free shipping offers as soon as they become available.' },
  ];

  return (
    <div className="py-10 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{heading}</h2>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {displayItems.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between py-4 text-left group"
              >
                <span className="text-base font-medium text-gray-900 dark:text-gray-100 pr-4">{faq.question}</span>
                {isOpen
                  ? <Minus className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                  : <Plus className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                }
              </button>
              {isOpen && faq.answer && (
                <p className="pb-4 text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed pr-8">{faq.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
