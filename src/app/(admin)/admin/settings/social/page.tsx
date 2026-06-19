"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingsStore";

export default function SocialSettingsPage() {
  const { instagramUrl, facebookUrl, linkedinUrl, youtubeUrl, updateSocial } = useSettingsStore();
  const [form, setForm] = useState({ instagramUrl: instagramUrl || '', facebookUrl: facebookUrl || '', linkedinUrl: linkedinUrl || '', youtubeUrl: youtubeUrl || '' });
  const [loading, setLoading] = useState(false);

  const save = () => {
    setLoading(true);
    try {
      updateSocial(form.instagramUrl, form.facebookUrl, form.linkedinUrl, form.youtubeUrl);
      toast.success('Social links saved.');
    } catch {
      toast.error('Failed to save social links.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-brand-brown">Social Media Links</h1>
          <p className="text-sm text-brand-text-secondary mt-1">Manage footer/header social links</p>
        </div>
        <button onClick={save} disabled={loading} className={`px-4 py-2 rounded-xl ${loading ? 'bg-gray-300 text-gray-700' : 'bg-brand-brown text-white hover:bg-brand-gold'}`}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Instagram URL</label>
            <input value={form.instagramUrl} onChange={(e) => setForm(f => ({ ...f, instagramUrl: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Facebook URL</label>
            <input value={form.facebookUrl} onChange={(e) => setForm(f => ({ ...f, facebookUrl: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">LinkedIn URL</label>
            <input value={form.linkedinUrl} onChange={(e) => setForm(f => ({ ...f, linkedinUrl: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">YouTube URL</label>
            <input value={form.youtubeUrl} onChange={(e) => setForm(f => ({ ...f, youtubeUrl: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
