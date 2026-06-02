'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useBanners } from '@/hooks/useApi';

export default function HeroCarousel() {
  const { banners, isLoading } = useBanners();
  const [current, setCurrent] = useState(0);

  const displayBanners = banners && banners.length > 0 ? banners : [];

  useEffect(() => {
    if (displayBanners.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  if (isLoading) {
    return (
      <div className="w-full h-[250px] md:h-[400px] bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  if (displayBanners.length === 0) {
    return null; // Don't show carousel if no banners in DB
  }

  return (
    <div className="relative w-full h-[250px] md:h-[400px] bg-background overflow-hidden">
      {displayBanners.map((slide: any, index: number) => (
        <div 
          key={slide._id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'} bg-primary-dark`}
        >
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image 
            src={slide.imageUrl} 
            alt={slide.title || 'Banner'}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
          <div className="relative z-20 h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 drop-shadow-lg">{slide.title}</h2>
            {slide.link && (
              <a href={slide.link} className="bg-accent hover:bg-accent-dark text-white px-6 py-2.5 rounded-md font-bold w-max transition-colors shadow-lg mt-4">
                Shop Now
              </a>
            )}
          </div>
        </div>
      ))}
      
      {/* Controls */}
      {displayBanners.length > 1 && (
        <>
          <button 
            onClick={() => setCurrent(prev => prev === 0 ? displayBanners.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-colors hidden md:block"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button 
            onClick={() => setCurrent(prev => prev === displayBanners.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-colors hidden md:block"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </>
      )}

      {/* Indicators */}
      {displayBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {displayBanners.map((_: any, idx: number) => (
            <button 
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === current ? 'bg-white w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
