"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/apiClient";

export default function SecuritySettingsPage() {
  const { logout } = useAdminAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword)
      return toast.error("All fields are required");
    if (form.newPassword !== form.confirmPassword)
      return toast.error("New password and confirm do not match");
    if (form.newPassword.length < 8)
      return toast.error("New password must be at least 8 characters");

    setLoading(true);
    try {
      await apiClient.post("/admin/me/change-password", {
        currentPassword: form.currentPassword.trim(),
        newPassword: form.newPassword.trim(),
      });
      toast.success("Password updated. Please sign in again.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      // Clear admin session and redirect to login
      try { await apiClient.post("/auth/logout"); } catch {}
      logout();
      router.push("/admin/login");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to change password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-brand-brown">Security</h1>
          <p className="text-sm text-brand-text-secondary mt-1">Change admin password</p>
        </div>
        <button
          onClick={save}
          disabled={loading}
          className={`px-4 py-2 rounded-xl ${loading ? "bg-gray-300 text-gray-700" : "bg-brand-brown text-white hover:bg-brand-gold"}`}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6 md:w-2/3">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Current Password</label>
            <input type="password" value={form.currentPassword} onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">New Password</label>
            <input type="password" value={form.newPassword} onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))} className="mt-1 w-full rounded-lg border p-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
