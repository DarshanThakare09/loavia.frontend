"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MessageCircle, Send, MapPin } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

// Custom SVG components for social icons that are missing or throw errors in this lucide-react version
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export function Footer() {
  const { instagramUrl, facebookUrl } = useSettingsStore();
  const instagramHref = instagramUrl || "https://instagram.com/loavia_cookies";
  const facebookHref = facebookUrl || "https://facebook.com/loavia";

  return (
    <footer className="relative bg-gradient-to-b from-[#2E190E] to-[#1C0F08] text-brand-cream pt-20 pb-10 mt-auto border-t border-brand-gold/30">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand-gold/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info & Newsletter (Col span 2) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block mb-6">
                <Image 
                  src="/loavia-logo.png" 
                  alt="LOAVIA Logo" 
                  width={150} 
                  height={50} 
                  className="h-auto w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              </Link>
              <p className="text-sm opacity-75 leading-relaxed mb-8 max-w-sm font-sans font-light">
                Wholesome, delicious, and premium millet cookies crafted with love — where traditional Indian grains meet modern indulgence.
              </p>
            </div>
            
            
          </div>

          {/* Quick Links Column (Shop) */}
          <div className="col-span-1">
            <h4 className="font-bold text-base mb-6 font-serif text-brand-gold tracking-wide">Shop</h4>
            <ul className="space-y-3.5 text-sm font-sans font-light">
              <li>
                <Link href="/shop" className="opacity-75 hover:opacity-100 hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">
                  All Cookies
                </Link>
              </li>
              <li>
                <Link href="/build-box" className="opacity-75 hover:opacity-100 hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">
                  Build Your Box
                </Link>
              </li>
              <li>
                <Link href="/gift" className="opacity-75 hover:opacity-100 hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">
                  Gifts & Hampers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=classic" className="opacity-75 hover:opacity-100 hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">
                  Classic Millet Range
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links Column */}
          <div className="col-span-1">
            <h4 className="font-bold text-base mb-6 font-serif text-brand-gold tracking-wide">Company</h4>
            <ul className="space-y-3.5 text-sm font-sans font-light">
              <li>
                <Link href="/about" className="opacity-75 hover:opacity-100 hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about#ingredients" className="opacity-75 hover:opacity-100 hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">
                  Pure Ingredients
                </Link>
              </li>
              <li>
                <Link href="/contact" className="opacity-75 hover:opacity-100 hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">
                  Contact Us
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Contact & Social Column */}
          <div className="col-span-1">
            <h4 className="font-bold text-base mb-6 font-serif text-brand-gold tracking-wide">Get in Touch</h4>
            <ul className="space-y-4 text-sm font-sans font-light mb-8">
              <li className="flex items-start space-x-3 opacity-75">
                <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span className="leading-snug">Akshar Foods, Nashik, Maharashtra, India</span>
              </li>
              <li className="flex items-center space-x-3 opacity-75">
                <Mail className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <a href="mailto:hello@loavia.com" className="hover:text-brand-gold transition-colors">hello@loavia.com</a>
              </li>
              <li className="flex items-center space-x-3 opacity-75">
                <Phone className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-brand-gold transition-colors">+91 98765 43210</a>
              </li>
            </ul>

            {/* Social Icons Deck */}
            <div className="flex space-x-3">
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-cream hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-cream hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/917796116622"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-cream hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all duration-300 transform hover:-translate-y-1"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-60 font-sans font-light">
          <p className="text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Akshar Foods (LOAVIA™). All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-brand-gold transition-colors">Shipping Info</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
