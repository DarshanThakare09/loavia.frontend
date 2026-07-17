"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingsStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/apiClient";

export default function ProfileSettingsPage() {
  const { adminAvatar, updateAdminProfile } = useSettingsStore();
  const { logout } = useAdminAuthStore();
  const router = useRouter();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch current user details on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await apiClient.get("/admin/me/profile");
        if (res.data?.success && res.data?.data) {
          const u = res.data.data;
          setProfileForm({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
          });
          // Also sync with the layout/sidebar local store
          updateAdminProfile(u.name, u.email, u.phone || "", adminAvatar || "");
        }
      } catch (err) {
        console.error("Failed to fetch admin profile details", err);
        toast.error("Failed to load profile details from database.");
      }
    }
    fetchProfile();
  }, [adminAvatar, updateAdminProfile]);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const saveProfile = async () => {
    if (!profileForm.name.trim()) return toast.error("Name is required");
    if (!validateEmail(profileForm.email)) return toast.error("Email is invalid");

    setProfileLoading(true);
    try {
      const response = await apiClient.put("/admin/me/profile", {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim() || undefined,
      });
      const updated = response.data?.data;
      updateAdminProfile(
        updated?.name || profileForm.name,
        updated?.email || profileForm.email,
        updated?.phone || profileForm.phone,
        adminAvatar || ""
      );
      toast.success("Admin profile updated directly in database.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  const changePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword)
      return toast.error("All password fields are required");
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return toast.error("New password and confirmation do not match");
    if (passwordForm.newPassword.length < 8)
      return toast.error("New password must be at least 8 characters long");

    setPasswordLoading(true);
    try {
      await apiClient.post("/admin/me/change-password", {
        currentPassword: passwordForm.currentPassword.trim(),
        newPassword: passwordForm.newPassword.trim(),
      });
      toast.success("Password updated in database. Please log in again.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      // Logout and redirect
      try {
        await apiClient.post("/auth/admin-logout");
      } catch {}
      logout();
      router.push("/admin/login");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to change password.";
      toast.error(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-brown font-serif">Admin Profile & Security</h1>
        <p className="text-brand-text-secondary mt-1">Manage your administrator account details and password directly in the database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-brown border-b border-brand-brown/10 pb-3">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-text-secondary">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-brand-brown/20 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 p-3 outline-none transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-text-secondary">Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-brand-brown/20 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 p-3 outline-none transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-text-secondary">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-brand-brown/20 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 p-3 outline-none transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-brand-brown/10 pt-4 flex justify-end">
            <button
              onClick={saveProfile}
              disabled={profileLoading}
              className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all duration-300 ${
                profileLoading ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-brand-brown hover:bg-brand-gold shadow-md hover:shadow-lg"
              }`}
            >
              {profileLoading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-brown border-b border-brand-brown/10 pb-3">Update Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-text-secondary">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-brand-brown/20 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 p-3 outline-none transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-text-secondary">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-brand-brown/20 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 p-3 outline-none transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-text-secondary">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-brand-brown/20 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 p-3 outline-none transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-brand-brown/10 pt-4 flex justify-end">
            <button
              onClick={changePassword}
              disabled={passwordLoading}
              className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all duration-300 ${
                passwordLoading ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-brand-brown hover:bg-brand-gold shadow-md hover:shadow-lg"
              }`}
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


