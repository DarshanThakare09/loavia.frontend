"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useSiteStore } from "@/store/siteStore";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { heroTitle, heroSubtitle } = useSiteStore();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const titleText = mounted && heroTitle ? heroTitle : "Healthy Inside,\nYummy Outside.";
  let part1 = "Healthy Inside,";
  let part2 = "Yummy Outside.";

  if (titleText.includes("\n")) {
    const parts = titleText.split("\n");
    part1 = parts[0]?.trim() || "";
    part2 = parts[1]?.trim() || "";
  } else if (titleText.includes(",")) {
    const parts = titleText.split(",");
    part1 = (parts[0]?.trim() || "") + ",";
    part2 = parts[1]?.trim() || "";
  } else {
    const words = titleText.split(" ");
    if (words.length > 2) {
      const mid = Math.ceil(words.length / 2);
      part1 = words.slice(0, mid).join(" ");
      part2 = words.slice(mid).join(" ");
    } else {
      part1 = words[0] || "";
      part2 = words[1] || "";
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    if (!isVisible) return;

    const tl = gsap.timeline();

    tl.fromTo(".hero-title",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2 }
    )
      .fromTo(".hero-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      )
      .fromTo(".hero-cta",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.4"
      );
  }, { dependencies: [isVisible], scope: containerRef });

  return (
    <div id="hero-section-wrapper" className="relative w-full lg:h-[180vh]">
      <section
        ref={containerRef}
        style={{
          top: "var(--navbar-height, 108px)",
          height: "calc(100vh - var(--navbar-height, 108px))"
        }}
        className="relative lg:sticky min-h-[calc(100vh-7rem)] w-full flex items-center overflow-hidden"
      >
        {/* Background GIF */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/baking-time-lapse.gif"
            alt="Baking Time Lapse"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Dark Radial Dust Shadow Overlay matching first starting animation */}
          <div
            style={{
              background: "radial-gradient(ellipse at top left, rgba(53, 30, 17, 0.95) 0%, rgba(53, 30, 17, 0.8) 35%, rgba(53, 30, 17, 0.45) 60%, rgba(53, 30, 17, 0) 80%)"
            }}
            className="absolute inset-0"
          ></div>
        </div>

        {/* Text Content matching position and styling of the first animation text */}
        <div className="absolute top-[15vh] left-[8vw] max-w-[85vw] lg:max-w-[55vw] flex flex-col gap-2.5 text-left items-start z-10">
          <h1
            style={{
              fontFamily: "'Amsterdam Signature', 'Playfair Display', serif",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.25)"
            }}
            className="hero-title text-6xl md:text-[6.5rem] lg:text-[7.5rem] font-normal leading-[0.85] text-white mb-2"
          >
            <span className="text-white">{part1}</span>
            <br />
            <span className="text-[#E29B52]">{part2}</span>
          </h1>
          <div className="hero-underline w-[150px] h-[2px] bg-[#E29B52] my-4 opacity-85"></div>
          <p
            style={{ fontFamily: "'Outfit', 'Proxima Nova', 'Montserrat', sans-serif" }}
            className="hero-subtitle text-xs md:text-sm font-medium tracking-[3px] text-white/85 uppercase leading-relaxed mb-8 whitespace-pre-wrap"
          >
            {mounted ? heroSubtitle : "Premium millet cookies and healthy bakery products crafted with wholesome ingredients, rich flavours, and freshly baked goodness."}
          </p>
          <div className="hero-cta flex gap-4 w-full justify-start mt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-brand-cream bg-[#E29B52] rounded-full hover:bg-white hover:text-brand-brown transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Shop Now
            </Link>

            <a
              href="https://wa.me/917796116622"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-green-500 rounded-full hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>

        {/* Mascot Image - Right Center */}
        <div className="hidden lg:flex absolute right-[5vw] top-1/2 transform -translate-y-1/2 z-10 items-center justify-center h-full">
          <div className="relative">
            <Image
              src="/loavia-mascot.png"
              alt="Loavia Mascot"
              width={450}
              height={600}
              className="object-contain drop-shadow-2xl"
              priority
            />

            {/* Speech Bubble */}
            <div className="absolute -top-5 -right-8 bg-white rounded-3xl px-6 py-3 shadow-lg" style={{ minWidth: '200px', fontFamily: "'Outfit', 'Proxima Nova', 'Montserrat', sans-serif", fontWeight: 100 }}>
              <p className="text-black text-sm text-center">looking for cart it's up there</p>
              {/* Speech bubble tail - left side */}
              <div className="absolute bottom--2 left-8 w-0 h-0" style={{
                bottom: '-8px',
                borderRight: '12px solid transparent',
                borderLeft: '0px solid transparent',
                borderTop: '12px solid white'
              }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
