"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MiniCart } from "@/components/layout/MiniCart";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MockService } from "@/services/mockService";
import { catalogService } from "@/services/catalogService";
import { reviewService } from "@/services/reviewService";
import { useProductStore } from "@/store/productStore";
import { useSiteStore } from "@/store/siteStore";

import { useAuthStore } from "@/store/authStore";

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
  const hydrateSession = useAuthStore((state) => state.hydrateSession);

  useEffect(() => {
    async function loadData() {
      try {
        await hydrateSession();
      } catch (err) {
        console.error("Failed to hydrate user session", err);
      }
      try {
        const [productsData, categoriesData, reviews] = await Promise.all([
          catalogService.getProducts({ limit: 100 }),
          catalogService.getCategories(),
          reviewService.getApprovedReviews(),
        ]);
        setProducts(productsData.products);
        
        const mappedCategories = categoriesData.map(cat => ({
          name: cat.name,
          image: cat.image || "/premium_cookie.png",
          link: `/shop?category=${cat.slug}`
        }));
        updateCategories(mappedCategories);

        const mappedReviews = reviews.map((r: any) => ({
          id: r.id,
          customerName: r.user?.name || "Anonymous",
          customerEmail: r.user?.email || "",
          reviewText: r.comment || "",
          rating: r.rating,
          status: (r.status || "APPROVED").toLowerCase() as any,
          featured: false,
          pinned: false,
          createdAt: r.createdAt,
          // Legacy compat for storefront Testimonials component
          name: r.user?.name || "Anonymous",
          role: "Verified Buyer",
          content: r.comment || "",
        }));

        setReviews(mappedReviews);
      } catch (err) {
        console.error("Failed to load initial storefront data from backend", err);
      }
    }
    loadData();
  }, [setProducts, updateCategories, setReviews, hydrateSession]);

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

