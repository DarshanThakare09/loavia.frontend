"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export function Categories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const categories = [
    { name: "Classic Collection", image: "/premium_cookie.png", link: "/shop?category=classic" },
    { name: "Vegan Options", image: "/vegan_cookie.png", link: "/shop?category=vegan" },
    { name: "Gluten-Free", image: "/gluten_free_cookie.png", link: "/shop?category=gluten-free" },
    { name: "Stuffed Cookies", image: "/stuffed_cookie.png", link: "/shop?category=stuffed" },
  ];

  const headingText = "Shop by Category".split("");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mobileQuery.matches);
    const mobileHandler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mobileQuery.addEventListener("change", mobileHandler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
      mobileQuery.removeEventListener("change", mobileHandler);
    };
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion) {
      gsap.set(".cat-char, .cat-underline, .category-circle", { opacity: 1, y: 0, scale: 1, width: "60%" });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        once: true
      }
    });

    // Heading chars
    tl.fromTo(".cat-char",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: "power2.out" }
    )
    .fromTo(".cat-underline",
      { width: "0%" },
      { width: "60%", duration: 0.6, ease: "power2.inOut" },
      "+=0.1"
    )
    .fromTo(".category-circle",
      { opacity: 0, y: 80, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.4)" },
      "-=0.6"
    );

    // Parallax
    gsap.utils.toArray(".category-img-container").forEach((el: any, i) => {
      const yAmount = i % 2 === 0 ? 20 : 30;
      const img = el.querySelector("img");
      gsap.fromTo(img, 
        { y: yAmount },
        {
          y: -yAmount,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
          }
        }
      );
    });

  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    
    // Magnetic Cursor Effect
    const section = containerRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const circles = section.querySelectorAll(".category-circle");
      circles.forEach((circle: any) => {
        const rect = circle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX ** 2 + distY ** 2);

        if (distance < 80) {
          gsap.to(circle, {
            x: distX * 0.15,
            y: distY * 0.15,
            duration: 0.4,
            ease: "power2.out"
          });
        } else {
          gsap.to(circle, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
        }
      });
    };

    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, prefersReducedMotion]);

  const handleCircleMouseMove = (e: React.MouseEvent, index: number) => {
    if (isMobile || prefersReducedMotion) return;
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * 12;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * -12;

    gsap.to(element, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      duration: 0.1,
      ease: "none"
    });

    const img = element.querySelector(".category-img-container");
    if (img) {
      gsap.to(img, {
        x: rotateY * -0.4,
        y: rotateX * 0.4,
        duration: 0.1,
        ease: "none"
      });
    }
  };

  const handleCircleMouseLeave = (e: React.MouseEvent, index: number) => {
    setHoveredIndex(null);
    if (isMobile || prefersReducedMotion) return;
    const element = e.currentTarget as HTMLElement;
    gsap.to(element, {
      rotateX: 0, rotateY: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    });
    
    const img = element.querySelector(".category-img-container");
    if (img) {
      gsap.to(img, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    }
  };

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
    <section ref={containerRef} id="category-section" className="py-32 bg-brand-light overflow-hidden">
      <style>{`
        @keyframes floatAnim0 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes floatAnim1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes floatAnim2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes floatAnim3 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        .float-0 { animation: floatAnim0 3.2s ease-in-out infinite; }
        .float-1 { animation: floatAnim1 3.8s ease-in-out infinite; }
        .float-2 { animation: floatAnim2 3.5s ease-in-out infinite; }
        .float-3 { animation: floatAnim3 4.0s ease-in-out infinite; }
        .float-paused { animation-play-state: paused; }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-2 flex flex-wrap justify-center overflow-hidden pb-2">
            {headingText.map((char, i) => (
              <span key={i} className="cat-char opacity-0 inline-block" style={{ minWidth: char === ' ' ? '0.5em' : 'auto' }}>
                {char}
              </span>
            ))}
          </h2>
          <div className="cat-underline w-0 h-[3px] bg-brand-gold rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {categories.map((category, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <div 
                key={category.name} 
                className={`category-circle opacity-0 will-change-transform float-${index} ${isHovered ? 'float-paused' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseMove={(e) => handleCircleMouseMove(e, index)}
                onMouseLeave={(e) => handleCircleMouseLeave(e, index)}
              >
                <a 
                  href={category.link} 
                  onClick={(e) => handleCircleClick(e, category.link)}
                  className="block relative rounded-full aspect-square overflow-hidden shadow-lg transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-brand-gold border-4 border-transparent"
                  style={{ backgroundColor: '#F5ECD7' }}
                  tabIndex={0}
                  aria-label={`Shop ${category.name}`}
                >
                  {/* SVG Gold Ring Animation */}
                  <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none transform -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="48" 
                      fill="none" 
                      stroke="#A0772A" 
                      strokeWidth="3"
                      strokeDasharray="301.59" /* 2 * PI * 48 */
                      strokeDashoffset={isHovered ? 0 : 301.59}
                      className="transition-all duration-[600ms] ease-out"
                    />
                  </svg>

                  <div className="category-img-container absolute inset-[-10%] w-[120%] h-[120%] transition-transform duration-[500ms] ease-out"
                       style={{ transform: isHovered ? 'scale(1.12)' : 'scale(1)' }}>
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                  
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-end pb-10 transition-colors duration-[400ms] z-10"
                    style={{ background: isHovered ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' : 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%)' }}
                  >
                    <h3 
                      className="text-white font-serif font-bold text-lg md:text-xl text-center px-4 transition-transform duration-[350ms] ease-out"
                      style={{ transform: isHovered ? 'translateY(-20px)' : 'translateY(0)' }}
                    >
                      {category.name}
                    </h3>
                    
                    <span 
                      className="text-[#F5ECD7] text-xs font-bold uppercase tracking-[0.12em] absolute bottom-6 transition-all duration-300 ease-out"
                      style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(10px)', transitionDelay: isHovered ? '150ms' : '0ms' }}
                    >
                      Shop Now &rarr;
                    </span>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
