"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingsStore";

export default function GeneralSettingsPage() {
  const { websiteName, supportEmail, contactPhone, businessAddress, updateGeneral } = useSettingsStore();
  const [form, setForm] = useState({ websiteName: websiteName || "", supportEmail: supportEmail || "", contactPhone: contactPhone || "", businessAddress: businessAddress || "" });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const save = () => {
    if (!form.websiteName.trim()) return toast.error("Website name is required.");
    if (!validateEmail(form.supportEmail)) return toast.error("Support email is invalid.");
    setLoading(true);
    try {
      updateGeneral(form.websiteName, form.supportEmail, form.contactPhone, form.businessAddress);
      toast.success("General settings saved.");
    } catch {
      toast.error("Failed to save general settings.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-brand-brown">General Settings</h1>
          <p className="text-sm text-brand-text-secondary mt-1">Basic website information</p>
        </div>
        <button onClick={save} disabled={loading} className={`px-4 py-2 rounded-xl ${loading ? 'bg-gray-300 text-gray-700' : 'bg-brand-brown text-white hover:bg-brand-gold'}`}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Website Name</label>
            <input value={form.websiteName} onChange={(e) => setForm(f => ({ ...f, websiteName: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Support Email</label>
            <input value={form.supportEmail} onChange={(e) => setForm(f => ({ ...f, supportEmail: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Contact Number</label>
            <input value={form.contactPhone} onChange={(e) => setForm(f => ({ ...f, contactPhone: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Business Address</label>
            <textarea value={form.businessAddress} onChange={(e) => setForm(f => ({ ...f, businessAddress: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" rows={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
