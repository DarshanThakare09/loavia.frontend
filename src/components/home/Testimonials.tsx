"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote } from "lucide-react";
import { useSiteStore } from "@/store/siteStore";

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { testimonialsList } = useSiteStore();
  const testimonials = testimonialsList || [];

  // Auto-advance testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useGSAP(() => {
    gsap.fromTo(
      ".testimonial-container",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    );
  }, { scope: containerRef });

  const part1 = "What Cookie";
  const part2 = "Lovers Say";

  return (
    <section 
      ref={containerRef} 
      className="relative py-24 pb-56 md:pb-64 overflow-hidden bg-[#FDFBF7]"
      style={{
        backgroundImage: "url('/testimonialsbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="absolute inset-0 bg-white/10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center testimonial-container">
        
        {/* Quote Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-gold/10 text-brand-gold rounded-full mb-6 border border-brand-gold/20">
          <Quote className="w-6 h-6 fill-current" />
        </div>
        
        <h2 
          style={{ fontFamily: "'Amsterdam Signature', serif" }}
          className="font-normal leading-none mb-10 pt-2 pb-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-center sm:flex-wrap gap-x-4 gap-y-2 text-center"
        >
          <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">{part1}</span>
          <span className="text-brand-brown text-7xl md:text-8xl lg:text-[8rem]">{part2}</span>
        </h2>

        {/* Floating Glassmorphic Testimonial Card */}
        <div className="relative min-h-[300px] md:min-h-[240px] flex items-center justify-center bg-white/75 backdrop-blur-md border border-[#5C3317]/10 p-8 sm:p-10 rounded-[2.5rem] shadow-xl max-w-3xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`absolute transition-all duration-700 w-full left-0 right-0 px-6 sm:px-10 ${
                index === activeIndex 
                  ? "opacity-100 translate-x-0 scale-100 z-10" 
                  : "opacity-0 translate-x-10 scale-95 z-0 pointer-events-none"
              }`}
            >
              {/* Rating stars */}
              <div className="flex justify-center space-x-1 mb-5 text-brand-gold">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              
              <p className="text-lg md:text-xl font-sans font-light italic leading-relaxed text-brand-brown mb-6 max-w-2xl mx-auto">
                "{testimonial.content}"
              </p>
              
              <div>
                <p className="font-bold text-brand-brown text-lg">{testimonial.name}</p>
                <p className="text-brand-gold font-semibold uppercase tracking-wider text-[10px] mt-1">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-brand-gold w-8" : "bg-brand-brown/20 hover:bg-brand-brown/40"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}
