"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingsStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useRouter } from "next/navigation";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export default function AdminProfilePage() {
  const { adminName, adminEmail, adminPhone, adminAvatar, adminStatus, updateAdminProfile, changePassword } = useSettingsStore();
  const hasHydrated = useSettingsStore((state) => state.hasHydrated);
  const { logout } = useAdminAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({
    adminName: adminName || "",
    adminEmail: adminEmail || "",
    adminPhone: adminPhone || "",
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [avatarPreview, setAvatarPreview] = useState(adminAvatar || "");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    setForm({ adminName: adminName || "", adminEmail: adminEmail || "", adminPhone: adminPhone || "" });
    setAvatarPreview(adminAvatar || "");
  }, [adminName, adminEmail, adminPhone, adminAvatar]);

  const profileInitials = useMemo(() => getInitials(adminName || "Admin"), [adminName]);

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setAvatarPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    if (!form.adminName.trim()) return toast.error("Full name is required.");
    if (!/\S+@\S+\.\S+/.test(form.adminEmail)) return toast.error("Valid email is required.");
    if (!form.adminPhone.trim()) return toast.error("Phone number is required.");

    setLoading(true);
    try {
      updateAdminProfile(form.adminName.trim(), form.adminEmail.trim(), form.adminPhone.trim(), avatarPreview || "");
      toast.success("Profile information saved.");
    } catch (error) {
      toast.error("Unable to save profile information.");
    } finally {
      setLoading(false);
    }
  };

  const cancelChanges = () => {
    setForm({ adminName: adminName || "", adminEmail: adminEmail || "", adminPhone: adminPhone || "" });
    setAvatarPreview(adminAvatar || "");
  };

  const updatePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      return toast.error("All password fields are required.");
    }
    if (!hasHydrated) {
      return toast.error("Please wait while settings load before updating password.");
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New password and confirmation must match.");
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters.");
    }

    console.debug('[profile] updatePassword: enteredCurrent=', passwordForm.currentPassword, 'new=', passwordForm.newPassword, 'hasHydrated=', hasHydrated);
    console.debug('[profile] store adminPassword before change=', (useSettingsStore.getState() as any).adminPassword);

    setPasswordLoading(true);
    try {
      const ok = changePassword(passwordForm.currentPassword.trim(), passwordForm.newPassword.trim());
      console.debug('[profile] changePassword result=', ok);
      if (!ok) {
        toast.error("Current password is incorrect.");
      } else {
        toast.success("Password updated successfully.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        try { localStorage.removeItem('mockAdminAuth'); } catch {}
        logout();
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('[profile] changePassword threw', err);
      toast.error("Unable to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-brown">Admin Profile</h1>
          <p className="text-sm text-brand-text-secondary mt-1">Your profile details and account settings.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5 rounded-3xl bg-white p-6 shadow-sm border border-brand-brown/10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">Profile Information</p>
              <h2 className="mt-3 text-xl font-semibold text-brand-brown">Administrator details</h2>
              <p className="text-sm text-brand-text-secondary mt-1">Review your account photo, name, and status.</p>
            </div>
            <div className="rounded-3xl border border-brand-brown/10 bg-brand-light px-4 py-3 text-sm text-brand-brown">
              <p className="font-semibold">Account Status</p>
              <p className="mt-1 text-brand-text-secondary">{adminStatus || "Active"}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-3xl bg-brand-light/80 p-4">
              <p className="text-sm text-brand-text-secondary">Profile Photo</p>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border border-brand-brown/10 bg-brand-gold text-brand-brown flex items-center justify-center text-xl font-bold">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Admin avatar" className="h-full w-full object-cover" />
                  ) : (
                    profileInitials
                  )}
                </div>
                <label className="cursor-pointer rounded-full border border-brand-brown/10 bg-white px-4 py-2 text-sm font-medium text-brand-brown shadow-sm transition-colors hover:border-brand-gold hover:text-brand-brown">
                  Upload image
                  <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
                </label>
              </div>
            </div>
            <div className="space-y-3 rounded-3xl bg-brand-light/80 p-4">
              <p className="text-sm text-brand-text-secondary">Admin Role</p>
              <p className="text-sm text-brand-brown">Admin</p>
              <p className="text-sm text-brand-text-secondary">Email Address</p>
              <p className="text-sm text-brand-brown">{adminEmail}</p>
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-3xl bg-white p-6 shadow-sm border border-brand-brown/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">Editable Fields</p>
            <h2 className="mt-3 text-xl font-semibold text-brand-brown">Update profile details</h2>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary">Full Name</label>
              <input
                value={form.adminName}
                onChange={(e) => setForm((prev) => ({ ...prev, adminName: e.target.value }))}
                className="mt-2 w-full rounded-3xl border border-brand-brown/10 bg-brand-light p-3 text-sm text-brand-brown"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary">Email Address</label>
              <input
                value={form.adminEmail}
                onChange={(e) => setForm((prev) => ({ ...prev, adminEmail: e.target.value }))}
                className="mt-2 w-full rounded-3xl border border-brand-brown/10 bg-brand-light p-3 text-sm text-brand-brown"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary">Phone Number</label>
              <input
                value={form.adminPhone}
                onChange={(e) => setForm((prev) => ({ ...prev, adminPhone: e.target.value }))}
                className="mt-2 w-full rounded-3xl border border-brand-brown/10 bg-brand-light p-3 text-sm text-brand-brown"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={cancelChanges}
              className="rounded-3xl border border-brand-brown/10 bg-white px-5 py-3 text-sm font-medium text-brand-brown hover:bg-brand-light"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveProfile}
              disabled={loading}
              className="rounded-3xl bg-brand-brown px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm border border-brand-brown/10">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">Change Password</p>
            <h2 className="mt-3 text-xl font-semibold text-brand-brown">Update your password</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                className="mt-2 w-full rounded-3xl border border-brand-brown/10 bg-brand-light p-3 text-sm text-brand-brown"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                className="mt-2 w-full rounded-3xl border border-brand-brown/10 bg-brand-light p-3 text-sm text-brand-brown"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary">Confirm Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="mt-2 w-full rounded-3xl border border-brand-brown/10 bg-brand-light p-3 text-sm text-brand-brown"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={updatePassword}
              disabled={passwordLoading}
              className="rounded-3xl bg-brand-brown px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
