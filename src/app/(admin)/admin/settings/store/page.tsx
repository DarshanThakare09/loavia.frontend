"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingsStore";

export default function StoreSettingsPage() {
  const { shippingCharge, freeShippingThreshold, currency, updateStore } = useSettingsStore();
  const [form, setForm] = useState({ shippingCharge: String(shippingCharge ?? 0), freeShippingThreshold: String(freeShippingThreshold ?? 0), currency: currency || 'INR' });
  const [loading, setLoading] = useState(false);

  const save = () => {
    if (!Number.isFinite(Number(form.shippingCharge))) return toast.error('Shipping charge must be a number');
    if (!Number.isFinite(Number(form.freeShippingThreshold))) return toast.error('Free shipping threshold must be a number');
    setLoading(true);
    try {
      updateStore(Number(form.shippingCharge), Number(form.freeShippingThreshold), form.currency);
      toast.success('Store settings saved.');
    } catch {
      toast.error('Failed to save store settings.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-brand-brown">Store Settings</h1>
          <p className="text-sm text-brand-text-secondary mt-1">Shipping and currency settings</p>
        </div>
        <button onClick={save} disabled={loading} className={`px-4 py-2 rounded-xl ${loading ? 'bg-gray-300 text-gray-700' : 'bg-brand-brown text-white hover:bg-brand-gold'}`}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Shipping Charge</label>
            <input type="number" value={form.shippingCharge} onChange={(e) => setForm(f => ({ ...f, shippingCharge: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Free Shipping Threshold</label>
            <input type="number" value={form.freeShippingThreshold} onChange={(e) => setForm(f => ({ ...f, freeShippingThreshold: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Currency</label>
            <select value={form.currency} onChange={(e) => setForm(f => ({ ...f, currency: e.target.value }))} className="mt-1 w-full rounded-lg border p-3">
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
