"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Search, User, ShoppingCart, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useProductStore } from "@/store/productStore";
import { useSiteStore } from "@/store/siteStore";
import { catalogService } from "@/services/catalogService";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { items, openMiniCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { products } = useProductStore();
  const { announcementText } = useSiteStore();

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Layout refs to avoid layout thrashing on scroll
  const transitionStartRef = useRef(15 * 800);
  const heroEndRef = useRef(16.8 * 800);

  // Update navbar height CSS variable and layout dimensions on mount and resize
  useEffect(() => {
    const updateLayout = () => {
      const rect = navbarRef.current?.getBoundingClientRect();
      if (rect) {
        document.documentElement.style.setProperty("--navbar-height", `${rect.height}px`);
      }

      const vh = window.innerHeight;
      const vw = window.innerWidth;

      transitionStartRef.current = 15 * vh;

      if (vw >= 1024) {
        heroEndRef.current = 16.8 * vh;
      } else {
        heroEndRef.current = 15 * vh;
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, [pathname]);

  // High performance direct DOM scroll positioning
  useEffect(() => {
    const handleScroll = () => {
      const navbarEl = navbarRef.current;
      if (!navbarEl) return;

      const currentScrollY = window.scrollY;
      const vh = window.innerHeight;
      const isHomepage = window.location.pathname === "/";

      const transitionStart = transitionStartRef.current;
      const heroEnd = heroEndRef.current;

      if (isHomepage) {
        if (currentScrollY < transitionStart - vh) {
          navbarEl.style.position = "sticky";
          navbarEl.style.top = "0px";
          navbarEl.style.opacity = "0";
          navbarEl.style.pointerEvents = "none";
          navbarEl.style.transition = "opacity 0.2s ease";
        } else if (currentScrollY >= transitionStart - vh && currentScrollY < heroEnd) {
          navbarEl.style.position = "sticky";
          navbarEl.style.top = "0px";
          navbarEl.style.opacity = "1";
          navbarEl.style.pointerEvents = "auto";
          navbarEl.style.transition = "opacity 0.2s ease";
        } else {
          navbarEl.style.position = "sticky";
          navbarEl.style.opacity = "1";
          navbarEl.style.pointerEvents = "auto";
          const dY = currentScrollY - heroEnd;
          const topVal = Math.max(-32, -dY);
          navbarEl.style.top = `${topVal}px`;
          navbarEl.style.transition = "none";
        }
      } else {
        navbarEl.style.opacity = "1";
        navbarEl.style.pointerEvents = "auto";
        if (currentScrollY < 32) {
          navbarEl.style.position = "sticky";
          navbarEl.style.top = `${-currentScrollY}px`;
          navbarEl.style.transition = "none";
        } else {
          navbarEl.style.position = "sticky";
          navbarEl.style.top = "-32px";
          navbarEl.style.transition = "none";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (!mounted) return;
    const delayDebounceFn = setTimeout(async () => {
      try {
        const query = searchQuery.trim();
        const res = await catalogService.getProducts({
          search: query || undefined,
          limit: 4
        });
        setSearchResults(res.products);
      } catch (err) {
        console.error("Failed to load search results", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, mounted]);

  const totalItems = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const authLink = mounted && isAuthenticated ? "/profile" : "/auth";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div
      ref={navbarRef}
      className="left-0 right-0 z-40 sticky-nav-container"
      style={{
        position: "sticky",
        top: 0,
      }}
    >
      {/* Announcement Bar */}
      {announcementText && (
        <div className="bg-[#2E190E] text-brand-gold text-[11px] sm:text-xs font-semibold py-1.5 tracking-widest flex w-full relative z-50 border-b border-brand-gold/10">
          <marquee scrollamount="6" className="w-full font-sans" onMouseOver={(e: any) => e.target.stop()} onMouseOut={(e: any) => e.target.start()}>
            {announcementText}
          </marquee>
        </div>
      )}

      {/* Main Glassmorphic Header */}
      <header className="relative bg-[#FDFBF7]/85 backdrop-blur-md border-b border-brand-brown/10 shadow-[0_4px_30px_rgba(92,51,23,0.03)] transition-all duration-300">

        {/* Subtle decorative bottom glow line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Left Brand Logo */}
            <div className="flex-1 flex justify-start items-center">
              <Link href="/" className="relative w-[290px] h-[110px] transition-transform duration-500 hover:scale-103 block">
                <Image
                  src="/loavia-logo.png"
                  alt="LOAVIA Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 150px, 290px"
                />
              </Link>
            </div>

            {/* Center Navigation Links (Pill Style) */}
            <nav className="hidden md:flex justify-center space-x-2 shrink-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 text-sm font-sans font-medium rounded-full transition-all duration-300 relative group flex items-center justify-center ${isActive
                      ? "text-[#5C3317] bg-[#5C3317]/5 font-semibold"
                      : "text-[#5C3317]/80 hover:text-[#5C3317] hover:bg-[#5C3317]/5"
                      }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-1.5 w-1 h-1 bg-brand-gold rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex-1 flex justify-end items-center">
              <div className="flex items-center space-x-2 md:space-x-4 text-brand-brown">

                {/* Search Toggle */}
                <div className="relative" ref={searchRef}>
                  <button
                    aria-label="Search"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#5C3317]/5 transition-all duration-300 ${isSearchOpen ? "text-brand-gold bg-[#5C3317]/5" : "text-brand-brown hover:text-brand-gold"
                      }`}
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  {/* Glassmorphic Search Dropdown */}
                  {isSearchOpen && (
                    <div className="absolute right-0 top-full mt-4 w-80 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border border-brand-brown/10 overflow-hidden z-50 p-4 transform origin-top-right transition-all duration-300">
                      <div className="relative mb-3">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                        <input
                          type="text"
                          placeholder="Search cookies..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-brand-brown/5 border border-brand-brown/10 rounded-2xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none text-sm font-sans"
                          autoFocus
                        />
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-1">
                        {searchResults.length > 0 ? (
                          searchResults.map(product => (
                            <button
                              key={product.id}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                                router.push(`/product/${product.slug || product.id}`);
                              }}
                              className="w-full text-left p-2 hover:bg-[#5C3317]/5 rounded-xl flex items-center space-x-3 transition-colors duration-200"
                            >
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-brand-light flex-shrink-0 border border-brand-brown/5">
                                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-sm font-semibold text-[#5C3317] truncate">{product.name}</p>
                                <p className="text-xs text-brand-gold font-medium mt-0.5">₹{product.price}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-brand-brown/40" />
                            </button>
                          ))
                        ) : (
                          <div className="py-6 text-center text-xs text-brand-text-secondary italic">
                            No cookies found.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Button */}
                <Link
                  href={authLink}
                  aria-label="Account"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#5C3317]/5 text-brand-brown hover:text-brand-gold transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Cart Button */}
                <button
                  onClick={openMiniCart}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#5C3317]/5 text-brand-brown hover:text-brand-gold transition-all duration-300 relative"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-brand-gold text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#5C3317]/5 text-brand-brown hover:text-brand-gold transition-all duration-300"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (Slide-in right drawer) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`fixed top-0 right-0 bottom-0 w-[300px] bg-[#FDFBF7] z-50 shadow-2xl p-6 flex flex-col justify-between transition-transform duration-500 ease-out md:hidden transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div>
          {/* Drawer Header */}
          <div className="flex justify-between items-center pb-6 border-b border-brand-brown/10 mb-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="relative w-[130px] h-[45px]">
              <Image src="/loavia-logo.png" alt="LOAVIA Logo" fill className="object-contain" sizes="130px" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#5C3317]/5 text-brand-brown transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <input
              type="text"
              placeholder="Search cookies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-brand-brown/5 border border-brand-brown/10 rounded-2xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none text-sm font-sans"
            />
            {searchQuery.trim() !== "" && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-brand-brown/10 overflow-hidden z-50 max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map(product => (
                    <button
                      key={product.id}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setSearchQuery("");
                        router.push(`/product/${product.slug || product.id}`);
                      }}
                      className="w-full text-left p-2.5 hover:bg-[#5C3317]/5 flex items-center space-x-3 transition-colors duration-200"
                    >
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-brand-light flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="32px" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-semibold text-[#5C3317] truncate">{product.name}</p>
                        <p className="text-[10px] text-brand-gold font-medium">₹{product.price}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-brand-text-secondary italic">No cookies found.</div>
                )}
              </div>
            )}
          </div>

          {/* Drawer Link List */}
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-3 rounded-2xl text-base font-sans font-medium transition-all duration-200 flex justify-between items-center ${isActive
                    ? "text-[#5C3317] bg-[#5C3317]/5 font-semibold"
                    : "text-[#5C3317]/80 hover:text-[#5C3317] hover:bg-[#5C3317]/5"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{link.name}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-brand-gold translate-x-0.5" : "text-brand-brown/20"}`} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="border-t border-brand-brown/10 pt-6 mt-auto">
          <div className="flex justify-between items-center">
            <Link
              href={authLink}
              className="flex items-center space-x-2 text-[#5C3317] hover:text-brand-gold transition-colors font-sans font-medium text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              <span>{mounted && isAuthenticated ? "My Account" : "Login / Signup"}</span>
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openMiniCart();
              }}
              className="flex items-center space-x-2 text-[#5C3317] hover:text-brand-gold transition-colors font-sans font-medium text-sm"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
