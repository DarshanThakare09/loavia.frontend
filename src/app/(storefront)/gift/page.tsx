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
    <div className="bg-brand-light min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="relative rounded-3xl overflow-hidden bg-brand-brown mb-12 shadow-xl">
          <div className="absolute inset-0 z-0">
            <Image src="/cookie_gift_box.png" alt="Gifting" fill className="object-cover opacity-40 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-brown via-brand-brown/80 to-transparent"></div>
          </div>
          <div className="relative z-10 p-12 md:p-20 lg:w-2/3">
            <Gift className="w-12 h-12 text-brand-gold mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Corporate & Personal Gifting</h1>
            <p className="text-brand-cream/80 text-lg leading-relaxed mb-8">
              Make their day with a box of premium LOAVIA cookies. We offer elegant packaging, personalized handwritten notes, and bulk ordering for corporate events.
            </p>
            <Link href="/build-box" className="inline-block px-8 py-4 font-bold text-brand-brown bg-brand-gold rounded-full hover:bg-white transition-colors shadow-lg">
              Send a Gift Box
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-brand-brown/5">
            <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarHeart className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-brand-brown mb-4">Any Occasion</h3>
            <p className="text-brand-text-secondary">Birthdays, anniversaries, holidays, or just because. A LOAVIA box is always the right answer.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-brand-brown/5">
            <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <PenTool className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-brand-brown mb-4">Personalized Notes</h3>
            <p className="text-brand-text-secondary">Add a custom message at checkout. We'll handwrite it on premium cardstock for that personal touch.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-brand-brown/5">
            <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-brand-brown mb-4">Corporate Orders</h3>
            <p className="text-brand-text-secondary">Show appreciation to your clients or team. We handle bulk shipping to multiple addresses seamlessly.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-brown/5 flex flex-col md:flex-row">
          <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
            <h2 className="text-3xl font-serif font-bold text-brand-brown mb-4">Inquire About Bulk Orders</h2>
            <p className="text-brand-text-secondary mb-8">Need to send gifts to 10 or more addresses? Fill out the form below and our concierge team will take care of everything.</p>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input type="text" placeholder="Full Name" required className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
              <input type="email" placeholder="Email Address" required className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
              <input type="text" placeholder="Company Name" className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
              <textarea placeholder="Tell us about your needs (approx volume, dates, etc.)" required rows={4} className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown resize-none shadow-sm transition-all duration-300"></textarea>
              <button type="submit" className="w-full px-8 py-4 font-bold text-white bg-brand-brown rounded-xl hover:bg-brand-gold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Submit Inquiry
              </button>
            </form>
          </div>
          <div className="md:w-1/2 relative min-h-[400px]">
            <Image src="/cookie_gift_box.png" alt="Corporate Gifts" fill className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
