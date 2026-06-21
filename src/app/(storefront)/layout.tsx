"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MiniCart } from "@/components/layout/MiniCart";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MockService } from "@/services/mockService";
import { useProductStore } from "@/store/productStore";
import { useSiteStore } from "@/store/siteStore";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showGlobalNavbar = pathname !== "/";

  const setProducts = useProductStore((state) => state.setProducts);
  const updateCategories = useSiteStore((state) => state.updateCategories);
  const setReviews = useSiteStore((state) => state.setReviews);

  useEffect(() => {
    async function loadData() {
      try {
        const [products, categories, reviews] = await Promise.all([
          MockService.products.getProducts(),
          MockService.categories.getCategories(),
          MockService.reviews.getReviews(),
        ]);
        setProducts(products);
        updateCategories(categories);
        setReviews(reviews);
      } catch (err) {
        console.error("Failed to load initial storefront data", err);
      }
    }
    loadData();
  }, [setProducts, updateCategories, setReviews]);

  return (
    <>
      {showGlobalNavbar && <Navbar />}
      <MiniCart />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
