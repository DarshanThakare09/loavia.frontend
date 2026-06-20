"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Sparkles, Coffee, PartyPopper } from "lucide-react";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const FloatingParticles = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <style>{`
      @keyframes moodFloat {
        0% { transform: translateY(0px); opacity: 0.15; }
        50% { transform: translateY(-12px); opacity: 0.35; }
        100% { transform: translateY(0px); opacity: 0.15; }
      }
      .particle {
        position: absolute;
        animation: moodFloat ease-in-out infinite;
      }
    `}</style>
    <div className="particle" style={{ top: '15%', left: '15%', width: '12px', height: '12px', border: '1px solid #A0772A', borderRadius: '50%', animationDuration: '4s' }} />
    <div className="particle" style={{ top: '60%', left: '10%', width: '16px', height: '16px', backgroundColor: '#A0772A', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', animationDuration: '5.5s', animationDelay: '1s' }} />
    <div className="particle" style={{ top: '25%', left: '80%', width: '8px', height: '8px', backgroundColor: '#5C3317', borderRadius: '50%', animationDuration: '3.5s', animationDelay: '2s' }} />
    <div className="particle" style={{ top: '75%', left: '85%', width: '10px', height: '10px', border: '1px solid #5C3317', animationDuration: '6s', animationDelay: '0.5s' }} />
    <div className="particle" style={{ top: '85%', left: '40%', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#A0772A', animationDuration: '4.5s', animationDelay: '1.5s' }} />
    <div className="particle" style={{ top: '10%', left: '50%', width: '8px', height: '8px', backgroundColor: '#5C3317', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', animationDuration: '5s', animationDelay: '2.5s' }} />
  </div>
);

export function ShopByMood() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const moods = [
    { id: "sweet", name: "Craving Sweet", icon: Heart, bgColor: "bg-[#FADCD9]", hoverBg: "#FFF0F0", borderHover: "border-[#FADCD9]", image: "/stuffed_cookie.png", link: "/shop?mood=sweet" },
    { id: "healthy", name: "Healthy Fix", icon: Sparkles, bgColor: "bg-[#D4E6B5]", hoverBg: "#F0F5EE", borderHover: "border-[#D4E6B5]", image: "/vegan_cookie.png", link: "/shop?mood=healthy" },
    { id: "tea", name: "Perfect with Tea", icon: Coffee, bgColor: "bg-[#E6D4B5]", hoverBg: "#F7F0E5", borderHover: "border-[#E6D4B5]", image: "/premium_cookie.png", link: "/shop?mood=tea" },
    { id: "gifting", name: "Gifting", icon: PartyPopper, bgColor: "bg-[#F3D9FA]", hoverBg: "#F5F0FA", borderHover: "border-[#F3D9FA]", image: "/cookie_gift_box.png", link: "/shop?mood=gifting" },
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion) {
      gsap.set(".mood-heading-word, .mood-subtitle, .mood-card", { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true
      }
    });

    tl.fromTo(".mood-heading-word", 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }
    )
    .fromTo(".mood-question-mark",
      { y: 0 },
      { y: -6, duration: 0.4, ease: "bounce.out", yoyo: true, repeat: 1 },
      "-=0.2"
    )
    .fromTo(".mood-subtitle",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(".mood-card",
      { opacity: 0, y: 60, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.2)" },
      "-=0.4"
    );

  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  return (
    <section 
      ref={containerRef} 
      id="mood-section"
      className="py-24 relative transition-colors duration-500 ease-in-out"
      style={{
        backgroundColor: hoveredMood ? '#F9F8F6' : 'var(--color-brand-cream)'
      }}
    >
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <FloatingParticles />

      <style>{`
        .mood-glass-card {
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
        .mood-glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1) 40%, transparent);
          pointer-events: none;
          z-index: 1;
        }
        .sheen-sweep {
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
        .mood-text-container {
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
        .mood-card:hover .mood-text-container {
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
        .mood-explore-btn {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mood-card:hover .mood-explore-btn,
        .mood-card:focus-within .mood-explore-btn {
          max-height: 2rem;
        }
        .mood-card:hover .sheen-sweep {
          left: 150%;
          transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mood-card:hover .mood-glass-card {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 30px 60px rgba(92, 51, 23, 0.2);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 
            style={{ fontFamily: "'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-center sm:flex-wrap gap-x-4 gap-y-2 text-center"
          >
            <span className="mood-heading-word opacity-0 inline-block text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">What's</span>
            <span className="mood-heading-word opacity-0 inline-block text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">your</span>
            <span className="mood-heading-word opacity-0 inline-block relative text-brand-brown text-7xl md:text-8xl lg:text-[8rem]">
              mood<span className="mood-question-mark inline-block text-brand-brown">?</span>
            </span>
          </h2>
          <p className="mood-subtitle opacity-0 font-sans text-brand-text-secondary max-w-2xl mx-auto text-sm md:text-base lg:text-lg font-light leading-relaxed">
            Whether you need a mid-day energy boost or a decadent midnight snack, we have a cookie crafted just for how you feel.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {moods.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            const isOtherSelected = selectedMood !== null && !isSelected;
            const isHovered = hoveredMood === mood.id;

            return (
              <button 
                key={mood.id} 
                className="mood-card opacity-0 group text-left block w-full focus:outline-none transition-all duration-[400ms] ease-out will-change-transform"
                style={{
                  opacity: isOtherSelected ? 0.5 : 1,
                  transform: isOtherSelected ? 'scale(0.97)' : 'scale(1)'
                }}
                onMouseEnter={() => !selectedMood && setHoveredMood(mood.id)}
                onMouseLeave={() => setHoveredMood(null)}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedMood(mood.id);
                  if (!prefersReducedMotion) {
                    gsap.fromTo(`#icon-${mood.id}`, 
                      { scale: 1 },
                      { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }
                    );
                  }
                  setTimeout(() => router.push(mood.link), 350);
                }}
                tabIndex={0}
                aria-label={`Shop cookies for ${mood.name}`}
              >
                <div 
                  className={`
                    mood-glass-card rounded-[2.5rem] h-80 sm:h-[22rem] w-full flex flex-col justify-end p-3 sm:p-4 relative overflow-hidden
                    ${isSelected ? 'ring-2 ring-brand-gold shadow-2xl scale-105 filter brightness-95' : ''}
                    focus:ring-2 focus:ring-brand-gold
                  `}
                >
                  {/* Card Background Image (the cookie PNG) */}
                  <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-110">
                    <Image
                      src={mood.image}
                      alt={mood.name}
                      fill
                      className="object-cover"
                    />
                    {/* Subtle overlay gradient to blend the PNG background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                  </div>
                  
                  {/* Sweeping sheen */}
                  <div className="sheen-sweep z-10" />
                  
                  {/* Icon Header */}
                  <div 
                    id={`icon-${mood.id}`}
                    className={`
                      absolute top-4 right-4 z-10 bg-white/90 p-2.5 rounded-full border border-brand-gold/20 shadow-sm
                      transition-all duration-300 ease-out
                      ${!isSelected ? 'group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white' : ''}
                    `}
                  >
                    <Icon className="w-4 h-4 text-brand-gold transition-colors duration-300 group-hover:text-inherit" />
                  </div>
                  
                  {/* Curved-corner rectangle for text overlay */}
                  <div className="relative z-10 w-full bg-white/90 backdrop-blur-md border border-[#5C3317]/10 p-4 rounded-2xl shadow-lg transition-all duration-300 group-hover:bg-white group-hover:border-brand-gold/40 transform group-hover:translate-y-[-4px]">
                    <h3 
                      className={`
                        text-sm sm:text-base font-bold transition-colors duration-[250ms]
                        ${isSelected || (!isSelected && isHovered) ? 'text-brand-gold' : 'text-brand-brown'}
                      `}
                    >
                      {mood.name}
                    </h3>

                    <div 
                      className={`
                        mt-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#A0772A]/70
                        transition-all duration-300 ease-out flex items-center justify-between
                      `}
                    >
                      <span>Explore</span>
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
