"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useProductStore } from "@/store/productStore";

export default function ProductsPage() {
  const { products: storeProducts } = useProductStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const products = mounted ? storeProducts : [];

  return (
    <div className="bg-brand-cream min-h-screen py-20 px-4">

      {/* INTRO SECTION */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-brown mb-6">
          Our Products
        </h1>

        <p className="text-lg md:text-xl text-brand-text-secondary leading-relaxed">
          Discover our delicious range of premium millet cookies crafted with wholesome ingredients,
          rich flavours, and freshly baked goodness.
        </p>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {mounted && products.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6"
          >
            <h2 className="text-lg font-semibold text-brand-brown mb-2">
              {index + 1}. {item.name}
            </h2>

            <p className="text-sm text-brand-text-secondary">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* HIGHLIGHTS SECTION */}
      <div className="max-w-5xl mx-auto mt-20 text-center">

        <h2 className="text-3xl md:text-4xl font-bold text-brand-brown mb-8">
          Product Highlights
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-brand-text-secondary font-medium">

          <div className="bg-white p-4 rounded-xl shadow">
            ✅ No Maida
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            ✅ No Preservatives
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            ✅ Freshly Baked
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            ✅ Premium Ingredients
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            ✅ High Fiber
          </div>

        </div>
      </div>
      {/* WHY MILLETS SECTION */}
<div className="max-w-5xl mx-auto mt-24 text-center">

  <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-8">
    The Power of Millets
  </h2>

  <p className="text-lg md:text-xl text-brand-text-secondary leading-relaxed text-justify mb-10">
    Millets are ancient super grains packed with essential nutrients, fiber, protein, vitamins, and minerals.
    Naturally gluten-free and low in glycemic index, they support healthy growth in children,
    better digestion and heart health in elders, and overall wellness for everyone.
  </p>

<p className="text-lg md:text-xl text-brand-text-secondary leading-relaxed text-justify mb-10">
    At LOAVIA™, we transform these nutritious grains into delicious cookies that are wholesome,
    satisfying, and enjoyable for the entire family.
  </p>

  {/* BENEFITS GRID */}
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-brand-text-secondary font-medium">

    <div className="bg-white p-4 rounded-xl shadow">
      ✅ Rich in Fiber
    </div>

    <div className="bg-white p-4 rounded-xl shadow">
      ✅ Low GI Index
    </div>

    <div className="bg-white p-4 rounded-xl shadow">
      ✅ Better Digestion
    </div>

    <div className="bg-white p-4 rounded-xl shadow">
      ✅ Nutrient Rich
    </div>

    <div className="bg-white p-4 rounded-xl shadow">
      ✅ Natural Energy Source
    </div>

    <div className="bg-white p-4 rounded-xl shadow">
      ✅ Smart Snacking Choice
    </div>

  </div>

</div>

    </div>
  );
}