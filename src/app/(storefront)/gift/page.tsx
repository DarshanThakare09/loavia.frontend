"use client";

import Image from "next/image";
import Link from "next/link";
import { Gift, CalendarHeart, PenTool, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function GiftPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your inquiry has been sent! We'll get back to you shortly.");
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="relative rounded-[3rem] overflow-hidden bg-brand-brown mb-12 shadow-xl border border-brand-brown/10">
          <div className="absolute inset-0 z-0">
            <Image src="/cookie_gift_box.png" alt="Gifting" fill className="object-cover opacity-40 mix-blend-overlay" sizes="(max-width: 1024px) 100vw, 70vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-brown via-brand-brown/85 to-transparent"></div>
          </div>
          <div className="relative z-10 p-12 md:p-20 lg:w-2/3">
            <Gift className="w-12 h-12 text-brand-gold mb-6" />
            <h1
              style={{ fontFamily: "'Amsterdam Signature', serif" }}
              className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[0.9] text-brand-cream mb-6"
            >
              <span className="text-brand-gold block text-2xl md:text-3xl font-sans font-bold uppercase tracking-[3px] mb-2">Corporate &</span>
              <span className="block">Personal Gifting</span>
            </h1>
            <p className="text-brand-cream/80 text-base md:text-lg leading-relaxed mb-8 font-sans font-light">
              Make their day with a box of premium LOAVIA cookies. We offer elegant packaging, personalized handwritten notes, and bulk ordering for corporate events.
            </p>
            <Link 
              href="/build-box" 
              className="inline-block px-8 py-4 font-bold text-brand-brown bg-brand-gold rounded-full hover:bg-white hover:text-brand-brown transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
            >
              Send a Gift Box
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 font-sans">
          <div className="bg-white p-8 rounded-[2.5rem] border border-brand-brown/5 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:shadow-[0_20px_50px_rgba(92,51,23,0.06)] hover:-translate-y-1 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
              <CalendarHeart className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-brand-brown mb-4">Any Occasion</h3>
            <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed font-light">Birthdays, anniversaries, holidays, or just because. A LOAVIA box is always the right answer.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-brand-brown/5 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:shadow-[0_20px_50px_rgba(92,51,23,0.06)] hover:-translate-y-1 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
              <PenTool className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-brand-brown mb-4">Personalized Notes</h3>
            <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed font-light">Add a custom message at checkout. We'll handwrite it on premium cardstock for that personal touch.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-brand-brown/5 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:shadow-[0_20px_50px_rgba(92,51,23,0.06)] hover:-translate-y-1 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-brand-brown mb-4">Corporate Orders</h3>
            <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed font-light">Show appreciation to your clients or team. We handle bulk shipping to multiple addresses seamlessly.</p>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(92,51,23,0.04)] border border-brand-brown/5 flex flex-col md:flex-row">
          <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
            <span className="text-brand-gold font-sans font-bold text-xs uppercase tracking-[3px] mb-2 block">Bulk Inquiries</span>
            <h2
              style={{ fontFamily: "'Amsterdam Signature', serif" }}
              className="font-normal leading-none mb-6 pt-2 pb-2 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-3 gap-y-1"
            >
              <span className="text-brand-gold text-xl md:text-2xl">Inquire About</span>
              <span className="text-brand-brown text-5xl md:text-6xl">Bulk Orders</span>
            </h2>
            <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed font-sans font-light mb-8">
              Need to send gifts to 10 or more addresses? Fill out the form below and our concierge team will take care of everything.
            </p>
            
            <form className="space-y-4 font-sans" onSubmit={handleSubmit}>
              <input type="text" placeholder="Full Name" required className="w-full bg-[#FDFBF7] border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-2xl py-3 px-5 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
              <input type="email" placeholder="Email Address" required className="w-full bg-[#FDFBF7] border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-2xl py-3 px-5 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
              <input type="text" placeholder="Company Name" className="w-full bg-[#FDFBF7] border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-2xl py-3 px-5 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
              <textarea placeholder="Tell us about your needs (approx volume, dates, etc.)" required rows={4} className="w-full bg-[#FDFBF7] border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-2xl py-3 px-5 outline-none font-medium text-brand-brown resize-none shadow-sm transition-all duration-300"></textarea>
              <button type="submit" className="w-full px-8 py-4 font-bold text-white bg-brand-brown rounded-2xl hover:bg-brand-gold hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
                Submit Inquiry
              </button>
            </form>
          </div>
          <div className="md:w-1/2 relative min-h-[400px] rounded-r-[3rem] overflow-hidden">
            <Image src="/cookie_gift_box.png" alt="Corporate Gifts" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </div>
    </div>
  );
}
