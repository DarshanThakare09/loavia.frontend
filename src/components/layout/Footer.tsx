import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-brown text-brand-cream py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-serif font-bold tracking-wider text-brand-gold">LOAVIA</span>
            </Link>
            <p className="text-sm opacity-80 mb-6">
              Healthy Inside, Yummy Outside. Premium cookies baked with love and the finest ingredients.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-gold transition-colors"><Mail className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-gold transition-colors"><Phone className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-gold transition-colors"><MessageCircle className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 font-serif text-brand-gold">Shop</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/shop" className="hover:text-brand-gold hover:underline">All Cookies</Link></li>
              <li><Link href="/build-box" className="hover:text-brand-gold hover:underline">Build Your Box</Link></li>
              <li><Link href="/gift" className="hover:text-brand-gold hover:underline">Gifts</Link></li>
              <li><Link href="/shop?category=seasonal" className="hover:text-brand-gold hover:underline">Seasonal Specials</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 font-serif text-brand-gold">Company</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/about" className="hover:text-brand-gold hover:underline">Our Story</Link></li>
              <li><Link href="/about#ingredients" className="hover:text-brand-gold hover:underline">Ingredients</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold hover:underline">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 font-serif text-brand-gold">Support</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/faq" className="hover:text-brand-gold hover:underline">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-brand-gold hover:underline">Shipping & Returns</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-gold hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-gold hover:underline">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-brand-cream/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-70">
          <p>&copy; {new Date().getFullYear()} LOAVIA. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for Cravings.</p>
        </div>
      </div>
    </footer>
  );
}
