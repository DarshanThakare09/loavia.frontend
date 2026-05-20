"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Verified Buyer",
      content: "These are genuinely the best cookies I've ever had. The Double Dark Chocolate is incredibly rich, and the packaging makes it feel so premium. Worth every penny!",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Verified Buyer",
      content: "I sent the 12-pack custom box to my team for the holidays. They arrived fresh and everyone loved them. The UI for building the box was super easy to use.",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Roberts",
      role: "Verified Buyer",
      content: "I'm obsessed with the healthy alternatives. They actually taste like real, indulgent cookies without the guilt. LOAVIA has a customer for life.",
      rating: 5
    }
  ];

  // Auto-advance testimonials
  useEffect(() => {
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

  return (
    <section ref={containerRef} className="py-24 bg-brand-brown text-brand-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center testimonial-container">
        
        <Quote className="w-16 h-16 mx-auto text-brand-gold opacity-50 mb-8" />
        
        <h2 className="text-3xl font-serif font-bold text-brand-gold mb-12">
          What Cookie Lovers Say
        </h2>

        <div className="relative min-h-[250px] flex items-center justify-center">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`absolute transition-all duration-700 w-full ${
                index === activeIndex 
                  ? "opacity-100 translate-x-0 scale-100 z-10" 
                  : "opacity-0 translate-x-10 scale-95 z-0 pointer-events-none"
              }`}
            >
              <div className="flex justify-center space-x-1 mb-6 text-brand-gold">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-current" />
                ))}
              </div>
              
              <p className="text-2xl md:text-3xl font-serif font-medium leading-relaxed mb-8 max-w-3xl mx-auto">
                "{testimonial.content}"
              </p>
              
              <div>
                <p className="font-bold text-xl">{testimonial.name}</p>
                <p className="text-brand-cream/60 mt-1">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-brand-gold w-8" : "bg-brand-cream/30 hover:bg-brand-cream/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}
