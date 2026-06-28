"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gift, CalendarHeart, Cake, Briefcase } from "lucide-react";
import { useSiteStore } from "@/store/siteStore";

gsap.registerPlugin(ScrollTrigger);

export function GiftingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { giftingTitle, giftingDescription, giftingEnabled } = useSiteStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted && !giftingEnabled) {
    return null;
  }

  const occasions = [
    { icon: Cake, label: "Birthdays" },
    { icon: CalendarHeart, label: "Anniversaries" },
    { icon: Briefcase, label: "Corporate" },
    { icon: Gift, label: "Just Because" },
  ];

  useGSAP(() => {
    gsap.fromTo(
      ".gifting-element",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  const titleText = giftingTitle || "Healthy Gifting Made Delicious";
  const words = titleText.trim().split(/\s+/);
  let part1 = "Healthy Gifting";
  let part2 = "Made Delicious";
  if (words.length > 2) {
    part1 = words.slice(0, 2).join(" ");
    part2 = words.slice(2).join(" ");
  } else if (words.length > 1) {
    part1 = words[0];
    part2 = words.slice(1).join(" ");
  }

  const descriptionText = giftingDescription || "Share the joy of guilt-free indulgence with our premium gift boxes. Perfectly packed, thoughtfully curated, and filled with wholesome goodness for any special occasion.";

  return (
    <section ref={containerRef} className="py-24 bg-brand-light relative overflow-hidden">
      
      {/* Background Image on the right (slightly wider to allow smooth blending) */}
      <div className="absolute top-0 right-0 h-full w-full lg:w-[60%] xl:w-[55%] z-0">
        <img
          src="/giftingbg.jpg?v=1"
          alt="Gifting Box"
          className="w-full h-full object-cover object-right"
        />
      </div>

      {/* Off-white gradient overlay: solid from left to middle (50%), then fading transparent to the right corner */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-light via-brand-light/92 to-transparent lg:bg-gradient-to-r lg:from-brand-light lg:via-brand-light lg:to-transparent z-10 pointer-events-none" />

      {/* Decorative background elements (soft glow behind text) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FADCD9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 z-0"></div>

      <style>{`
        .gifting-glass-card {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(92, 51, 23, 0.08);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gifting-glass-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0) 30%,
            rgba(160, 119, 42, 0.2) 70%,
            transparent 100%
          );
          transform: skewX(-25deg);
          pointer-events: none;
        }
        .gifting-glass-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 40px rgba(92, 51, 23, 0.1);
          border-color: rgba(160, 119, 42, 0.3);
        }
        .gifting-glass-card:hover::after {
          left: 150%;
          transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text content */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <div className="gifting-element inline-flex items-center justify-center w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-full mb-6 border border-brand-gold/20">
              <Gift className="w-5 h-5" />
            </div>
            
            <h2 
              style={{ fontFamily: "'Amsterdam Signature', serif" }}
              className="gifting-element font-normal leading-none mb-6 pt-2 pb-2 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2"
            >
              <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">{part1}</span>
              <span className="text-brand-brown text-7xl md:text-8xl lg:text-[8rem]">{part2}</span>
            </h2>
            
            <p className="gifting-element font-sans text-brand-text-secondary text-sm md:text-base lg:text-lg mb-10 leading-relaxed max-w-xl font-light">
              {descriptionText}
            </p>

            {/* Occasions cards */}
            <div className="gifting-element grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {occasions.map((occasion) => {
                const Icon = occasion.icon;
                return (
                  <div 
                    key={occasion.label} 
                    className="gifting-glass-card rounded-[2rem] p-5 flex flex-col items-center justify-center text-center cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-brand-gold group-hover:text-white group-hover:scale-110 border border-brand-gold/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-sans font-bold text-brand-brown group-hover:text-brand-gold transition-colors duration-300 text-xs sm:text-sm">
                      {occasion.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="gifting-element">
              <Link 
                href="/gift" 
                className="inline-flex items-center justify-center px-10 py-4.5 text-base font-semibold text-white bg-brand-brown rounded-full hover:bg-brand-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Explore Gifting Options
              </Link>
              
              <h4 className="text-xs text-brand-text-secondary mt-5 font-light tracking-wide max-w-md">
                Customized packaging and bulk gifting solutions are available for events and corporate gifts.
              </h4>
            </div>
          </div>

          {/* Right Column: Empty spacer to let background show on desktop */}
          <div className="lg:col-span-5 hidden lg:block" />

        </div>
      </div>
    </section>
  );
}
