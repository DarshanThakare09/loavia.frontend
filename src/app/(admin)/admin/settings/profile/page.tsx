"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingsStore";

export default function ProfileSettingsPage() {
  const { adminName, adminEmail, updateAdminProfile } = useSettingsStore();
  const [form, setForm] = useState({ adminName: adminName || '', adminEmail: adminEmail || '' });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const save = () => {
    if (!form.adminName.trim()) return toast.error('Admin name is required');
    if (!validateEmail(form.adminEmail)) return toast.error('Admin email is invalid');
    setLoading(true);
    try {
      updateAdminProfile(form.adminName, form.adminEmail);
      toast.success('Admin profile updated.');
    } catch {
      toast.error('Failed to update admin profile.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-brand-brown">Admin Profile</h1>
          <p className="text-sm text-brand-text-secondary mt-1">Update admin profile</p>
        </div>
        <button onClick={save} disabled={loading} className={`px-4 py-2 rounded-xl ${loading ? 'bg-gray-300 text-gray-700' : 'bg-brand-brown text-white hover:bg-brand-gold'}`}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6">
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Admin Name</label>
            <input value={form.adminName} onChange={(e) => setForm(f => ({ ...f, adminName: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Admin Email</label>
            <input value={form.adminEmail} onChange={(e) => setForm(f => ({ ...f, adminEmail: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
