"use client";

import { useEffect, useRef } from "react";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutModalProps {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ open, loading, onCancel, onConfirm }: LogoutModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  // Focus the Cancel button when modal opens (accessibility)
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="logout-title"
      aria-describedby="logout-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => { if (!loading) onCancel(); }}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-brand-brown/10 animate-in fade-in zoom-in-95 duration-200">
        {/* Icon header */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-brown/8 border border-brand-brown/10">
            <LogOut className="h-6 w-6 text-brand-brown" />
          </div>
        </div>

        <div className="px-7 pb-7 text-center">
          <h2 id="logout-title" className="text-lg font-semibold text-brand-brown">
            Log Out
          </h2>
          <p id="logout-desc" className="mt-2 text-sm text-brand-text-secondary leading-relaxed">
            Are you sure you want to log out of your admin account?
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-full sm:w-auto rounded-xl border border-brand-brown/15 bg-white px-6 py-2.5 text-sm font-medium text-brand-brown hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-brown px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Logging out…</>
              ) : (
                <><LogOut className="h-4 w-4" /> Log Out</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
