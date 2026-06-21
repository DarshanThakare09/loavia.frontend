"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSiteStore } from "@/store/siteStore";

gsap.registerPlugin(ScrollTrigger);

export function Categories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );

  const { categoriesList } = useSiteStore();
  const categories = categoriesList || [];

  const headingText = "Shop by Category".split("");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const mobileHandler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mobileQuery.addEventListener("change", mobileHandler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
      mobileQuery.removeEventListener("change", mobileHandler);
    };
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion) {
      gsap.set(".cat-char, .category-circle", { opacity: 1, y: 0, scale: 1 });
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
    gsap.utils.toArray<HTMLElement>(".category-img-container").forEach((el, i) => {
      const yAmount = i % 2 === 0 ? 20 : 30;
      const img = el.querySelector("img");
      if (!img) return;
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
      const circles = section.querySelectorAll<HTMLElement>(".category-circle");
      circles.forEach((circle) => {
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

  const handleCircleMouseMove = (e: React.MouseEvent) => {
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

  const handleCircleMouseLeave = (e: React.MouseEvent) => {
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
    <section ref={containerRef} id="category-section" className="relative py-24 md:py-28 bg-brand-light overflow-hidden">
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
        @keyframes floatAnim0 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes floatAnim1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes floatAnim2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes floatAnim3 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        .float-0 { animation: floatAnim0 3.2s ease-in-out infinite; }
        .float-1 { animation: floatAnim1 3.8s ease-in-out infinite; }
        .float-2 { animation: floatAnim2 3.5s ease-in-out infinite; }
        .float-3 { animation: floatAnim3 4.0s ease-in-out infinite; }
        .float-paused { animation-play-state: paused; }
        .category-circle:hover { animation-play-state: paused; }
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {categories.map((category, index) => {
            return (
              <div
                key={category.name}
                className={`category-circle opacity-0 will-change-transform float-${index}`}
                onMouseMove={handleCircleMouseMove}
                onMouseLeave={handleCircleMouseLeave}
              >
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
