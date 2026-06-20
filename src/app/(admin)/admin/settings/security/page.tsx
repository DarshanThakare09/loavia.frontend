"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingsStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useRouter } from "next/navigation";

export default function SecuritySettingsPage() {
  const { changePassword } = useSettingsStore();
  const hasHydrated = useSettingsStore((state) => state.hasHydrated);
  const { logout } = useAdminAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const save = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) return toast.error('All fields are required');
    if (!hasHydrated) return toast.error('Please wait while settings load before updating password');
    if (form.newPassword !== form.confirmPassword) return toast.error('New password and confirm do not match');
    if (form.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    console.debug('[security] save: entered current=', form.currentPassword, 'new=', form.newPassword, 'hasHydrated=', hasHydrated);
    console.debug('[security] store adminPassword=', (useSettingsStore.getState() as any).adminPassword);
    setLoading(true);
    try {
      const ok = changePassword(form.currentPassword.trim(), form.newPassword.trim());
      console.debug('[security] changePassword result=', ok);
      if (!ok) {
        toast.error('Current password is incorrect');
      } else {
        toast.success('Password updated.');
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        try { localStorage.removeItem('mockAdminAuth'); } catch {}
        logout();
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('[security] changePassword threw', err);
      toast.error('Failed to change password');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-brand-brown">Security</h1>
          <p className="text-sm text-brand-text-secondary mt-1">Change admin password</p>
        </div>
        <button onClick={save} disabled={loading} className={`px-4 py-2 rounded-xl ${loading ? 'bg-gray-300 text-gray-700' : 'bg-brand-brown text-white hover:bg-brand-gold'}`}>
          {loading ? 'Updating...' : 'Change Password'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6 md:w-2/3">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Current Password</label>
            <input type="password" value={form.currentPassword} onChange={(e) => setForm(f => ({ ...f, currentPassword: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">New Password</label>
            <input type="password" value={form.newPassword} onChange={(e) => setForm(f => ({ ...f, newPassword: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
