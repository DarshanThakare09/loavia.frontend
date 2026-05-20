"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PackageOpen } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function BuildBoxHighlight() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      }
    });

    tl.fromTo(
      ".box-image",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
    ).fromTo(
      ".box-content > *",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" },
      "-=0.5"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-brand-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-brown rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-light rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="box-image relative h-64 sm:h-80 lg:h-auto order-2 lg:order-1">
              <Image
                src="/cookie_gift_box.png"
                alt="Custom Cookie Box"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="box-content p-8 sm:p-12 lg:p-16 flex flex-col justify-center order-1 lg:order-2 relative z-10 text-brand-cream">
              <div className="inline-flex items-center space-x-2 bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-full w-max mb-6">
                <PackageOpen className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide uppercase">Customization</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
                Build Your Own <br className="hidden sm:block" />
                <span className="text-brand-gold">Perfect Box</span>
              </h2>
              
              <p className="text-brand-cream/80 text-lg mb-8 max-w-md">
                Mix and match your favorite flavors. Choose a 6-pack, 12-pack, or our grand 24-pack. Treat yourself or surprise someone special.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/build-box" 
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-brand-brown bg-brand-gold rounded-full hover:bg-white transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
                >
                  Start Building
                </Link>
                <Link 
                  href="/shop" 
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
