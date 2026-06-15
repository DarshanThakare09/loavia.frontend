"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useSiteStore } from "@/store/siteStore";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { heroTitle, heroSubtitle } = useSiteStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(".hero-title", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2 }
    )
    .fromTo(".hero-subtitle",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo(".hero-cta",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.4"
    )
    .fromTo(".hero-canvas",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
      0 // Start slightly earlier
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
      {/* Background GIF */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/baking-time-lapse.gif" 
          alt="Baking Time Lapse" 
          fill 
          className="object-cover" 
          priority 
          unoptimized 
        />
        {/* Light Theme Overlay */}
        <div className="absolute inset-0 bg-brand-cream/85"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 lg:py-0">
        
        {/* Text Content */}
        <div className="max-w-2xl pt-10 lg:pt-0">
          <h1 className="hero-title text-5xl md:text-7xl font-serif font-bold text-brand-brown leading-tight mb-6 whitespace-pre-wrap">
            {mounted ? heroTitle : "Healthy Inside,\nYummy Outside."}
          </h1>
          <p className="hero-subtitle text-lg md:text-xl text-brand-text-secondary mb-10 max-w-lg whitespace-pre-wrap">
            {mounted ? heroSubtitle : "Premium millet cookies and healthy bakery products crafted with wholesome ingredients, rich flavours, and freshly baked goodness."}
          </p>
         <div className="hero-cta flex gap-4 justify-center">
  <Link
    href="/shop"
    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-brand-cream bg-brand-brown rounded-full hover:bg-brand-gold transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
  >
    Shop Now
  </Link>

  <Link
    href="/whatsapp"
    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
  >
    Order on WhatsApp
  </Link>
</div>
        </div>


        {/* Presentation Image */}
        <div className="hero-canvas h-[50vh] lg:h-[80vh] w-full relative z-0 flex items-center justify-center drop-shadow-2xl">
          <div className="relative w-full h-[110%] lg:h-[112%] -mt-10 lg:-mt-20">
            <Image 
              src="/presenting-png.png" 
              alt="Presenting LOAVIA" 
              fill 
              className="object-contain" 
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
