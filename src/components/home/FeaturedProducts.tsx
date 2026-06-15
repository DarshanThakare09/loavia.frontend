"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useProductStore } from "@/store/productStore";

export default function FeaturedProducts() {
  const { products: storeProducts } = useProductStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const products = mounted ? storeProducts : [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#5C4033] mb-4">
          Featured Products
        </h2>

        <p className="text-gray-600 max-w-3xl mx-auto mb-10">
          Explore our most loved millet cookies crafted for tea-time
          indulgence, healthy snacking, and premium gifting.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {mounted && products.slice(0, 3).map((product) => (
            <div key={product.id} className="bg-[#F8F5F2] p-8 rounded-2xl shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#5C4033] mb-3 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              </div>
              <Link href={`/product/${product.id}`} className="mt-4 font-medium text-[#5C4033] hover:text-[#7A5A4B]">
                View Details →
              </Link>
            </div>
          ))}
          {(!mounted || products.length === 0) && (
            <div className="col-span-3 text-gray-500 py-10">Loading featured products...</div>
          )}
        </div>

        <Link
          href="/shop"
          className="px-8 py-4 bg-[#5C4033] text-white rounded-full hover:bg-[#7A5A4B] transition"
        >
          Explore Products
        </Link>
      </div>
    </section>
  );
}