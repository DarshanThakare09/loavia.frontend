"use client";

import Image from "next/image";

export default function ProductsPage() {
  return (
    <div className="bg-brand-cream min-h-screen py-20 px-6">

      {/* Heading */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-5xl font-serif font-bold text-brand-brown mb-6">
          Our Products
        </h1>

        <p className="text-lg text-brand-text-secondary leading-relaxed">
          Discover our delicious range of premium millet cookies crafted with wholesome ingredients,
          rich flavours, and freshly baked goodness.
        </p>
      </div>

      {/* Product List */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {[
          "Chocolate Millet Cookies",
          "Almond Jaggery Millet Cookies",
          "Jeera Millet Cookies",
          "Coconut Millet Cookies",
          "Choco Crunch Millet Cookies",
          "Cheese Chilly Millet Cookies",
          "Nut Overload Millet Cookies",
          "Walnut Millet Cookies",
          "Multi Millet Cardamom Cookies",
          "Teekha Masala Millet Cookies",
          "Finger Bite Millet Cookies",
          "Kesar Ilaayachee Millet Cookies",
          "Multi Millet Butter Cookies",
          "Lemon Berry Millet Cookies",
          "Millet Nankhatai"
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition"
          >
            <h2 className="text-xl font-semibold text-brand-brown mb-2">
              {index + 1}. {item}
            </h2>
          </div>
        ))}

      </div>

      {/* Highlights */}
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <h2 className="text-3xl font-bold text-brand-brown mb-6">
          Product Highlights
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-brand-text-secondary font-medium">
          <span>✅ No Maida</span>
          <span>✅ No Preservatives</span>
          <span>✅ Freshly Baked</span>
          <span>✅ Premium Ingredients</span>
          <span>✅ High Fiber</span>
        </div>
      </div>

    </div>
  );
}