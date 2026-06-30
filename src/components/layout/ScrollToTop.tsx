"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable automatic browser scroll restoration on back/forward
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    }

    // Force immediate scroll reset to the top of the viewport
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handlePopState = () => {
      // Force scroll to top on back/forward browser navigation
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}
