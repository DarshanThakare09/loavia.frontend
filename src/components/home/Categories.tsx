"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cookie, Leaf, Sparkles, Heart, Tag, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSiteStore } from "@/store/siteStore";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  Cookie,
  Leaf,
  Sparkles,
  Heart,
  Tag
};

const getCategoryIcon = (name: string): LucideIcon => {
  const lowercase = name.toLowerCase();
  if (lowercase.includes("vegan")) return Leaf;
  if (lowercase.includes("diet") || lowercase.includes("oat") || lowercase.includes("health")) return Heart;
  if (lowercase.includes("classic") || lowercase.includes("millet")) return Cookie;
  if (lowercase.includes("gluten")) return Sparkles;
  return Tag;
};

const FloatingParticles = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <style>{`
      @keyframes catFloat {
        0% { transform: translateY(0px); opacity: 0.15; }
        50% { transform: translateY(-12px); opacity: 0.35; }
        100% { transform: translateY(0px); opacity: 0.15; }
      }
      .cat-particle {
        position: absolute;
        animation: catFloat ease-in-out infinite;
      }
    `}</style>
    <div className="cat-particle" style={{ top: '10%', left: '80%', width: '12px', height: '12px', border: '1px solid #A0772A', borderRadius: '50%', animationDuration: '4s' }} />
    <div className="cat-particle" style={{ top: '70%', left: '5%', width: '16px', height: '16px', backgroundColor: '#A0772A', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', animationDuration: '5.5s', animationDelay: '1.5s' }} />
    <div className="cat-particle" style={{ top: '30%', left: '90%', width: '8px', height: '8px', backgroundColor: '#5C3317', borderRadius: '50%', animationDuration: '3.5s', animationDelay: '0.5s' }} />
    <div className="cat-particle" style={{ top: '80%', left: '80%', width: '10px', height: '10px', border: '1px solid #5C3317', animationDuration: '6s', animationDelay: '2s' }} />
  </div>
);

export function Categories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { categoriesList } = useSiteStore();
  const categories = categoriesList || [];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion) {
      gsap.set(".cat-heading-word, .cat-subtitle, .cat-card-item", { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true
      }
    });

    tl.fromTo(".cat-heading-word", 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }
    )
    .fromTo(".cat-subtitle",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(".cat-card-item",
      { opacity: 0, y: 60, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.2)" },
      "-=0.4"
    );

  }, { scope: containerRef, dependencies: [prefersReducedMotion, categories] });

  return (
    <section 
      ref={containerRef} 
      id="category-section"
      className="py-24 relative overflow-hidden"
    >
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
      `}</style>
      <div className="category-bg-layer absolute inset-[-8%] z-0 opacity-100"></div>
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <FloatingParticles />

      <style>{`
        .cat-glass-card {
          position: relative;
          overflow: hidden;
          background-size: cover;
          background-position: center;
          border: none;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .cat-glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1) 40%, transparent);
          pointer-events: none;
          z-index: 1;
        }
        .cat-sheen-sweep {
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0) 30%,
            rgba(160, 119, 42, 0.25) 70%,
            transparent 100%
          );
          transform: skewX(-25deg);
          pointer-events: none;
          z-index: 2;
        }
        .cat-text-container {
          position: relative;
          z-index: 10;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 236, 215, 0.7) 100%);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(160, 119, 42, 0.35);
          border-top: 1px solid rgba(255, 255, 255, 0.6);
          border-left: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 1.25rem;
          padding: 0.875rem 1.25rem;
          margin: 0.75rem 1rem 1rem 1rem;
          text-align: center;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 
            0 2px 8px rgba(92, 51, 23, 0.08),
            0 8px 24px rgba(92, 51, 23, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }
        .cat-card-item:hover .cat-text-container {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 236, 215, 0.85) 100%);
          border-color: rgba(160, 119, 42, 0.5);
          border-top: 1px solid rgba(255, 255, 255, 0.8);
          border-left: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 4px 12px rgba(92, 51, 23, 0.12),
            0 12px 32px rgba(92, 51, 23, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
          transform: translateY(-2px);
        }
        .cat-card-item:hover .cat-sheen-sweep {
          left: 150%;
          transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cat-card-item:hover .cat-glass-card {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 30px 60px rgba(92, 51, 23, 0.2);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            Freshly Curated
          </p>
          <h2 
            style={{ fontFamily: "'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-center sm:flex-wrap gap-x-4 gap-y-2 text-center"
          >
            {"Shop by Category".split(" ").map((word, idx) => {
              const words = "Shop by Category".split(" ");
              const isLast = idx === words.length - 1;
              return (
                <span 
                  key={idx} 
                  className={`cat-heading-word opacity-0 inline-block ${
                    isLast 
                      ? "text-brand-brown text-7xl md:text-8xl lg:text-[8rem] relative" 
                      : "text-brand-gold text-2xl md:text-3xl lg:text-[3rem]"
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </h2>
          <p className="cat-subtitle opacity-0 font-sans text-brand-text-secondary max-w-2xl mx-auto text-sm md:text-base lg:text-lg font-light leading-relaxed">
            Explore our carefully curated collections, each designed to delight your taste buds and satisfy your cravings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((cat, index) => {
            const Icon = getCategoryIcon(cat.name);
            const isHovered = hoveredCat === cat.name;

            return (
              <button 
                key={cat.name} 
                className="cat-card-item opacity-0 group text-left block w-full focus:outline-none transition-all duration-[400ms] ease-out will-change-transform"
                onMouseEnter={() => setHoveredCat(cat.name)}
                onMouseLeave={() => setHoveredCat(null)}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(cat.link);
                }}
                tabIndex={0}
                aria-label={`Shop category ${cat.name}`}
              >
                <div className="cat-glass-card rounded-[2.5rem] h-80 sm:h-[22rem] w-full flex flex-col justify-end p-3 sm:p-4 relative overflow-hidden">
                  {/* Card Background Image */}
                  <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-110">
                    <Image
                      src={cat.image || "/premium_cookie.png"}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                  </div>
                  
                  {/* Sweeping sheen */}
                  <div className="cat-sheen-sweep z-10" />
                  
                  {/* Icon Header */}
                  <div 
                    className="absolute top-4 right-4 z-10 bg-white/90 p-2.5 rounded-full border border-brand-gold/20 shadow-sm transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white"
                  >
                    <Icon className="w-4 h-4 text-brand-gold transition-colors duration-300 group-hover:text-inherit" />
                  </div>
                  
                  {/* Curved-corner rectangle for text overlay */}
                  <div className="relative z-10 w-full bg-white/90 backdrop-blur-md border border-[#5C3317]/10 p-4 rounded-2xl shadow-lg transition-all duration-300 group-hover:bg-white group-hover:border-brand-gold/40 transform group-hover:translate-y-[-4px]">
                    <h3 
                      className={`text-sm sm:text-base font-bold transition-colors duration-[250ms] ${
                        isHovered ? 'text-brand-gold' : 'text-brand-brown'
                      }`}
                    >
                      {cat.name}
                    </h3>

                    <div 
                      className="mt-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#A0772A]/70 transition-all duration-300 ease-out flex items-center justify-between"
                    >
                      <span>Shop Now</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
