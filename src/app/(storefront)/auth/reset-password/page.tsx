"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const resetPassword = useAuthStore((state) => state.resetPassword);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token is missing from the link.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(password, token);
      toast.success("Password has been reset successfully! Please sign in with your new password.");
      router.push("/auth");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to reset password";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8">
      <div className="mb-6">
        <Link href="/auth" className="inline-flex items-center space-x-2 text-brand-gold hover:text-brand-brown transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-brand-brown mb-2">
          New Password
        </h2>
        <p className="text-brand-text-secondary text-sm">
          {!token 
            ? "Invalid reset link. Token is missing." 
            : "Enter and confirm your new password below."}
        </p>
      </div>

      {token && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-5 h-5" />
              <input 
                type={showPassword ? "text" : "password"}
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 pl-10 pr-10 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary hover:text-brand-brown"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-5 h-5" />
              <input 
                type={showPassword ? "text" : "password"}
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 pl-10 pr-10 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 px-8 py-4 font-bold text-white bg-brand-brown rounded-xl hover:bg-brand-gold disabled:bg-brand-brown/50 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <span>{isLoading ? "Resetting..." : "Reset Password"}</span>
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-brand-cream min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-gold border-t-brand-brown" />
          <p className="text-brand-brown font-medium">Loading form...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
