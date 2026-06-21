"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Settings, Tag, LogOut, Menu, X, ArrowLeft } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import LogoutModal from "@/components/admin/LogoutModal";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAdminAuthenticated, logout } = useAdminAuthStore();
  const { adminName, adminAvatar } = useSettingsStore();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // Logout modal state
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const isLoginPage = pathname?.startsWith('/admin/login');

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    try {
      if (localStorage.getItem("mockAdminAuth") === "true") {
        useAdminAuthStore.getState().login();
      } else if (!isAdminAuthenticated && !isLoginPage) {
        router.push('/admin/login');
      }
    } catch {
      // localStorage can be unavailable in restricted browser contexts.
    }
    return () => cancelAnimationFrame(frame);
  }, [isAdminAuthenticated, isLoginPage, router]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Single confirmed logout handler used by every entry point
  const confirmLogout = () => {
    setProfileMenuOpen(false);
    setSidebarOpen(false);
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutLoading(true);
    try {
      localStorage.removeItem("mockAdminAuth");
    } catch { /* */ }
    logout();
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Dashboard",   href: "/admin/dashboard",    icon: LayoutDashboard },
    { name: "Products",    href: "/admin/products",      icon: ShoppingBag },
    { name: "Orders",      href: "/admin/orders",        icon: Tag },
    { name: "Customers",   href: "/admin/users",         icon: Users },
    { name: "Promo Codes", href: "/admin/promo-codes",   icon: Tag },
    { name: "Settings",    href: "/admin/settings",      icon: Settings },
  ];

  if (!mounted) return null;
  if (isLoginPage) return <>{children}</>;

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-gold border-t-brand-brown" />
          <p className="text-brand-brown font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light flex">

      {/* Logout confirmation modal — rendered once at layout level */}
      <LogoutModal
        open={logoutModalOpen}
        loading={logoutLoading}
        onCancel={() => { if (!logoutLoading) setLogoutModalOpen(false); }}
        onConfirm={handleLogoutConfirm}
      />

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
          {/* ── Sidebar logout entry point ── */}
          <button
            onClick={confirmLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-brand-cream/80 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
          >
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
            <div className="relative" ref={profileMenuRef}>
              <div className="inline-flex items-center gap-3 rounded-full border border-brand-brown/10 bg-white px-3 py-2 text-left shadow-sm hover:bg-brand-light transition-colors cursor-pointer">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileMenuOpen((open) => !open);
                  }}
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                  className="w-8 h-8 rounded-full overflow-hidden border border-brand-brown/10 bg-brand-gold text-brand-brown flex items-center justify-center font-bold focus:outline-none"
                >
                  {adminAvatar ? (
                    <img src={adminAvatar} alt="Admin avatar" className="w-full h-full object-cover" />
                  ) : (
                    (adminName || "").split(' ').map((part) => part[0] || '').slice(0, 2).join('').toUpperCase()
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileMenuOpen(false);
                    router.push('/admin/profile');
                  }}
                  className="font-medium text-brand-brown hidden sm:block hover:underline"
                >
                  {adminName}
                </button>
              </div>

              {profileMenuOpen && (
                <div className="absolute right-0 z-10 mt-3 w-56 overflow-hidden rounded-3xl border border-brand-brown/10 bg-white shadow-lg">
                  <div className="flex flex-col py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        router.push('/admin/profile');
                      }}
                      className="text-left px-4 py-3 text-sm text-brand-brown hover:bg-brand-light"
                    >
                      My Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        router.push('/admin/settings');
                      }}
                      className="text-left px-4 py-3 text-sm text-brand-brown hover:bg-brand-light"
                    >
                      Settings
                    </button>
                    {/* ── Header dropdown logout entry point ── */}
                    <button
                      type="button"
                      onClick={confirmLogout}
                      className="text-left px-4 py-3 text-sm text-brand-brown hover:bg-brand-light"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
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
