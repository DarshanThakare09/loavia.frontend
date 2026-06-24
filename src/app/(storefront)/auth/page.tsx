"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(false); // reset state
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Welcome back!");
        // Check for redirect param
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get("redirect") || "/profile";
        router.push(redirectUrl);
      } else {
        await register(name, email, password);
        toast.success("Registration successful. Please verify your email.");
        setIsLogin(true);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Authentication failed";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header Tabs */}
        <div className="flex border-b border-brand-brown/10">
          <button 
            className={`flex-1 py-4 text-center font-bold text-lg transition-all duration-300 ${isLogin ? "bg-brand-brown text-brand-gold" : "bg-white text-brand-text-secondary hover:bg-brand-light"}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button 
            className={`flex-1 py-4 text-center font-bold text-lg transition-all duration-300 ${!isLogin ? "bg-brand-brown text-brand-gold" : "bg-white text-brand-text-secondary hover:bg-brand-light"}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-brand-brown mb-2">
              {isLogin ? "Welcome Back" : "Join LOAVIA"}
            </h2>
            <p className="text-brand-text-secondary text-sm">
              {isLogin ? "Log in to access your saved boxes, orders, and rewards." : "Create an account for faster checkout and exclusive rewards."}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-5 h-5" />
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 pl-10 pr-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary">Password</label>
                {isLogin && (
                  <Link href="/auth/forgot-password" className="text-[11px] font-bold text-brand-gold hover:text-brand-brown transition-colors">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-5 h-5" />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 pl-10 pr-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-8 py-4 font-bold text-white bg-brand-brown rounded-xl hover:bg-brand-gold disabled:bg-brand-brown/50 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>{isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}</span>
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-brown/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-brand-text-secondary">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => toast.info("Google login coming soon!")} className="w-full inline-flex justify-center py-3 px-4 border border-brand-brown/10 rounded-xl bg-white text-sm font-medium text-brand-text-primary hover:bg-brand-light transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button onClick={() => toast.info("Apple login coming soon!")} className="w-full inline-flex justify-center py-3 px-4 border border-brand-brown/10 rounded-xl bg-white text-sm font-medium text-brand-text-primary hover:bg-brand-light transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
