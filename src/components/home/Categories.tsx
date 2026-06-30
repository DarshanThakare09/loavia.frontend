"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSiteStore } from "@/store/siteStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Categories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const { categoriesList } = useSiteStore();
  const categories = categoriesList || [];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  // Auto-scroll loop
  useEffect(() => {
    if (categories.length <= 1) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [categories.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion) {
      gsap.set(".cat-char, .category-deck", { opacity: 1, y: 0 });
      gsap.set(".cat-underline", { opacity: 1, y: 0, width: "60%" });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        once: true
      }
    });

    // Heading animation
    tl.fromTo(".cat-char",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: "power2.out" }
    )
      .fromTo(".cat-underline",
        { width: "0%" },
        { width: "60%", duration: 0.6, ease: "power2.inOut" },
        "+=0.1"
      )
      .fromTo(".category-deck",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  const handleCircleClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    const element = e.currentTarget;
    const tl = gsap.timeline();
    tl.to(element, { scale: 0.95, duration: 0.1 })
      .to(element, { scale: 1, duration: 0.1 })
      .to(containerRef.current, { opacity: 0, duration: 0.3 }, "+=0.1")
      .call(() => router.push(link));
  };

  return (
    <section ref={containerRef} id="category-section" className="relative py-24 md:py-28 bg-[#FDFBF7] overflow-hidden">
      <style>{`
        .category-bg-layer {
          background-image: url('/cookie-parallax-bg.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transform-origin: center;
        }
        @media (min-width: 1024px) {
          .category-bg-layer {
            background-attachment: fixed;
          }
        }
        
        .category-deck {
          perspective: 1000px;
        }
        .category-card {
          position: absolute;
          left: 50%;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          width: 90%;
          max-width: 320px;
        }
        .category-card-active {
          transform: translateX(-50%) scale(1.05);
          opacity: 1;
          z-index: 30;
        }
        .category-card-prev {
          transform: translateX(calc(-50% - 220px)) scale(0.9) rotateY(15deg);
          opacity: 0.4;
          z-index: 20;
          cursor: pointer;
        }
        .category-card-next {
          transform: translateX(calc(-50% + 220px)) scale(0.9) rotateY(-15deg);
          opacity: 0.4;
          z-index: 20;
          cursor: pointer;
        }
        .category-card-out {
          transform: translateX(-50%) scale(0.8);
          opacity: 0;
          z-index: 10;
          pointer-events: none;
        }
        @media (max-width: 1024px) {
          .category-card-prev {
            transform: translateX(calc(-50% - 150px)) scale(0.9) rotateY(10deg);
          }
          .category-card-next {
            transform: translateX(calc(-50% + 150px)) scale(0.9) rotateY(-10deg);
          }
        }
        @media (max-width: 768px) {
          .category-card {
            max-width: 95%;
          }
          .category-card-prev {
            transform: translateX(-150%) scale(0.8);
            opacity: 0;
            pointer-events: none;
          }
          .category-card-next {
            transform: translateX(50%) scale(0.8);
            opacity: 0;
            pointer-events: none;
          }
          .category-card-active {
            transform: translateX(-50%) scale(1);
          }
        }

        @keyframes floatAnim0 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes floatAnim1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes floatAnim2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes floatAnim3 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        .float-0 { animation: floatAnim0 3.2s ease-in-out infinite; }
        .float-1 { animation: floatAnim1 3.8s ease-in-out infinite; }
        .float-2 { animation: floatAnim2 3.5s ease-in-out infinite; }
        .float-3 { animation: floatAnim3 4.0s ease-in-out infinite; }
        .float-0:hover, .float-1:hover, .float-2:hover, .float-3:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="category-bg-layer absolute inset-[-8%] z-0 opacity-100"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-16 flex flex-col items-center">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            Freshly Curated
          </p>
          <h2
            style={{ fontFamily: "'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-center sm:flex-wrap gap-x-4 gap-y-2 text-center pt-4 pb-4"
          >
            <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem] inline-block">
              {"Shop by".split("").map((char, i) => (
                <span key={i} className="cat-char opacity-0 inline-block" style={{ minWidth: char === ' ' ? '0.5em' : 'auto' }}>
                  {char}
                </span>
              ))}
            </span>
            <span className="text-brand-brown text-7xl md:text-8xl lg:text-[8rem] inline-block">
              {"Category".split("").map((char, i) => (
                <span key={i + 10} className="cat-char opacity-0 inline-block" style={{ minWidth: char === ' ' ? '0.5em' : 'auto' }}>
                  {char}
                </span>
              ))}
            </span>
          </h2>
          <div className="cat-underline h-[2px] bg-brand-gold mt-3 mx-auto" style={{ width: prefersReducedMotion ? "60%" : "0%" }}></div>

          <p className="mt-5 max-w-2xl font-sans text-brand-text-secondary text-sm md:text-base lg:text-lg font-light leading-relaxed">
            Explore our carefully curated collections, each designed to delight your taste buds and satisfy your cravings.
          </p>
        </div>

        {/* Carousel Deck Wrapper */}
        <div className="relative category-deck w-full min-h-[440px] md:min-h-[400px] flex items-center justify-center overflow-visible">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 md:left-2 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/70 backdrop-blur-sm border border-[#5C3317]/10 flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white transition-all duration-300 shadow-md z-40 cursor-pointer"
            aria-label="Previous category"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 md:right-2 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/70 backdrop-blur-sm border border-[#5C3317]/10 flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white transition-all duration-300 shadow-md z-40 cursor-pointer"
            aria-label="Next category"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards */}
          <div className="w-full relative h-full flex items-center justify-center">
            {categories.map((category, index) => {
              const total = categories.length;
              let cardClass = "category-card-out";
              
              if (total === 1) {
                cardClass = "category-card-active";
              } else {
                const diff = (index - activeIndex + total) % total;
                if (diff === 0) cardClass = "category-card-active";
                else if (diff === 1 || (total === 2 && diff === 1)) cardClass = "category-card-next";
                else if (diff === total - 1) cardClass = "category-card-prev";
              }

              return (
                <div
                  key={category.name}
                  onClick={() => {
                    if (cardClass === "category-card-next") handleNext();
                    if (cardClass === "category-card-prev") handlePrev();
                  }}
                  className={`category-card ${cardClass}`}
                >
                  <div className={`float-${index} w-full h-full`}>
                    <a
                      href={category.link}
                      onClick={(e) => handleCircleClick(e, category.link)}
                      className="block relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-white shadow-md transition-all duration-500 group focus:outline-none focus:ring-4 focus:ring-brand-gold hover:shadow-2xl"
                      tabIndex={0}
                      aria-label={`Shop ${category.name}`}
                    >
                    <div className="category-img-container absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-110">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                        priority={false}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Subtle overlay gradient to blend background */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10" />
                    </div>

                    {/* Fading dark brown gradient shadow overlay from bottom to top */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-gradient-to-t from-[#5C3317]/95 via-[#5C3317]/40 to-transparent transition-all duration-500 group-hover:from-[#5C3317]/100 group-hover:via-[#5C3317]/55">
                      <h3 className="text-white font-sans font-bold text-xl sm:text-2xl text-left transition-colors duration-300 group-hover:text-brand-gold transform group-hover:-translate-y-1">
                        {category.name}
                      </h3>
                      <div className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-brand-gold/80 flex items-center justify-between transform group-hover:-translate-y-1 transition-transform duration-300">
                        <span>Shop Now</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            );
            })}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-3 mt-12 relative z-30">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeIndex ? "bg-brand-gold w-8" : "bg-brand-brown/20 hover:bg-brand-brown/40"
              }`}
              aria-label={`Go to category ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
