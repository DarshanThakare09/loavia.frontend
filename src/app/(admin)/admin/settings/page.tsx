"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

export default function AdminSettingsHub() {
  const rows = [
    { key: "general", title: "General Settings", desc: "Basic website information", href: "/admin/settings/general" },
    { key: "store", title: "Store Settings", desc: "Shipping and currency settings", href: "/admin/settings/store" },
    { key: "social", title: "Social Media Links", desc: "Manage social accounts", href: "/admin/settings/social" },
    { key: "profile", title: "Admin Profile", desc: "Admin name and email", href: "/admin/settings/profile" },
    { key: "security", title: "Security", desc: "Change admin password", href: "/admin/settings/security" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Settings</h1>
          <p className="text-brand-text-secondary mt-1">Manage website and store configuration</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 overflow-hidden">
        <div className="divide-y">
          {rows.map((r) => (
            <Link
              key={r.key}
              href={r.href}
              className="flex items-center justify-between px-6 py-4 hover:bg-brand-light/50 transition-colors"
            >
              <div>
                <div className="font-medium text-brand-brown">{r.title}</div>
                <div className="text-sm text-brand-text-secondary mt-1">{r.desc}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-text-secondary" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
