"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingsStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useRouter } from "next/navigation";
import { Camera, Trash2, User, Mail, Phone, ShieldCheck, Loader2 } from "lucide-react";

const MAX_FILE_SIZE_MB = 2;

const getInitials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

export default function AdminProfilePage() {
  const {
    adminName, adminEmail, adminPhone, adminAvatar, adminStatus,
    updateAdminProfile, changePassword,
  } = useSettingsStore();
  const { logout } = useAdminAuthStore();
  const router = useRouter();

  // Hydration guard — avoids reading stale SSR values
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [form, setForm] = useState({ adminName: "", adminEmail: "", adminPhone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form from store after hydration
  useEffect(() => {
    if (!mounted) return;
    setForm({ adminName: adminName || "", adminEmail: adminEmail || "", adminPhone: adminPhone || "" });
  }, [mounted, adminName, adminEmail, adminPhone]);

  const initials = useMemo(() => getInitials(adminName || "Admin"), [adminName]);

  // ── Avatar ────────────────────────────────────────────────────────────────

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      // Persist immediately — avatar is saved as base64 in the store
      updateAdminProfile(
        adminName || form.adminName,
        adminEmail || form.adminEmail,
        adminPhone || form.adminPhone,
        reader.result,
      );
      toast.success("Profile photo updated.");
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be re-selected if needed
    e.target.value = "";
  };

  const handleRemoveAvatar = () => {
    updateAdminProfile(
      adminName || form.adminName,
      adminEmail || form.adminEmail,
      adminPhone || form.adminPhone,
      "",
    );
    toast.success("Profile photo removed.");
  };

  // ── Profile save ──────────────────────────────────────────────────────────

  const saveProfile = () => {
    if (!form.adminName.trim()) { toast.error("Full name is required."); return; }
    if (!/\S+@\S+\.\S+/.test(form.adminEmail)) { toast.error("Valid email is required."); return; }
    if (!form.adminPhone.trim()) { toast.error("Phone number is required."); return; }

    setLoading(true);
    try {
      // Preserve the already-persisted avatar when saving other fields
      updateAdminProfile(form.adminName.trim(), form.adminEmail.trim(), form.adminPhone.trim(), adminAvatar || "");
      toast.success("Profile saved successfully.");
    } catch {
      toast.error("Unable to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const cancelChanges = () => {
    setForm({ adminName: adminName || "", adminEmail: adminEmail || "", adminPhone: adminPhone || "" });
  };

  // ── Password ──────────────────────────────────────────────────────────────

  const updatePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required."); return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match."); return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters."); return;
    }

    setPasswordLoading(true);
    try {
      const ok = changePassword(currentPassword.trim(), newPassword.trim());
      if (!ok) {
        toast.error("Current password is incorrect.");
      } else {
        toast.success("Password updated. Please log in again.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        try { localStorage.removeItem("mockAdminAuth"); } catch { /* */ }
        logout();
        router.push("/admin/login");
      }
    } catch {
      toast.error("Unable to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-brand-brown">My Profile</h1>
        <p className="mt-1 text-sm text-brand-text-secondary">Manage your account details and security settings.</p>
      </div>

      {/* ── Profile card ── */}
      <div className="rounded-2xl bg-white border border-brand-brown/10 shadow-sm overflow-hidden">

        {/* Hero band */}
        <div className="h-24 bg-gradient-to-r from-brand-brown to-brand-brown/70" />

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-6">
            <div className="relative w-20 h-20 shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white bg-brand-gold text-brand-brown flex items-center justify-center text-2xl font-bold shadow-md">
                {adminAvatar ? (
                  <img src={adminAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              {/* Camera overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-brand-brown border-2 border-white text-white flex items-center justify-center shadow hover:bg-brand-gold transition-colors"
                title="Change photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="flex items-center gap-2 pb-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-brand-brown/20 bg-white px-4 py-2 text-sm font-medium text-brand-brown hover:bg-brand-light transition-colors"
              >
                Change Photo
              </button>
              {adminAvatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-brand-text-secondary mb-6">
            JPG, PNG or GIF · max {MAX_FILE_SIZE_MB} MB
          </p>

          {/* Info fields */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-text-secondary mb-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <input
                value={form.adminName}
                onChange={(e) => setForm((p) => ({ ...p, adminName: e.target.value }))}
                className="w-full rounded-xl border border-brand-brown/15 bg-brand-light px-3 py-2.5 text-sm text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-text-secondary mb-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input
                type="email"
                value={form.adminEmail}
                onChange={(e) => setForm((p) => ({ ...p, adminEmail: e.target.value }))}
                className="w-full rounded-xl border border-brand-brown/15 bg-brand-light px-3 py-2.5 text-sm text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-text-secondary mb-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </label>
              <input
                type="tel"
                value={form.adminPhone}
                onChange={(e) => setForm((p) => ({ ...p, adminPhone: e.target.value }))}
                className="w-full rounded-xl border border-brand-brown/15 bg-brand-light px-3 py-2.5 text-sm text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>
          </div>

          {/* Status badge */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-700">{adminStatus || "Active"}</span>
          </div>

          {/* Save row */}
          <div className="mt-6 flex justify-end gap-3 border-t border-brand-brown/8 pt-5">
            <button
              type="button"
              onClick={cancelChanges}
              className="rounded-xl border border-brand-brown/15 bg-white px-5 py-2.5 text-sm font-medium text-brand-brown hover:bg-brand-light transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveProfile}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-brown px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-gold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Change password ── */}
      <div className="rounded-2xl bg-white border border-brand-brown/10 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck className="w-5 h-5 text-brand-gold" />
          <h2 className="text-lg font-semibold text-brand-brown">Change Password</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Current Password", key: "currentPassword" },
            { label: "New Password",     key: "newPassword" },
            { label: "Confirm Password", key: "confirmPassword" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wide text-brand-text-secondary mb-1.5">
                {label}
              </label>
              <input
                type="password"
                value={passwordForm[key as keyof typeof passwordForm]}
                onChange={(e) => setPasswordForm((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full rounded-xl border border-brand-brown/15 bg-brand-light px-3 py-2.5 text-sm text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-brand-text-secondary">
          Minimum 6 characters. After update you will be signed out.
        </p>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={updatePassword}
            disabled={passwordLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-brown px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-gold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {passwordLoading ? "Updating…" : "Update Password"}
          </button>
        </div>
      </div>

    </div>
  );
}
