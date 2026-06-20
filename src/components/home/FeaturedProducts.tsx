"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
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

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#5C4033] mb-4">
          {featuredProductsTitle}
        </h2>

        <p className="text-gray-600 max-w-3xl mx-auto mb-10">
          {featuredProductsSubtitle}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {mounted &&
            products.map((product) => (
              <div
                key={product.id}
                className="bg-[#F8F5F2] p-8 rounded-2xl shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white mb-5">
                    <Image
                      src={product.primaryImage || product.images?.[0] || product.image || "/premium_cookie.png"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#5C4033] px-3 py-1 text-xs font-semibold text-white">
                      {product.featuredBadgeText || "Featured"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#5C4033] mb-3 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <Link
                  href={`/product/${product.id}`}
                  className="mt-4 font-medium text-[#5C4033] hover:text-[#7A5A4B]"
                >
                  View Details
                </Link>
              </div>
            ))}
          {!mounted && (
            <div className="col-span-3 text-gray-500 py-10">
              Loading featured products...
            </div>
          )}
          {mounted && products.length === 0 && (
            <div className="col-span-3 text-gray-500 py-10">
              No featured products are available right now.
            </div>
          )}
        </div>

        <Link
          href="/shop"
          className="px-8 py-4 bg-[#5C4033] text-white rounded-full hover:bg-[#7A5A4B] transition"
        >
          {featuredProductsCtaText}
        </Link>
      </div>
    </section>
  );
}
