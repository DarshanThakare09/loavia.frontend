"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { Quote, Sparkles, MapPin, Award, Heart, Leaf } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteStore } from "@/store/siteStore";

// Safe ScrollTrigger registration for Next.js SSR
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Fallback defaults to prevent undefined/blank sections if user's browser has an old localStorage store state
const DEFAULTS = {
  aboutStoryTitle: "Our Story",
  aboutStorySubtitle: "Born in the heart of Maharashtra. Baked with world-class perfection.",
  aboutFounderName: "Pranita Vivek Patil",
  aboutFounderText: `Baking has always been more than a passion — it has been a part of my heart and identity. After my children became independent and began shaping their own paths, I chose to dedicate my time to something that truly fulfilled me — the art of baking.

My journey formally began in 2021, when I stepped into professional baking with curiosity and determination. I trained through specialized baking courses, and in 2022, I proudly earned my certification as a Pâtissier Chef. Soon after, I established Akshar Foods and introduced my bakery brand, “The Pastry Saga,” where every creation was crafted with love, care, and detail.

Yet, deep within, I carried a larger vision — to create cookies that were not only delicious but also genuinely nourishing. This vision naturally led me to the world of millets.

Millets are not new to India; they are part of our ancient food heritage. Rich in fiber, protein, calcium, iron, and essential minerals, they once formed the foundation of our traditional diet. Over time, with modern lifestyles and processed foods, these powerful grains slowly faded from our daily lives.

As I explored them deeper, I realized their true potential — supporting children’s growth, improving digestion, strengthening heart health, and enhancing overall wellness.

However, transforming these ancient grains into a truly delicious cookie was not easy. After countless experiments, refinements, and passion-driven trials, I finally created what I had envisioned — a wholesome, balanced, and delightful bite.

Today, LOAVIA™ proudly brings you premium millet cookies crafted with love, freshness, and purpose — where health meets indulgence.`,
  aboutMeaningTitle: "LOAVIA™",
  aboutMeaningSubtitle: "A Celebration of Love for Wholesome Baking",
  aboutMeaningText1: "The name LOAVIA™ is inspired by Loaf — bakery and baked goodness and Via/Avia — journey, lifestyle, and nourishment.",
  aboutMeaningText2: "At LOAVIA™, freshness and health matter more than mass production. We use fresh ingredients and freshly prepared millets in every batch, which is why our millet cookies have a shelf life of only one month.",
  aboutMeaningText3: "Our mission is to bring back the goodness of traditional grains in a delicious modern form for today’s generation.",
  aboutNashikRootsTitle: "The Nashik Roots",
  aboutNashikRootsText1: "Nestled in the vibrant agricultural heartland of Nashik, Maharashtra, LOAVIA began as a passionate dream to redefine the Indian cookie experience. We believe that an authentic Indian brand can seamlessly blend local agricultural richness with international baking standards.",
  aboutNashikRootsText2: "Every LOAVIA cookie is handcrafted daily in small batches in our Nashik kitchen. We don't just bake; we weave the spirit, warmth, and flavor of India into every single bite, creating pure, unadulterated joy without any preservatives or artificial flavors.",
  aboutStat1Number: "100%",
  aboutStat1Title: "Organic Flour",
  aboutStat1Desc: "Sourced responsibly for the best texture and health benefits.",
  aboutStat2Number: "Zero",
  aboutStat2Title: "Preservatives",
  aboutStat2Desc: "Absolutely no artificial colors, flavors, or chemicals.",
  aboutStat3Number: "Daily",
  aboutStat3Title: "Freshly Baked",
  aboutStat3Desc: "Made fresh every morning in our Nashik kitchen."
};

// Helper to parse stats with numbers and suffixes safely
const parseStatVal = (statStr: string) => {
  if (!statStr) return { number: 0, suffix: "" };
  const numMatch = statStr.match(/(\d+)/);
  const suffixMatch = statStr.replace(/(\d+)/, "");
  const number = numMatch ? parseInt(numMatch[0], 10) : 0;
  return { number, suffix: suffixMatch || "" };
};

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Post-hydration ScrollTrigger Refresh to prevent misaligned triggers from async renders
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000);

      const handleLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", handleLoad);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("load", handleLoad);
      };
    }
  }, [mounted]);

  const store = useSiteStore();

  // Resolve values with fallback to default constants to prevent undefined fields
  const storyTitle = (mounted ? store.aboutStoryTitle : null) || DEFAULTS.aboutStoryTitle;
  const storySubtitle = (mounted ? store.aboutStorySubtitle : null) || DEFAULTS.aboutStorySubtitle;
  const founderName = (mounted ? store.aboutFounderName : null) || DEFAULTS.aboutFounderName;
  const founderText = (mounted ? store.aboutFounderText : null) || DEFAULTS.aboutFounderText;
  const meaningTitle = (mounted ? store.aboutMeaningTitle : null) || DEFAULTS.aboutMeaningTitle;
  const meaningSubtitle = (mounted ? store.aboutMeaningSubtitle : null) || DEFAULTS.aboutMeaningSubtitle;
  const meaningText1 = (mounted ? store.aboutMeaningText1 : null) || DEFAULTS.aboutMeaningText1;
  const meaningText2 = (mounted ? store.aboutMeaningText2 : null) || DEFAULTS.aboutMeaningText2;
  const meaningText3 = (mounted ? store.aboutMeaningText3 : null) || DEFAULTS.aboutMeaningText3;
  const rootsTitle = (mounted ? store.aboutNashikRootsTitle : null) || DEFAULTS.aboutNashikRootsTitle;
  const rootsText1 = (mounted ? store.aboutNashikRootsText1 : null) || DEFAULTS.aboutNashikRootsText1;
  const rootsText2 = (mounted ? store.aboutNashikRootsText2 : null) || DEFAULTS.aboutNashikRootsText2;
  const stat1Num = (mounted ? store.aboutStat1Number : null) || DEFAULTS.aboutStat1Number;
  const stat1Title = (mounted ? store.aboutStat1Title : null) || DEFAULTS.aboutStat1Title;
  const stat1Desc = (mounted ? store.aboutStat1Desc : null) || DEFAULTS.aboutStat1Desc;
  const stat2Num = (mounted ? store.aboutStat2Number : null) || DEFAULTS.aboutStat2Number;
  const stat2Title = (mounted ? store.aboutStat2Title : null) || DEFAULTS.aboutStat2Title;
  const stat2Desc = (mounted ? store.aboutStat2Desc : null) || DEFAULTS.aboutStat2Desc;
  const stat3Num = (mounted ? store.aboutStat3Number : null) || DEFAULTS.aboutStat3Number;
  const stat3Title = (mounted ? store.aboutStat3Title : null) || DEFAULTS.aboutStat3Title;
  const stat3Desc = (mounted ? store.aboutStat3Desc : null) || DEFAULTS.aboutStat3Desc;

  useGSAP(() => {
    if (!mounted) return;

    // 1. Hero Animations
    gsap.fromTo(
      ".hero-bg-img",
      { scale: 1.15 },
      { scale: 1, duration: 2, ease: "power2.out" }
    );

    gsap.fromTo(".hero-text-el",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out"
      }
    );

    // 2. Vertical Timeline Progress Line Fill
    gsap.fromTo(
      ".timeline-progress-bar",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 35%",
          end: "bottom 65%",
          scrub: true
        }
      }
    );

    // 3. Scroll-linked Interactive Navigation HUD & Timeline Node Highlighting
    const storyChapters = [
      { id: "chapter-1", index: 0 },
      { id: "chapter-2", index: 1 },
      { id: "chapter-3", index: 2 },
      { id: "chapter-4", index: 3 },
      { id: "chapter-5", index: 4 }
    ];

    storyChapters.forEach((ch) => {
      ScrollTrigger.create({
        trigger: `#${ch.id}`,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) {
            // Update Floating HUD Dots active state classes
            document.querySelectorAll(".hud-dot").forEach((dot, dotIdx) => {
              if (dotIdx === ch.index) {
                dot.classList.add(
                  "border-brand-gold",
                  "bg-brand-gold",
                  "scale-125",
                  "shadow-[0_0_12px_rgba(226,155,82,0.6)]"
                );
                dot.querySelector(".hud-ping-dot")?.classList.remove("opacity-0");
              } else {
                dot.classList.remove(
                  "border-brand-gold",
                  "bg-brand-gold",
                  "scale-125",
                  "shadow-[0_0_12px_rgba(226,155,82,0.6)]"
                );
                dot.querySelector(".hud-ping-dot")?.classList.add("opacity-0");
              }
            });

            // Update Progress Timeline Nodes (make visited nodes gold)
            document.querySelectorAll(".timeline-node").forEach((node, nodeIdx) => {
              const nodeChapterIdx = nodeIdx + 1; // Nodes exist for chapters 2-5
              if (nodeChapterIdx <= ch.index) {
                node.classList.add(
                  "border-brand-gold",
                  "text-brand-gold",
                  "scale-110",
                  "shadow-[0_0_15px_rgba(226,155,82,0.4)]"
                );
                node.classList.remove(
                  "border-brand-brown/15",
                  "text-brand-text-secondary"
                );
              } else {
                node.classList.remove(
                  "border-brand-gold",
                  "text-brand-gold",
                  "scale-110",
                  "shadow-[0_0_15px_rgba(226,155,82,0.4)]"
                );
                node.classList.add("border-brand-brown/15", "text-brand-text-secondary");
              }
            });
          }
        }
      });
    });

    // 4. Mascot Float Animation & Scroll Parallax
    gsap.to(".mascot-float", {
      y: -15,
      yoyo: true,
      repeat: -1,
      duration: 3,
      ease: "sine.inOut"
    });

    gsap.fromTo(
      ".mascot-container",
      { yPercent: 5 },
      {
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: "#chapter-2",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // 5. Chapter 2 Unified Timeline Entry (Top 95% threshold, triggers once)
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: "#chapter-2",
        start: "top 95%",
        once: true
      }
    });
    tl2.fromTo("#chapter-2 .chapter-left-el",
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
      }
    )
    .fromTo("#chapter-2 .chapter-right-el",
      { x: 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.8");

    // 6. Chapter 3 Philosophy Unified Timeline Entry (Top 95% threshold, triggers once)
    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: "#chapter-3",
        start: "top 95%",
        once: true
      }
    });
    tl3.fromTo("#chapter-3 .philosophy-title-el",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out"
      }
    )
    .fromTo("#chapter-3 .philosophy-card-el",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.8");

    // 7. Chapter 4 Parallax Cookie Image & Split Entries (Top 95% threshold, triggers once)
    gsap.fromTo(
      ".parallax-cookie-img",
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: "#chapter-4",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

    const tl4 = gsap.timeline({
      scrollTrigger: {
        trigger: "#chapter-4",
        start: "top 95%",
        once: true
      }
    });
    tl4.fromTo("#chapter-4 .chapter-left-el",
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
      }
    )
    .fromTo("#chapter-4 .chapter-right-el",
      { x: 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.8");

    // 8. Chapter 5 Stats Card Entrance & Counters (Top 95% threshold, triggers once)
    const tl5 = gsap.timeline({
      scrollTrigger: {
        trigger: "#chapter-5",
        start: "top 95%",
        once: true
      }
    });
    tl5.fromTo("#chapter-5 .stats-card-container",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
      }
    );

    gsap.utils.toArray(".stat-number-val").forEach((el: any) => {
      const target = parseInt(el.getAttribute("data-target") || "0", 10);
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  }, { dependencies: [mounted], scope: containerRef });

  // Scroll to section HUD helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for sticky headers
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Dynamic Title Parser for signature cursive heading
  const titleWords = (storyTitle || "").trim().split(/\s+/);
  const lastWord = titleWords.length > 1 ? titleWords.pop() || "" : "";
  const firstPart = titleWords.join(" ");

  // Parse stats
  const stat1 = parseStatVal(stat1Num || "0");
  const stat2 = parseStatVal(stat2Num || "0");
  const stat3 = parseStatVal(stat3Num || "0");

  const hudChapters = [
    { id: "chapter-1", title: "01 Spark & Vision" },
    { id: "chapter-2", title: "02 The Founder" },
    { id: "chapter-3", title: "03 Philosophy" },
    { id: "chapter-4", title: "04 Nashik Roots" },
    { id: "chapter-5", title: "05 Our Impact" }
  ];

  return (
    <div className="bg-[#FDFBF7] min-h-screen pb-24 overflow-hidden relative" ref={containerRef}>
      
      {/* FLOATING HUD INTERACTIVE SIDE NAVIGATION */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6 items-end">
        {hudChapters.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => scrollToSection(ch.id)}
            className="group flex items-center gap-3 focus:outline-none cursor-pointer"
          >
            {/* Hover Tooltip Label */}
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-brand-brown text-brand-cream text-xs font-sans font-bold px-3 py-1.5 rounded-full shadow-md translate-x-2 group-hover:translate-x-0 pointer-events-none">
              {ch.title}
            </span>
            {/* Indicator Dot */}
            <div
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center hud-dot hud-dot-${idx} border-brand-brown/35 bg-white hover:border-brand-gold`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 transition-opacity duration-300 hud-ping-dot animate-ping"></div>
            </div>
          </button>
        ))}
      </div>

      {/* CHAPTER 1: HERO SECTION */}
      <div id="chapter-1" className="relative w-full min-h-[60vh] md:min-h-[75vh] flex items-center justify-end overflow-hidden">
        {/* Background Image with Zoom Animation */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-hero-bg.png"
            alt="LOAVIA Bakery Kitchen Background"
            fill
            priority
            className="hero-bg-img object-cover object-center"
          />
        </div>

        {/* Top-Right Dark Brown Radial Gradient Overlay */}
        <div
          style={{
            background: "radial-gradient(ellipse at top right, rgba(46, 25, 14, 0.95) 0%, rgba(46, 25, 14, 0.8) 35%, rgba(46, 25, 14, 0.4) 65%, rgba(46, 25, 14, 0) 85%)"
          }}
          className="absolute inset-0 z-1 pointer-events-none"
        />

        {/* Content Container aligned to right */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col items-start text-left py-16 md:py-0">
            <span className="hero-text-el text-brand-gold font-sans font-bold text-xs uppercase tracking-[3px] mb-2 block">
              About LOAVIA
            </span>

            {/* Dynamic Signature Script Header */}
            <h1
              style={{
                fontFamily: "'Amsterdam Signature', 'Playfair Display', serif",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
              }}
              className="hero-text-el text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] font-normal leading-[0.85] mb-2"
            >
              {firstPart && <span className="text-brand-cream block md:inline">{firstPart} </span>}
              {lastWord && <span className="text-[#E29B52] block md:inline">{lastWord}</span>}
            </h1>

            <div className="hero-text-el w-[120px] h-[2px] bg-[#E29B52] my-4 opacity-85"></div>

            <p
              style={{
                fontFamily: "'Outfit', 'Proxima Nova', 'Montserrat', sans-serif",
                textShadow: "0 1px 4px rgba(0, 0, 0, 0.2)"
              }}
              className="hero-text-el text-xs md:text-sm font-medium tracking-[3px] text-brand-cream/90 uppercase leading-relaxed mb-8 whitespace-pre-wrap"
            >
              {storySubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* CONTINUOUS STORY CONTAINER WITH VERTICAL TIMELINE TRACK */}
      <div className="timeline-container relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 md:mt-32">
        
        {/* Left aligned timeline progress line */}
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[3px] bg-brand-brown/10 -translate-x-1/2 hidden md:block pointer-events-none z-20">
          <div className="timeline-progress-bar w-full bg-brand-gold origin-top h-full scale-y-0 shadow-[0_0_8px_rgba(226,155,82,0.4)]"></div>
        </div>

        {/* CHAPTER 2: FOUNDER STORY SECTION */}
        <div id="chapter-2" className="relative grid grid-cols-1 md:grid-cols-12 gap-14 items-center mb-32 pl-0 md:pl-24">
          
          {/* Milestone Circle node */}
          <div className="absolute left-8 md:left-12 top-6 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FDFBF7] border-4 border-brand-brown/15 z-30 hidden md:flex items-center justify-center text-xs font-sans font-bold text-brand-text-secondary transition-all duration-300 timeline-node">
            02
          </div>

          {/* LEFT: Mascot with Glowing Gold Frame (Cols 1-5) */}
          <div className="chapter-left-el md:col-span-5 relative mascot-container">
            <div className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden bg-brand-gold/5 flex items-center justify-center border border-brand-gold/20 shadow-[0_20px_50px_rgba(226,155,82,0.12)] group">
              <Image
                src="/mascot.png"
                alt="LOAVIA Mascot"
                fill
                className="mascot-float object-contain p-12"
              />
              {/* Glowing inner border decoration */}
              <div className="absolute inset-4 border border-brand-gold/15 rounded-[2rem] pointer-events-none"></div>
            </div>
          </div>

          {/* RIGHT: Founder Story Quote Block (Cols 6-12) */}
          <div className="chapter-right-el md:col-span-7 flex flex-col justify-center">
            <span className="text-brand-gold font-sans font-bold text-xs uppercase tracking-[3px] mb-2 block">
              Our Visionary
            </span>
            
            <h2
              style={{ fontFamily: "'Amsterdam Signature', serif" }}
              className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2"
            >
              <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">The</span>
              <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">Founder</span>
            </h2>

            {/* Premium Asymmetric Quote Container */}
            <div className="relative pl-6 md:pl-10 py-6 mt-4 bg-white border border-brand-brown/5 rounded-r-[2.5rem] rounded-l-md border-l-4 border-l-brand-gold shadow-[0_8px_30px_rgba(92,51,23,0.02)]">
              <Quote className="absolute top-4 left-4 w-12 h-12 text-brand-gold/10 transform -rotate-12 pointer-events-none" />
              <div className="whitespace-pre-line relative z-10 pr-4">
                <span className="font-sans font-extrabold text-brand-brown text-xl md:text-2xl mb-4 block">
                  Hi, I am {founderName}, Founder of LOAVIA™
                </span>
                <p className="text-brand-text-secondary italic text-base md:text-lg leading-relaxed font-light">
                  {founderText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CHAPTER 3: LOAVIA MEANING - Light Storytelling Pillars */}
        <div id="chapter-3" className="relative py-24 my-16 pl-0 md:pl-24">

          {/* Milestone Circle node */}
          <div className="absolute left-8 md:left-12 top-10 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FDFBF7] border-4 border-brand-brown/15 z-30 hidden md:flex items-center justify-center text-xs font-sans font-bold text-brand-text-secondary transition-all duration-300 timeline-node">
            03
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
            <span className="philosophy-title-el text-brand-gold font-sans font-bold text-xs uppercase tracking-[3px] mb-2 block">
              Our Philosophy
            </span>
            
            <h2
              style={{ fontFamily: "'Amsterdam Signature', serif" }}
              className="philosophy-title-el font-normal leading-none mb-8 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2 justify-center"
            >
              <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">What We</span>
              <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">Stand For</span>
            </h2>

            <p className="philosophy-title-el text-lg md:text-xl font-serif text-brand-brown/90 mb-16 font-light italic max-w-3xl mx-auto leading-relaxed">
              "{meaningSubtitle}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {/* Card 1 */}
              <div className="philosophy-card-el group">
                <div className="w-full h-full bg-white border border-brand-brown/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:shadow-[0_20px_50px_rgba(92,51,23,0.08)] hover:border-brand-gold/30 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between">
                  <div>
                    {/* Floating Icon Badging */}
                    <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="font-sans font-extrabold text-brand-brown text-lg md:text-xl mb-3">
                      The Name & Story
                    </h3>
                    <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed font-light">
                      {meaningText1}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="philosophy-card-el group">
                <div className="w-full h-full bg-white border border-brand-brown/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:shadow-[0_20px_50px_rgba(92,51,23,0.08)] hover:border-brand-gold/30 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between">
                  <div>
                    {/* Floating Icon Badging */}
                    <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <h3 className="font-sans font-extrabold text-brand-brown text-lg md:text-xl mb-3">
                      Freshness First
                    </h3>
                    <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed font-light">
                      {meaningText2}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="philosophy-card-el group">
                <div className="w-full h-full bg-white border border-brand-brown/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:shadow-[0_20px_50px_rgba(92,51,23,0.08)] hover:border-brand-gold/30 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between">
                  <div>
                    {/* Floating Icon Badging */}
                    <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-sans font-extrabold text-brand-brown text-lg md:text-xl mb-3">
                      Ancient Heritage
                    </h3>
                    <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed font-light">
                      {meaningText3}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHAPTER 4: NASHIK ROOTS SECTION */}
        <div id="chapter-4" className="relative grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32 pl-0 md:pl-24">
          
          {/* Milestone Circle node */}
          <div className="absolute left-8 md:left-12 top-6 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FDFBF7] border-4 border-brand-brown/15 z-30 hidden md:flex items-center justify-center text-xs font-sans font-bold text-brand-text-secondary transition-all duration-300 timeline-node">
            04
          </div>

          {/* Left Visual Banner with Parallax Image */}
          <div className="chapter-left-el relative rounded-[2.5rem] overflow-hidden aspect-[4/5] md:aspect-square shadow-2xl group border border-brand-brown/10">
            <Image
              src="/nashik-roots.jpg"
              alt="Nashik Heritage Roots - Ram Kund Godavari River"
              fill
              className="parallax-cookie-img object-cover transform scale-110"
            />
            <div className="absolute inset-0 bg-brand-brown/10 mix-blend-overlay"></div>
            {/* Elegant overlay border */}
            <div className="absolute inset-4 border border-white/20 rounded-[2rem] pointer-events-none"></div>
          </div>

          {/* Right Heritage Copy with Gold Badging */}
          <div className="chapter-right-el flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 self-start px-5 py-2.5 bg-brand-gold/10 text-brand-gold font-sans font-bold rounded-full mb-6 text-xs tracking-wider uppercase border border-brand-gold/20 shadow-[0_4px_12px_rgba(226,155,82,0.08)]">
              <Sparkles className="w-3.5 h-3.5" />
              100% Indian Brand
            </div>

            <h2
              style={{ fontFamily: "'Amsterdam Signature', serif" }}
              className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2"
            >
              <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">Our Nashik</span>
              <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">Roots</span>
            </h2>

            <div className="space-y-6">
              <p className="text-brand-text-secondary text-lg leading-relaxed font-light">
                {rootsText1}
              </p>
              <p className="text-brand-text-secondary text-lg leading-relaxed font-light">
                {rootsText2}
              </p>
            </div>
          </div>
        </div>

        {/* CHAPTER 5: STATS / IMPACT SECTION */}
        <div id="chapter-5" className="relative pl-0 md:pl-24 mb-16">
          
          {/* Milestone Circle node */}
          <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FDFBF7] border-4 border-brand-brown/15 z-30 hidden md:flex items-center justify-center text-xs font-sans font-bold text-brand-text-secondary transition-all duration-300 timeline-node">
            05
          </div>

          <div className="stats-card-container bg-white rounded-[3rem] p-12 md:p-20 text-center shadow-[0_20px_50px_rgba(92,51,23,0.05)] border border-brand-brown/5 relative overflow-hidden">
            {/* Decorative blur background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-brown/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none"></div>

            <h2
              style={{ fontFamily: "'Amsterdam Signature', serif" }}
              className="font-normal leading-none mb-16 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2 justify-center relative z-10"
            >
              <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">Healthy Inside,</span>
              <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">Yummy Outside</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 relative z-10">
              {/* Stat Item 1 */}
              <div className="stat-item flex flex-col items-center bg-[#FDFBF7] p-8 rounded-[2.5rem] border border-brand-brown/5 shadow-sm hover:shadow-md hover:border-brand-gold/20 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold mb-6 shadow-sm">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-brand-gold mb-4 drop-shadow-md flex items-baseline">
                  <span className="stat-number-val" data-target={stat1.number}>0</span>
                  <span className="text-4xl md:text-5xl ml-0.5">{stat1.suffix}</span>
                </div>
                <p className="font-extrabold text-brand-brown text-lg md:text-xl mb-2">{stat1Title}</p>
                <p className="text-brand-text-secondary text-sm max-w-xs leading-relaxed font-light">{stat1Desc}</p>
              </div>

              {/* Stat Item 2 */}
              <div className="stat-item flex flex-col items-center bg-[#FDFBF7] p-8 rounded-[2.5rem] border border-brand-brown/5 shadow-sm hover:shadow-md hover:border-brand-gold/20 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold mb-6 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-brand-gold mb-4 drop-shadow-md flex items-baseline">
                  <span className="stat-number-val" data-target={stat2.number}>0</span>
                  <span className="text-4xl md:text-5xl ml-0.5">{stat2.suffix}</span>
                </div>
                <p className="font-extrabold text-brand-brown text-lg md:text-xl mb-2">{stat2Title}</p>
                <p className="text-brand-text-secondary text-sm max-w-xs leading-relaxed font-light">{stat2Desc}</p>
              </div>

              {/* Stat Item 3 */}
              <div className="stat-item flex flex-col items-center bg-[#FDFBF7] p-8 rounded-[2.5rem] border border-brand-brown/5 shadow-sm hover:shadow-md hover:border-brand-gold/20 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold mb-6 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-brand-gold mb-4 drop-shadow-md flex items-baseline">
                  <span className="stat-number-val" data-target={stat3.number}>0</span>
                  <span className="text-4xl md:text-5xl ml-0.5">{stat3.suffix}</span>
                </div>
                <p className="font-extrabold text-brand-brown text-lg md:text-xl mb-2">{stat3Title}</p>
                <p className="text-brand-text-secondary text-sm max-w-xs leading-relaxed font-light">{stat3Desc}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
