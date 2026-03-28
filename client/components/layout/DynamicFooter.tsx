'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFooter } from '@/services/api';

export default function DynamicFooter() {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await getFooter();
        setFooterData(response.data);
      } catch (error) {
        console.error('Error fetching footer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, []);

  if (loading) {
    return (
      <footer className="bg-purple-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          Loading...
        </div>
      </footer>
    );
  }

  if (!footerData) return null;

  const linkSections = footerData.sections?.filter(section => 
    section.type === 'links' && section.isVisible
  ).sort((a, b) => a.order - b.order) || [];

  const socialSection = footerData.sections?.find(section => 
    section.type === 'social' && section.isVisible
  );

  return (
    <footer className="bg-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">CouponsFeast</h2>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {linkSections.map((section) => (
            <div key={section._id} className="space-y-4">
              <h3 className="text-lg font-semibold uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links
                  ?.sort((a, b) => a.order - b.order)
                  .map((link) => (
                    <li key={link._id}>
                      {link.isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/80 hover:text-white transition-colors text-sm"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-white/80 hover:text-white transition-colors text-sm"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {/* Social Media Section */}
          {socialSection && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold uppercase tracking-wide">
                {socialSection.title}
              </h3>
              <div className="flex flex-wrap gap-4">
                {socialSection.links
                  ?.sort((a, b) => a.order - b.order)
                  .map((link) => (
                    <a
                      key={link._id}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/60 text-sm">
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}