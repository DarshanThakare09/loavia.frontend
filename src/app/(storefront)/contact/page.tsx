"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Send, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Instagram custom icon
const InstagramIcon = () => (
  <svg
    className="w-5 h-5 text-pink-500 transition-transform duration-300 group-hover:scale-110"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.5" />
  </svg>
);

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    if (!mounted) return;

    // Hero Entry Animation
    const tl = gsap.timeline();
    tl.fromTo(".hero-bg",
      { scale: 1.12, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 1.8, ease: "power3.out" }
    )
    .fromTo(".hero-text-el",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.15 },
      "-=1.4"
    );

    // Form Section Entrance
    gsap.fromTo(".form-container-el",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact-grid-section",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Contact Details Cards Entrance
    gsap.fromTo(".info-card-el",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact-grid-section",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, { dependencies: [mounted], scope: containerRef });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all form fields.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent successfully. We will get back to you shortly.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div ref={containerRef} className="bg-[#FDFBF7] min-h-screen pb-24 overflow-x-hidden">
      
      {/* HERO SECTION */}
      <div className="relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[550px] flex items-center overflow-hidden z-0 shadow-inner">
        <Image
          src="/contact-hero-bg.png"
          alt="Contact LOAVIA"
          fill
          priority
          className="hero-bg object-cover object-[center_35%] md:object-center"
        />
        
        {/* Dark radial overlay starting top right, fading out to bottom and left */}
        <div
          style={{
            background: "radial-gradient(ellipse at top right, rgba(46, 25, 14, 0.95) 0%, rgba(46, 25, 14, 0.8) 35%, rgba(46, 25, 14, 0.4) 65%, rgba(46, 25, 14, 0) 85%)"
          }}
          className="absolute inset-0 z-1"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="w-full md:w-[52%] lg:w-[48%] flex flex-col items-start text-left py-12 md:py-0">
            <h1
              style={{
                fontFamily: "'Amsterdam Signature', 'Playfair Display', serif",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
              }}
              className="hero-text-el text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] font-normal leading-[0.85] mb-2"
            >
              <span className="text-brand-cream">Get in</span>
              <br />
              <span className="text-[#E29B52]">Touch</span>
            </h1>
            
            <div className="hero-text-el w-[120px] h-[2px] bg-[#E29B52] my-4 opacity-85"></div>
            
            <p
              style={{
                fontFamily: "'Outfit', 'Proxima Nova', 'Montserrat', sans-serif",
                textShadow: "0 1px 4px rgba(0, 0, 0, 0.2)"
              }}
              className="hero-text-el text-xs md:text-sm font-medium tracking-[3px] text-brand-cream/90 uppercase leading-relaxed mb-8 whitespace-pre-wrap"
            >
              We'd love to hear from you. Reach out for orders, gifting, or business opportunities.
            </p>
            
            <button
              onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: 'smooth' })}
              className="hero-text-el inline-flex items-center justify-center px-8 py-4 text-sm md:text-base font-bold text-brand-cream bg-[#E29B52] rounded-full hover:bg-white hover:text-brand-brown transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
            >
              Send Us A Message
            </button>
          </div>
        </div>
      </div>

      {/* CONTACT GRID SECTION */}
      <div id="contact-section" className="contact-grid-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: Contact Form */}
          <div className="form-container-el lg:col-span-7 bg-white p-8 md:p-10 rounded-[2.5rem] border border-brand-brown/10 shadow-[0_8px_30px_rgba(92,51,23,0.03)]">
            <span className="text-brand-gold font-sans font-bold text-xs uppercase tracking-[3px] mb-2 block">Connect Instantly</span>
            <h2 className="text-3xl font-serif font-bold text-brand-brown mb-6">Drop Us A Message</h2>
            <div className="w-12 h-[2px] bg-brand-gold mb-8"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col text-left">
                  <label className="text-xs font-semibold text-brand-brown mb-2 pl-2">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-brand-brown/10 rounded-2xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none text-sm font-sans"
                    required
                  />
                </div>
                <div className="flex flex-col text-left">
                  <label className="text-xs font-semibold text-brand-brown mb-2 pl-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-brand-brown/10 rounded-2xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none text-sm font-sans"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold text-brand-brown mb-2 pl-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Inquiry topic (e.g. Bulk Gifting, Orders)"
                  className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-brand-brown/10 rounded-2xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none text-sm font-sans"
                  required
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold text-brand-brown mb-2 pl-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-brand-brown/10 rounded-2xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none text-sm font-sans resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-brand-gold rounded-full hover:bg-brand-brown hover:scale-101 active:scale-99 transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-brand-gold/50 cursor-pointer"
              >
                <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>

          {/* RIGHT: Contact Info */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <span className="text-brand-gold font-sans font-bold text-xs uppercase tracking-[3px] mb-2 block">Our Info</span>
            <h2
              style={{ fontFamily: "'Amsterdam Signature', serif" }}
              className="font-normal leading-none mb-8 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2"
            >
              <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">Our</span>
              <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">Details</span>
            </h2>

            <div className="w-full space-y-6">
              
              {/* PHONE */}
              <a 
                href="tel:+917796116622"
                className="info-card-el group flex items-center gap-5 bg-white p-5 rounded-[2rem] border border-brand-brown/10 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:border-brand-gold/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">Phone Number</p>
                  <p className="text-lg font-serif font-bold text-brand-brown mt-0.5">+91 7796116622</p>
                </div>
              </a>

              {/* EMAIL */}
              <a 
                href="mailto:info@loavia.com"
                className="info-card-el group flex items-center gap-5 bg-white p-5 rounded-[2rem] border border-brand-brown/10 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:border-brand-gold/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">Email Address</p>
                  <p className="text-lg font-serif font-bold text-brand-brown mt-0.5">info@loavia.com</p>
                </div>
              </a>

              {/* LOCATION */}
              <div 
                className="info-card-el group flex items-center gap-5 bg-white p-5 rounded-[2rem] border border-brand-brown/10 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:border-brand-gold/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">Office Location</p>
                  <p className="text-lg font-serif font-bold text-brand-brown mt-0.5">Nashik, Maharashtra</p>
                </div>
              </div>

              {/* WHATSAPP */}
              <a 
                href="https://wa.me/917796116622"
                target="_blank"
                rel="noopener noreferrer"
                className="info-card-el group flex items-center gap-5 bg-white p-5 rounded-[2rem] border border-brand-brown/10 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:border-brand-gold/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-500">WhatsApp Orders</p>
                  <p className="text-lg font-serif font-bold text-brand-brown mt-0.5 flex items-center gap-1.5">
                    <span>Chat Now</span>
                    <ArrowRight className="w-4 h-4 text-brand-brown/40 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </a>

            </div>
          </div>

        </div>

        {/* INSTAGRAM BANNER */}
        <div className="mt-20 flex justify-center">
          <a
            href="https://instagram.com/loavia_cookies"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full border border-brand-brown/10 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:border-brand-gold/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <InstagramIcon />
            <span className="font-semibold text-brand-brown group-hover:text-brand-gold transition-colors font-sans tracking-wide">
              LOAVIA_COOKIES
            </span>
          </a>
        </div>

      </div>

    </div>
  );
}