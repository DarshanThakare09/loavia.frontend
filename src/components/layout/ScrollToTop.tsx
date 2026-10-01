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
      // Clean up any legacy or stale service workers registered on this origin
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
    }

    const isPopstate = typeof window !== "undefined" && sessionStorage.getItem("is_popstate") === "true";
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("is_popstate");
    }

    const prevPathname = typeof window !== "undefined" ? sessionStorage.getItem("current_pathname") || "" : "";
    
    let shouldSkipScroll = false;
    if (
      pathname === "/" &&
      prevPathname === "/build-box" &&
      isPopstate &&
      typeof window !== "undefined" &&
      sessionStorage.getItem("restore_home_scroll") === "true"
    ) {
      shouldSkipScroll = true;
    }

    if (!shouldSkipScroll) {
      window.scrollTo(0, 0);
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("prev_pathname", prevPathname);
      sessionStorage.setItem("current_pathname", pathname);
    }
  }, [pathname]);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("is_popstate", "true");
        
        // Skip forcing scroll to top on back/forward if we are returning to home from build-box
        const prevPathname = sessionStorage.getItem("current_pathname") || "";
        const restoreHomeScroll = sessionStorage.getItem("restore_home_scroll") === "true";
        if (window.location.pathname === "/" && prevPathname === "/build-box" && restoreHomeScroll) {
          return;
        }
      }

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
