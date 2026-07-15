"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingsStore";
import { apiClient } from "@/services/apiClient";

export default function ProfileSettingsPage() {
  const { adminName, adminEmail, adminPhone, adminAvatar, updateAdminProfile } = useSettingsStore();
  const [form, setForm] = useState({ name: adminName || "", email: adminEmail || "", phone: adminPhone || "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ name: adminName || "", email: adminEmail || "", phone: adminPhone || "" });
  }, [adminName, adminEmail, adminPhone]);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!validateEmail(form.email)) return toast.error("Email is invalid");
    setLoading(true);
    try {
      const response = await apiClient.put("/admin/me/profile", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
      });
      const updated = response.data?.data;
      updateAdminProfile(updated?.name || form.name, updated?.email || form.email, updated?.phone || form.phone, adminAvatar || "");
      toast.success("Admin profile updated.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-brown">Admin Profile</h1>
          <p className="text-sm text-brand-text-secondary mt-1">Update admin profile</p>
        </div>
        <button
          onClick={save}
          disabled={loading}
          className={`px-4 py-2 rounded-xl ${loading ? "bg-gray-300 text-gray-700" : "bg-brand-brown text-white hover:bg-brand-gold"}`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Full Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Email</label>
            <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Phone Number</label>
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
