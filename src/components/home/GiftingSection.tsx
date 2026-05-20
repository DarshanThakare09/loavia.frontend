"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gift, CalendarHeart, Cake, Briefcase } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function GiftingSection() {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={containerRef} className="py-24 bg-brand-light relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FADCD9] rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4E6B5] rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="gifting-element inline-flex items-center justify-center p-4 bg-brand-gold/10 text-brand-gold rounded-full mb-6">
          <Gift className="w-8 h-8" />
        </div>
        
        <h2 className="gifting-element text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-6">
          Say it with <span className="text-brand-gold">Cookies</span>
        </h2>
        
        <p className="gifting-element text-lg text-brand-text-secondary max-w-2xl mx-auto mb-12">
          The perfect gift for any occasion. Send a luxurious box of our premium cookies with a personalized message. Delivered fresh, right to their door.
        </p>

        <div className="gifting-element flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
          {occasions.map((occasion) => {
            const Icon = occasion.icon;
            return (
              <div key={occasion.label} className="flex flex-col items-center p-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-3 text-brand-brown">
                  <Icon className="w-8 h-8" />
                </div>
                <span className="font-bold text-brand-text-primary">{occasion.label}</span>
              </div>
            );
          })}
        </div>

        <div className="gifting-element">
          <Link 
            href="/gift" 
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-brand-brown rounded-full hover:bg-brand-gold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
          >
            Explore Gifting Options
          </Link>
        </div>
      </div>
    </section>
  );
}
