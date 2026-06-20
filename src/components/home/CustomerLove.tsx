"use client";

import { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteStore } from "@/store/siteStore";

export default function CustomerLove() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { testimonialsList } = useSiteStore();
  
  const testimonials = testimonialsList && testimonialsList.length > 0
    ? testimonialsList
    : [
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

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 pb-72 md:pb-80 lg:pb-96 overflow-hidden bg-[#FDFBF7]"
      style={{
        backgroundImage: "url('/testimonialsbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat"
      }}
    >
      <style>{`
        .testimonial-deck {
          perspective: 1000px;
        }
        .testimonial-card {
          position: absolute;
          left: 50%;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          width: 90%;
          max-width: 600px;
        }
        .testimonial-card-active {
          transform: translateX(-50%) scale(1.05);
          opacity: 1;
          z-index: 30;
        }
        .testimonial-card-prev {
          transform: translateX(calc(-50% - 280px)) scale(0.9) rotateY(15deg);
          opacity: 0.4;
          z-index: 20;
          cursor: pointer;
        }
        .testimonial-card-next {
          transform: translateX(calc(-50% + 280px)) scale(0.9) rotateY(-15deg);
          opacity: 0.4;
          z-index: 20;
          cursor: pointer;
        }
        .testimonial-card-out {
          transform: translateX(-50%) scale(0.8);
          opacity: 0;
          z-index: 10;
          pointer-events: none;
        }
        @media (max-width: 1024px) {
          .testimonial-card-prev {
            transform: translateX(calc(-50% - 180px)) scale(0.9) rotateY(10deg);
          }
          .testimonial-card-next {
            transform: translateX(calc(-50% + 180px)) scale(0.9) rotateY(-10deg);
          }
        }
        @media (max-width: 768px) {
          .testimonial-card {
            max-width: 95%;
          }
          .testimonial-card-prev {
            transform: translateX(-150%) scale(0.8);
            opacity: 0;
            pointer-events: none;
          }
          .testimonial-card-next {
            transform: translateX(50%) scale(0.8);
            opacity: 0;
            pointer-events: none;
          }
          .testimonial-card-active {
            transform: translateX(-50%) scale(1);
          }
        }
      `}</style>

      <div className="absolute inset-0 bg-[#FDFBF7]/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2
            style={{ fontFamily: "'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-6 pt-4 pb-4 text-brand-brown text-5xl md:text-6xl lg:text-7xl text-center"
          >
            Customer Love
          </h2>
          <p className="font-sans text-brand-text-secondary max-w-2xl mx-auto text-sm md:text-base lg:text-lg font-light leading-relaxed">
            Loved by families, fitness enthusiasts, and mindful snackers across India.
          </p>
        </div>

        {/* Carousel Deck wrapper */}
        <div className="relative testimonial-deck w-full min-h-[380px] md:min-h-[320px] flex items-center justify-center overflow-visible">
          
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 md:left-2 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/70 backdrop-blur-sm border border-[#5C3317]/10 flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white transition-all duration-300 shadow-md z-40"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 md:right-2 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/70 backdrop-blur-sm border border-[#5C3317]/10 flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white transition-all duration-300 shadow-md z-40"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards */}
          <div className="w-full relative h-full flex items-center justify-center">
            {testimonials.map((testimonial, index) => {
              const total = testimonials.length;
              let cardClass = "testimonial-card-out";
              
              if (total === 1) {
                cardClass = "testimonial-card-active";
              } else {
                const diff = (index - activeIndex + total) % total;
                if (diff === 0) cardClass = "testimonial-card-active";
                else if (diff === 1 || (total === 2 && diff === 1)) cardClass = "testimonial-card-next";
                else if (diff === total - 1) cardClass = "testimonial-card-prev";
              }

              return (
                <div
                  key={testimonial.id}
                  onClick={() => {
                    if (cardClass === "testimonial-card-next") handleNext();
                    if (cardClass === "testimonial-card-prev") handlePrev();
                  }}
                  className={`testimonial-card ${cardClass} bg-white/70 backdrop-blur-md border border-white/50 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(92,51,23,0.15)] flex flex-col justify-between`}
                >
                  <div className="absolute top-6 left-6 text-brand-gold/15 text-8xl font-serif select-none pointer-events-none leading-none">
                    “
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* Stars */}
                    <div className="flex justify-center space-x-1 mb-6 text-brand-gold">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>

                    {/* Text content */}
                    <p className="text-brand-brown font-sans font-light italic leading-relaxed text-center text-base md:text-lg mb-8">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="text-center mt-auto">
                      <h4 className="font-bold text-brand-brown text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-brand-gold font-semibold uppercase tracking-wider text-[10px] mt-1">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-3 mt-12 relative z-30">
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