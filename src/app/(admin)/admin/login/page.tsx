"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useSettingsStore } from "@/store/settingsStore";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAdminAuthStore();
  const adminPassword = useSettingsStore((state) => state.adminPassword);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo: username is fixed; password is read from settings store to stay consistent
    console.debug('[admin login] entered', { username, password });
    console.debug('[admin login] stored adminPassword', adminPassword);
    if (username.trim() === "admin@123" && password.trim() === adminPassword) {
      login();
      try {
        localStorage.setItem("mockAdminAuth", "true");
      } catch (err) {
        console.warn("localStorage not available", err);
      }
      
      router.push("/admin/dashboard");
      
      // Fallback for robust redirect
      setTimeout(() => {
        if (window.location.pathname !== "/admin/dashboard") {
          window.location.href = "/admin/dashboard";
        }
      }, 300);
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-brown font-serif">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-brand-text-secondary">
            Sign in to access the dashboard
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="sr-only" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-2 border border-brand-brown/20 placeholder-gray-500 text-brand-text-primary focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin(e as any)}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-2 pr-10 border border-brand-brown/20 placeholder-gray-500 text-brand-text-primary focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin(e as any)}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 z-20 flex items-center px-3 text-brand-text-secondary hover:text-brand-brown focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex justify-end">
            <Link
              href="/admin/forgot-password"
              className="text-sm text-brand-text-secondary hover:text-brand-brown transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <div>
            <button
              type="button"
              onClick={handleLogin}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-brown hover:bg-brand-gold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
