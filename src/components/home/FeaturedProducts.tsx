"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useProductStore } from "@/store/productStore";
import { useSiteStore } from "@/store/siteStore";

export default function FeaturedProducts() {
  const { products: storeProducts } = useProductStore();
  const {
    featuredProductsTitle,
    featuredProductsSubtitle,
    featuredProductsCtaText,
  } = useSiteStore();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
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

  const products = mounted
    ? storeProducts
        .filter((product) => product.isFeatured)
        .sort((a, b) => {
          const orderA = Number(a.featuredOrder) || 999;
          const orderB = Number(b.featuredOrder) || 999;
          return orderA - orderB;
        })
    : [];

  const titleText = featuredProductsTitle || "Featured Products";
  const words = titleText.trim().split(/\s+/);
  const part1 = words[0] || "Featured";
  const part2 = words.slice(1).join(" ") || "Products";

  const descriptionText = featuredProductsSubtitle || "Explore our handcrafted selection of healthy, delicious treats baked to perfection.";

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
        .featured-product-card {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(92, 51, 23, 0.1);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .featured-product-card::after {
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
          pointer-events: none;
        }
        .featured-product-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 20px 40px rgba(92, 51, 23, 0.12);
          border-color: rgba(160, 119, 42, 0.4);
        }
        .featured-product-card:hover::after {
          left: 150%;
          transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center">
        <div className={`w-full lg:w-[52%] xl:w-[48%] flex flex-col justify-center text-left py-6 lg:py-12 transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98] pointer-events-none"
        }`}>
          <h2 
            style={{ fontFamily: "'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2"
          >
            <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">{part1}</span>
            <span className="text-brand-brown text-7xl md:text-8xl lg:text-[8rem]">{part2}</span>
          </h2>

          <p className="font-sans text-brand-text-secondary text-sm md:text-base lg:text-lg mb-8 leading-relaxed max-w-2xl font-light">
            {descriptionText}
          </p>

          <div className="flex flex-col space-y-4 w-full">
            {mounted && products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group featured-product-card rounded-2xl p-4 flex flex-row items-center space-x-4 cursor-pointer"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white flex-shrink-0">
                  <Image
                    src={product.image || "/premium_cookie.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {product.featuredBadgeText && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-brown px-2 py-0.5 text-[9px] font-semibold text-white">
                      {product.featuredBadgeText}
                    </span>
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-brand-brown group-hover:text-brand-gold transition-colors duration-300 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mt-1 font-light">
                      {product.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-xs md:text-sm font-semibold text-brand-brown group-hover:text-brand-gold transition-colors duration-300">
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}

            {mounted && products.length === 0 && (
              <div className="text-brand-brown py-4 font-sans text-sm">
                No featured products are available right now.
              </div>
            )}
            
            {!mounted && (
              <div className="text-brand-brown py-4 font-sans text-sm">
                Loading featured products...
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center px-8 py-4 bg-brand-brown text-white font-semibold rounded-full hover:bg-brand-gold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {featuredProductsCtaText || "Shop All Products"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
