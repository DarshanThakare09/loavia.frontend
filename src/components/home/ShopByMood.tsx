"use client";

import { useRef, useState, useEffect } from "react";
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

  const currentBg = selectedMood 
    ? moods.find(m => m.id === selectedMood)?.hoverBg 
    : hoveredMood 
      ? moods.find(m => m.id === hoveredMood)?.hoverBg 
      : "#F5ECD7";

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
      className="py-24 relative transition-colors duration-[600ms] ease-in-out"
      style={{ backgroundColor: currentBg }}
    >
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <FloatingParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-6 flex justify-center space-x-3">
            <span className="mood-heading-word opacity-0 inline-block">What's</span>
            <span className="mood-heading-word opacity-0 inline-block">your</span>
            <span className="mood-heading-word opacity-0 inline-block relative">
              mood<span className="mood-question-mark inline-block">?</span>
            </span>
          </h2>
          <p className="mood-subtitle opacity-0 text-brand-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
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
                  // Route to the shop page with the filter applied
                  setTimeout(() => router.push(mood.link), 350);
                }}
                tabIndex={0}
                aria-label={`Shop cookies for ${mood.name}`}
              >
                <div 
                  className={`
                    ${mood.bgColor} rounded-[2rem] p-6 md:p-8 h-full flex flex-col items-center justify-center text-center 
                    transition-all duration-[350ms] ease-out relative overflow-hidden
                    ${isSelected ? 'ring-2 ring-brand-gold shadow-xl scale-105 filter brightness-95' : 'border-2 border-transparent'}
                    ${!isSelected ? 'hover:-translate-y-2 hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]' : ''}
                    focus:ring-2 focus:ring-brand-gold
                  `}
                  style={{
                    backgroundImage: `url('${mood.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
                  
                  <div 
                    id={`icon-${mood.id}`}
                    className={`
                      bg-white/80 p-5 rounded-full mb-6 
                      transition-all duration-300 ease-out relative z-10
                      ${!isSelected ? 'group-hover:scale-[1.15] group-hover:rotate-[8deg]' : ''}
                    `}
                  >
                    <Icon className="w-8 h-8 text-brand-brown" />
                  </div>
                  
                  <h3 
                    className={`
                      text-lg md:text-xl font-bold transition-colors duration-[250ms] relative z-10
                      ${isSelected || (!isSelected && isHovered) ? 'text-brand-gold' : 'text-brand-brown'}
                    `}
                  >
                    {mood.name}
                  </h3>

                  <div 
                    className={`
                      mt-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-brown
                      transition-all duration-300 ease-out delay-100 h-4 relative z-10
                      ${isSelected || (!isSelected && isHovered) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                    `}
                  >
                    Explore &rarr;
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
