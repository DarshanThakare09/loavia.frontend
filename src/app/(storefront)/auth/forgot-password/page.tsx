"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Reset link sent successfully!");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to send reset link";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8">
        <div className="mb-6">
          <Link href="/auth" className="inline-flex items-center space-x-2 text-brand-gold hover:text-brand-brown transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-brand-brown mb-2">
            Reset Password
          </h2>
          <p className="text-brand-text-secondary text-sm">
            {isSubmitted 
              ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {!isSubmitted && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-5 h-5" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 pl-10 pr-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-8 py-4 font-bold text-white bg-brand-brown rounded-xl hover:bg-brand-gold disabled:bg-brand-brown/50 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>{isLoading ? "Sending..." : "Send Reset Link"}</span>
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
