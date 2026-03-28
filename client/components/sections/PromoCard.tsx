'use client';
import { useState, useEffect } from 'react';
import { Play, X } from "lucide-react";
import { getSiteConfig } from '@/services/api';

const defaults = {
  title: 'Earn Up To $100 ExtraBucks At CVS',
  description: "Steal this influencer's top picks from her latest CVS beauty haul.",
  ctaText: 'Click To Watch Video',
  ctaLink: '#',
  image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=400&fit=crop',
  videoUrl: '',
  bgColor: '#2563eb',
  enabled: true,
};

function getEmbedUrl(url: string) {
  if (!url) return '';
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  return url;
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

export default function PromoCard() {
  const [data, setData] = useState(defaults);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getSiteConfig().then(res => {
      if (res.data?.promoCard) setData({ ...defaults, ...res.data.promoCard });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (modalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  if (!data.enabled) return null;

  const videoSrc = data.videoUrl || (data.ctaLink && data.ctaLink !== '#' ? data.ctaLink : '');

  const handlePlayClick = () => {
    if (videoSrc) setModalOpen(true);
  };

  return (
    <>
      <section className="mb-16 md:mb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row">
          <div className="relative md:w-[60%] min-h-[250px] sm:min-h-[350px] md:min-h-[400px]">
            <img
              src={data.image}
              alt={data.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <button
              onClick={handlePlayClick}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/80 hover:bg-white/95 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer hover:scale-110"
            >
              <Play className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-900 fill-gray-900 ml-1" />
            </button>
          </div>
          <div className="flex flex-col justify-center px-6 py-8 sm:px-10 md:px-12 lg:px-16 md:w-[40%]">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-3">{data.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-5 leading-relaxed">{data.description}</p>
            <a href={data.ctaLink} className="text-gray-900 dark:text-gray-100 font-extrabold text-sm sm:text-base tracking-wide underline underline-offset-4 decoration-2 hover:opacity-70 transition-opacity uppercase">{data.ctaText}</a>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {modalOpen && videoSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="relative w-[90vw] max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            {isDirectVideo(videoSrc) ? (
              <video src={videoSrc} autoPlay controls className="w-full h-full rounded-xl object-contain bg-black" />
            ) : (
              <iframe
                src={getEmbedUrl(videoSrc)}
                className="w-full h-full rounded-xl"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
