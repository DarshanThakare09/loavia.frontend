"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! Our support team will contact you soon.");
  };

  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-4">Get in Touch</h1>
          <p className="text-brand-text-secondary text-lg max-w-2xl mx-auto">Have a question about your order, want to inquire about catering, or just want to say hello? We'd love to hear from you.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-brand-light p-8 rounded-3xl border border-brand-brown/5">
              <h3 className="font-bold text-brand-brown text-xl mb-6">Contact Info</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-brand-gold flex-shrink-0" />
                  <div>
                    <p className="font-bold text-brand-brown">Email Us</p>
                    <p className="text-brand-text-secondary mt-1">hello@loavia.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-brand-gold flex-shrink-0" />
                  <div>
                    <p className="font-bold text-brand-brown">Call Us</p>
                    <p className="text-brand-text-secondary mt-1">+91 98765 43210<br/><span className="text-xs">Mon-Sat, 9am to 6pm IST</span></p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-brand-gold flex-shrink-0" />
                  <div>
                    <p className="font-bold text-brand-brown">Visit Us</p>
                    <p className="text-brand-text-secondary mt-1">LOAVIA Bakery Kitchen<br/>Bandra West, Mumbai<br/>Maharashtra 400050</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <form className="bg-white p-8 rounded-3xl shadow-lg border border-brand-brown/5 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">First Name</label>
                  <input type="text" required className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Last Name</label>
                  <input type="text" required className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Email Address</label>
                <input type="email" required className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
              </div>
              
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Subject</label>
                <select className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300 appearance-none">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Corporate Gifting / Bulk Orders</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Message</label>
                <textarea required rows={5} className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown resize-none shadow-sm transition-all duration-300"></textarea>
              </div>

              <button type="submit" className="flex items-center justify-center space-x-2 px-8 py-4 font-bold text-white bg-brand-brown rounded-xl hover:bg-brand-gold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
