"use client";

import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

// Instagram custom icon (FIXED - lucide doesn't have Instagram)
const InstagramIcon = () => (
  <svg
    className="w-5 h-5 text-pink-500"
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
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-20">

      <div className="max-w-4xl w-full text-center">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-4">
          Contact Us
        </h1>

        <p className="text-brand-text-secondary text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          We would love to hear from you! Whether you want to place an order,
          inquire about gifting, or become a distributor, feel free to connect with us.
        </p>

        {/* CONTACT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PHONE */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
            <Phone className="w-6 h-6 text-brand-gold" />
            <div className="text-left">
              <p className="font-bold text-brand-brown">Phone</p>
              <p className="text-brand-text-secondary">+91 7796116622</p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
            <Mail className="w-6 h-6 text-brand-gold" />
            <div className="text-left">
              <p className="font-bold text-brand-brown">Email</p>
              <p className="text-brand-text-secondary">info@loavia.com</p>
            </div>
          </div>

          {/* LOCATION */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
            <MapPin className="w-6 h-6 text-brand-gold" />
            <div className="text-left">
              <p className="font-bold text-brand-brown">Location</p>
              <p className="text-brand-text-secondary">Nashik, Maharashtra</p>
            </div>
          </div>

          {/* WHATSAPP */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
            <MessageCircle className="w-6 h-6 text-green-500" />
            <div className="text-left">
              <p className="font-bold text-brand-brown">WhatsApp Orders</p>
              <p className="text-brand-text-secondary">Available</p>
            </div>
          </div>

        </div>

        {/* INSTAGRAM */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow hover:shadow-lg transition">
            <InstagramIcon />
            <span className="font-medium text-brand-brown">
              LOAVIA_COOKIES
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}