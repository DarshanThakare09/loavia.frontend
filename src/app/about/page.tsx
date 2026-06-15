"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteStore } from "@/store/siteStore";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    aboutStoryTitle,
    aboutStorySubtitle,
    aboutFounderName,
    aboutFounderText,
    aboutMeaningTitle,
    aboutMeaningSubtitle,
    aboutMeaningText1,
    aboutMeaningText2,
    aboutMeaningText3,
    aboutNashikRootsTitle,
    aboutNashikRootsText1,
    aboutNashikRootsText2,
    aboutStat1Number,
    aboutStat1Title,
    aboutStat1Desc,
    aboutStat2Number,
    aboutStat2Title,
    aboutStat2Desc,
    aboutStat3Number,
    aboutStat3Title,
    aboutStat3Desc
  } = useSiteStore();

  useGSAP(() => {
    // Hero Animations
    gsap.from(".hero-logo", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".hero-title", { y: 30, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out" });
    gsap.from(".hero-subtitle", { y: 20, opacity: 0, duration: 1, delay: 0.5, ease: "power3.out" });

    // Section Animations (ScrollTrigger)
    const sections = gsap.utils.toArray(".animate-section");
    sections.forEach((sec: any) => {
      gsap.from(sec, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sec,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Stats Counter Animation
    gsap.from(".stat-item", {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: ".stats-container",
        start: "top 80%",
      }
    });

  }, { scope: containerRef });

  return (
    <div className="bg-brand-cream min-h-screen pb-24 overflow-hidden" ref={containerRef}>
      {/* Hero Section */}
      <div className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <Image
            src="/cookies-baking.gif"
            alt="Baking Cookies Background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 h-full py-4">
          <div className="relative w-64 h-64 md:w-146 md:h-140 max-h-[45vh] md:max-h-[60vh] -mt-10 mb-4 hero-logo drop-shadow-2xl flex-shrink w-full">
            <Image
              src="/loavia-logo.png"
              alt="LOAVIA Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-brand-brown mb-4 hero-title drop-shadow-lg flex-shrink-0">
            {aboutStoryTitle}
          </h1>
          <p className="text-brand-text-secondary text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium hero-subtitle drop-shadow-md flex-shrink-0">
            {aboutStorySubtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 md:mt-32">
        {/* OUR STORY SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-stretch mb-32 animate-section">

          {/* LEFT - MASCOT IMAGE */}
          <div className="relative w-full h-[450px] md:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl bg-brand-gold/10 flex items-center justify-center">
            <Image
              src="/mascot.png"
              alt="LOAVIA Mascot"
              fill
              className="object-contain p-8"
            />
          </div>

          {/* RIGHT - FULL PARAGRAPH */}
          <div className="flex flex-col justify-center text-brand-text-secondary text-lg md:text-xl leading-relaxed">
            <div className="whitespace-pre-line">
              <span className="font-bold text-brand-brown text-2xl mb-4 block">Hi, I am {aboutFounderName}, Founder of LOAVIA™</span>
              {aboutFounderText}
            </div>
          </div>

        </div>

        {/* LOAVIA MEANING */}
        <div className="mb-32 animate-section text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-6">
            {aboutMeaningTitle}
          </h2>
          <p className="text-xl font-semibold text-brand-brown mb-4">
            {aboutMeaningSubtitle}
          </p>
          <p className="text-brand-text-secondary text-lg leading-relaxed">
            {aboutMeaningText1}
          </p>
          <p className="mt-4 text-brand-text-secondary text-lg leading-relaxed">
            {aboutMeaningText2}
          </p>
          <p className="mt-4 text-brand-text-secondary text-lg leading-relaxed">
            {aboutMeaningText3}
          </p>
        </div>

        {/* The Nashik Roots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32 animate-section">
          <div className="relative rounded-[2.5rem] overflow-hidden aspect-square shadow-2xl group">
            <Image
              src="/premium_cookie.png"
              alt="Baking Process"
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-brand-brown/10 mix-blend-overlay"></div>
          </div>
          <div>
            <div className="inline-block px-4 py-2 bg-brand-gold/10 text-brand-gold font-bold rounded-full mb-6 text-sm tracking-wider uppercase">
              100% Indian Brand
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-6 leading-tight">
              {aboutNashikRootsTitle}
            </h2>
            <p className="text-brand-text-secondary text-lg leading-relaxed mb-6">
              {aboutNashikRootsText1}
            </p>
            <p className="text-brand-text-secondary text-lg leading-relaxed">
              {aboutNashikRootsText2}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-[3rem] p-12 md:p-20 text-center shadow-2xl border border-brand-brown/5 relative overflow-hidden stats-container">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-brown/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-16 relative z-10">
            Healthy Inside, Yummy Outside
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 relative z-10">
            <div className="stat-item flex flex-col items-center">
              <div className="text-6xl font-serif font-bold text-brand-gold mb-4 drop-shadow-md">{aboutStat1Number}</div>
              <p className="font-bold text-brand-brown text-xl">{aboutStat1Title}</p>
              <p className="text-brand-text-secondary mt-2 text-sm max-w-xs">{aboutStat1Desc}</p>
            </div>
            <div className="stat-item flex flex-col items-center">
              <div className="text-6xl font-serif font-bold text-brand-gold mb-4 drop-shadow-md">{aboutStat2Number}</div>
              <p className="font-bold text-brand-brown text-xl">{aboutStat2Title}</p>
              <p className="text-brand-text-secondary mt-2 text-sm max-w-xs">{aboutStat2Desc}</p>
            </div>
            <div className="stat-item flex flex-col items-center">
              <div className="text-6xl font-serif font-bold text-brand-gold mb-4 drop-shadow-md">{aboutStat3Number}</div>
              <p className="font-bold text-brand-brown text-xl">{aboutStat3Title}</p>
              <p className="text-brand-text-secondary mt-2 text-sm max-w-xs">{aboutStat3Desc}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
