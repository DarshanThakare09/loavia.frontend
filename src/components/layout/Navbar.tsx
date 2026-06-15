"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useProductStore } from "@/store/productStore";
import { useSiteStore } from "@/store/siteStore";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { items, openMiniCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { products } = useProductStore();
  const { announcementText } = useSiteStore();
  
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim() === "" 
    ? products.slice(0, 4) 
    : products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4);

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
    <>
      {/* Announcement Bar */}
      {announcementText && (
        <div className="bg-brand-brown text-brand-gold text-[11px] sm:text-xs font-medium py-1.5 tracking-wider flex w-full relative z-50">
          <marquee scrollamount="10" className="w-full" onMouseOver={(e: any) => e.target.stop()} onMouseOut={(e: any) => e.target.start()}>
            {announcementText}
          </marquee>
        </div>
      )}

      <header className="sticky top-0 left-0 right-0 z-40 bg-brand-cream/60 backdrop-blur-md border-b border-brand-brown/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-1 flex justify-start items-center">
            <Link href="/" className="relative w-70 h-35">
              <Image 
                src="/loavia-logo.png" 
                alt="LOAVIA Logo" 
                fill 
                className="object-contain" 
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-center space-x-8 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-brand-text-primary hover:text-brand-gold font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Icons & Mobile Menu */}
          <div className="flex-1 flex justify-end items-center">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-6 text-brand-text-primary">
            
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button 
                aria-label="Search" 
                className="hover:text-brand-gold transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-6 w-80 bg-white shadow-xl rounded-2xl border border-brand-brown/10 overflow-hidden">
                  <div className="p-4 border-b border-brand-brown/10">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                      <input 
                        type="text" 
                        placeholder="Search cookies..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-brand-light border-none rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <ul className="py-2">
                        {searchResults.map(product => (
                          <li key={product.id}>
                            <button 
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                                router.push(`/product/${product.id}`);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-brand-brown/5 flex items-center space-x-3 transition-colors"
                            >
                              <div className="relative w-10 h-10 rounded-md overflow-hidden bg-brand-light flex-shrink-0">
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-brand-text-primary line-clamp-1">{product.name}</p>
                                <p className="text-xs text-brand-text-secondary">₹{product.price}</p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-sm text-brand-text-secondary">
                        No products found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link href={authLink} aria-label="Account" className="hover:text-brand-gold transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <button 
              onClick={openMiniCart}
              className="relative hover:text-brand-gold transition-colors" 
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-brown text-brand-cream text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-brand-text-primary hover:text-brand-gold"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-cream border-b border-brand-brown/10">
          
          {/* Mobile Search */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
              <input 
                type="text" 
                placeholder="Search cookies..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-brand-brown/10 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm"
              />
            </div>
            {searchQuery.trim() !== "" && (
               <div className="mt-2 bg-white rounded-xl shadow-sm border border-brand-brown/10 overflow-hidden max-h-60 overflow-y-auto">
                 {searchResults.length > 0 ? (
                      <ul className="py-2">
                        {searchResults.map(product => (
                          <li key={product.id}>
                            <button 
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setSearchQuery("");
                                router.push(`/product/${product.id}`);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-brand-brown/5 flex items-center space-x-3 transition-colors"
                            >
                               <div className="relative w-8 h-8 rounded-md overflow-hidden bg-brand-light flex-shrink-0">
                                 <Image src={product.image} alt={product.name} fill className="object-cover" />
                               </div>
                               <div>
                                 <p className="text-sm font-medium text-brand-text-primary line-clamp-1">{product.name}</p>
                                 <p className="text-xs text-brand-text-secondary">₹{product.price}</p>
                               </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                 ) : (
                    <div className="p-3 text-center text-sm text-brand-text-secondary">No products found.</div>
                 )}
               </div>
            )}
          </div>

          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-brand-text-primary hover:text-brand-gold hover:bg-brand-brown/5 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-6 px-3 py-4 mt-4 border-t border-brand-brown/10 text-brand-text-primary">
              <Link href={authLink} aria-label="Account" className="hover:text-brand-gold" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="w-6 h-6" />
              </Link>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openMiniCart();
                }} 
                className="relative hover:text-brand-gold" 
                aria-label="Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-brown text-brand-cream text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </header>
    </>
  );
}
