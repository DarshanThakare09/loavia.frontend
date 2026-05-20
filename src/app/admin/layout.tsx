"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Settings, Tag, LogOut, Menu, X, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: Tag },
    { name: "Customers", href: "/admin/users", icon: Users },
    { name: "Settings", href: "#", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-light flex">
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-brown text-brand-cream transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <h1 className="font-serif font-bold text-2xl tracking-widest text-brand-gold">LOAVIA.</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-brand-cream/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 flex-1">
          <p className="text-xs font-bold text-brand-cream/50 uppercase tracking-wider mb-4 ml-3">Admin Panel</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? "bg-brand-gold text-brand-brown font-bold" 
                      : "text-brand-cream/80 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-brand-cream/80 hover:bg-white/10 hover:text-white rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Storefront</span>
          </Link>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-brand-cream/80 hover:bg-white/10 hover:text-white rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-brand-brown/5 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-brand-brown p-2 -ml-2 rounded-md hover:bg-brand-light"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-brown flex items-center justify-center font-bold">
              AD
            </div>
            <span className="font-medium text-brand-brown hidden sm:block">Admin User</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
      
    </div>
  );
}
