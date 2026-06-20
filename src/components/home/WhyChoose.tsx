"use client";

import { useEffect, useState, useRef } from "react";
import { useSiteStore } from "@/store/siteStore";
import { Wheat, ShieldCheck, Sprout, Dumbbell, Flame, Sparkles } from "lucide-react";

const getFeatureIcon = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("maida")) return <Wheat className="w-5 h-5 transition-all duration-300" />;
  if (lower.includes("preservative")) return <ShieldCheck className="w-5 h-5 transition-all duration-300" />;
  if (lower.includes("millet") || lower.includes("natural")) return <Sprout className="w-5 h-5 transition-all duration-300" />;
  if (lower.includes("fiber")) return <Dumbbell className="w-5 h-5 transition-all duration-300" />;
  if (lower.includes("fresh") || lower.includes("baked")) return <Flame className="w-5 h-5 transition-all duration-300" />;
  if (lower.includes("premium") || lower.includes("ingredient")) return <Sparkles className="w-5 h-5 transition-all duration-300" />;
  return (
    <svg className="w-5 h-5 stroke-[2.5] transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
};

export default function WhyChoose() {
  const { whyChooseTitle, whyChooseDescription, whyChooseFeatures } = useSiteStore();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const titleText = whyChooseTitle || "Why Choose Loavia™";
  const loaviaIndex = titleText.toLowerCase().indexOf("loavia");
  let part1 = "Why Choose";
  let part2 = "Loavia™";
  if (loaviaIndex !== -1) {
    part1 = titleText.substring(0, loaviaIndex).trim();
    const loaviaPart = titleText.substring(loaviaIndex);
    if (loaviaPart.endsWith("™")) {
      part2 = loaviaPart.charAt(0).toUpperCase() + loaviaPart.slice(1, -1).toLowerCase() + "™";
    } else {
      part2 = loaviaPart.charAt(0).toUpperCase() + loaviaPart.slice(1).toLowerCase();
    }
  }

  const descriptionText = whyChooseDescription || "At Loavia, we believe healthy snacking should be an indulgent pleasure. Our premium millet cookies are thoughtfully baked using natural grains, rich flavours, and wholesome ingredients to create pure, guilt-free joy in every bite.";

  return (
    <section
      ref={sectionRef}
      className="w-full relative lg:aspect-[1672/941] flex items-center py-20 lg:py-0 overflow-hidden parallax-bg"
    >
      <style>{`
        .parallax-bg {
          background-image: url('/whychooseloavia.png');
          background-size: cover;
          background-position: right center;
          background-repeat: no-repeat;
        }
        @media (min-width: 1024px) {
          .parallax-bg {
            background-attachment: fixed;
          }
        }
        .why-choose-card {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(92, 51, 23, 0.1);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .why-choose-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(92, 51, 23, 0.15) 30%,
            rgba(160, 119, 42, 0.3) 70%,
            transparent 100%
          );
          transform: skewX(-25deg);
        }
        .why-choose-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 20px 40px rgba(92, 51, 23, 0.12);
          border-color: rgba(160, 119, 42, 0.4);
        }
        .why-choose-card:hover::after {
          left: 150%;
          transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center">
        <div className={`w-full lg:w-[52%] xl:w-[48%] flex flex-col justify-center text-left py-6 lg:py-12 transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98] pointer-events-none"
          }`}>
          <h2
            style={{ fontFamily: "'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2"
          >
            <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">{part1}</span>
            <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">{part2}</span>
          </h2>

          <p className="font-sans text-brand-text-secondary text-sm md:text-base lg:text-lg mb-8 leading-relaxed max-w-2xl font-light">
            {descriptionText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {whyChooseFeatures?.map((feature) => (
              <div
                key={feature}
                className="group why-choose-card rounded-2xl p-5 flex items-center space-x-4 cursor-pointer"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                  {getFeatureIcon(feature)}
                </div>
                <span className="font-sans font-semibold text-brand-brown text-sm md:text-base transition-colors duration-300 group-hover:text-brand-gold">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}