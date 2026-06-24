"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus, Edit3, Trash2, CheckCircle2, X, Tag, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useAdminCouponStore } from "@/store/adminCouponStore";
import { CouponDTO, CouponType, CreateCouponRequestDTO } from "@/types/admin";
import { toast } from "sonner";

// ── Types & Constants ──────────────────────────────────────────────────────

type FormState = {
  code: string;
  type: CouponType;
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  expiryDate: string;
  isActive: boolean;
  description: string;
};

const EMPTY_FORM: FormState = {
  code: "",
  type: "PERCENTAGE",
  value: 20,
  minOrder: 499,
  maxDiscount: 200,
  usageLimit: 100,
  expiryDate: "",
  isActive: true,
  description: "",
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "Never";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "Invalid" : d.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminPromoCodesPage() {
  const store = useAdminCouponStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [form, setForm]               = useState<FormState>(EMPTY_FORM);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Fetch on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    store.fetchCoupons(1, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Close modal on Escape ───────────────────────────────────────────────
  useEffect(() => {
    if (!isModalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isModalOpen]);

  // ── Sorted + filtered coupons ───────────────────────────────────────────
  const displayedCoupons = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return [...store.coupons]
      .filter(c => !q || c.code.toLowerCase().includes(q) || (c.description?.toLowerCase() ?? "").includes(q))
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [store.coupons, searchQuery]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: CouponDTO) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder,
      maxDiscount: coupon.maxDiscount ?? 0,
      usageLimit: coupon.usageLimit,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.slice(0, 10) : "",
      isActive: coupon.isActive,
      description: coupon.description ?? "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (coupon: CouponDTO) => {
    if (!confirm(`Delete coupon "${coupon.code}"? This cannot be undone.`)) return;
    try {
      await store.deleteCoupon(coupon.id);
      toast.success(`Coupon ${coupon.code} deleted.`);
    } catch { /* toast shown by store */ }
  };

  const handleToggleActive = async (coupon: CouponDTO) => {
    try {
      await store.updateCoupon(coupon.id, { isActive: !coupon.isActive });
      toast.success(`Coupon ${coupon.code} ${coupon.isActive ? "disabled" : "enabled"}.`);
    } catch { /* toast shown by store */ }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const code = form.code.trim().toUpperCase();
    if (!code) { toast.error("Promo code is required."); return; }
    if (form.value <= 0) { toast.error("Discount value must be > 0."); return; }
    if (form.type === "PERCENTAGE" && form.value > 100) { toast.error("Percentage must be 1–100."); return; }
    if (form.type === "PERCENTAGE" && form.maxDiscount <= 0) { toast.error("Max discount is required for percentage coupons."); return; }
    if (form.minOrder < 0) { toast.error("Min order cannot be negative."); return; }
    if (form.usageLimit <= 0) { toast.error("Usage limit must be > 0."); return; }
    if (form.expiryDate) {
      const d = new Date(form.expiryDate);
      if (isNaN(d.getTime()) || d < new Date()) { toast.error("Expiry must be a future date."); return; }
    }

    const payload: CreateCouponRequestDTO = {
      code,
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder),
      maxDiscount: form.type === "PERCENTAGE" ? Number(form.maxDiscount) : undefined,
      usageLimit: Number(form.usageLimit),
      expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : "",
      isActive: form.isActive,
      description: form.description.trim() || undefined,
    };

    try {
      if (editingId) {
        await store.updateCoupon(editingId, payload);
        toast.success("Coupon updated.");
      } else {
        await store.createCoupon(payload);
        toast.success("Coupon created.");
      }
      setIsModalOpen(false);
    } catch { /* toast shown by store */ }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Promo Codes</h1>
          <p className="text-brand-text-secondary mt-1">
            {store.pagination
              ? `${store.pagination.total} total coupon codes`
              : "Manage promo codes across the storefront"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => store.fetchCoupons(1, 50)}
            disabled={store.isLoadingCoupons}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-brown/10 rounded-full text-sm font-semibold text-brand-brown hover:bg-brand-light transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${store.isLoadingCoupons ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-6 py-3 font-bold text-white bg-brand-brown rounded-full hover:bg-brand-gold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Coupon
          </button>
        </div>
      </div>

      {/* Error */}
      {store.couponsError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Error loading coupons</p>
            <p className="text-red-700 text-sm">{store.couponsError}</p>
            <button onClick={() => store.fetchCoupons(1, 50)} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-brand-brown/5 shadow-sm">
        <div className="relative w-full md:w-80">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary/60 w-4 h-4" />
          <input
            type="text"
            placeholder="Search code or description..."
            className="w-full pl-10 pr-4 py-2 border border-brand-brown/10 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {store.isLoadingCoupons && (
        <div className="bg-white rounded-3xl shadow-sm border border-brand-brown/10 p-8">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gradient-to-r from-brand-light to-brand-gold/10 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      {!store.isLoadingCoupons && (
        <div className="bg-white rounded-3xl shadow-sm border border-brand-brown/10 overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-brand-light text-brand-brown text-xs uppercase tracking-widest font-semibold">
              <tr>
                <th className="px-5 py-4">Code</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Value</th>
                <th className="px-5 py-4">Min Order</th>
                <th className="px-5 py-4">Max Discount</th>
                <th className="px-5 py-4">Usage</th>
                <th className="px-5 py-4">Expiry</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedCoupons.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-brand-text-secondary">
                    {searchQuery ? "No coupons match your search." : "No promo codes yet. Create one to get started."}
                  </td>
                </tr>
              ) : (
                displayedCoupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t border-brand-brown/10 hover:bg-brand-light/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-brand-brown font-mono">
                      {coupon.code}
                      {coupon.isExpired && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500">EXPIRED</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-brand-text-secondary capitalize">
                      {coupon.type === "PERCENTAGE" ? "Percentage" : "Fixed"}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-brand-text-primary">
                      {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `₹${coupon.value}`}
                    </td>
                    <td className="px-5 py-4 text-sm text-brand-text-primary">₹{coupon.minOrder.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-brand-text-primary">
                      {coupon.type === "PERCENTAGE" && coupon.maxDiscount ? `₹${coupon.maxDiscount.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-brand-text-primary">
                      <span className="font-semibold">{coupon.timesUsed}</span>
                      <span className="text-brand-text-secondary">/{coupon.usageLimit}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-brand-text-primary">{formatDate(coupon.expiryDate)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${coupon.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 space-x-2 text-sm">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-brown/10 text-brand-brown rounded-xl hover:bg-brand-brown/15 transition-colors text-xs font-semibold"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        disabled={store.isUpdating}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors text-xs font-semibold disabled:opacity-50 ${
                          coupon.isActive
                            ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {store.isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        {coupon.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleDelete(coupon)}
                        disabled={store.isDeleting}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition-colors text-xs font-semibold disabled:opacity-50"
                      >
                        {store.isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">

            <div className="flex items-center justify-between p-6 border-b border-brand-brown/10">
              <div>
                <h2 className="text-2xl font-bold text-brand-brown font-serif">
                  {editingId ? "Edit Coupon" : "Create Coupon"}
                </h2>
                <p className="text-sm text-brand-text-secondary mt-1">
                  {editingId ? "Update this promo code." : "Create a new promo code for the storefront."}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-brand-text-secondary hover:text-brand-brown rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="px-6 py-4 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Promo Code
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      className="w-full mt-1 rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm font-mono uppercase"
                      placeholder="WELCOME20"
                      disabled={!!editingId}
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Discount Type
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as CouponType })}
                      className="w-full mt-1 rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (₹)</option>
                    </select>
                  </label>

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    {form.type === "PERCENTAGE" ? "Discount %" : "Discount ₹"}
                    <input
                      type="number" min={0} max={form.type === "PERCENTAGE" ? 100 : undefined}
                      value={form.value}
                      onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                      className="w-full mt-1 rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                      placeholder={form.type === "PERCENTAGE" ? "20" : "100"}
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Minimum Order (₹)
                    <input
                      type="number" min={0}
                      value={form.minOrder}
                      onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                      className="w-full mt-1 rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                      placeholder="499"
                    />
                  </label>

                  {form.type === "PERCENTAGE" && (
                    <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                      Max Discount Amount (₹)
                      <input
                        type="number" min={0}
                        value={form.maxDiscount}
                        onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                        className="w-full mt-1 rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                        placeholder="200"
                      />
                    </label>
                  )}

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Usage Limit
                    <input
                      type="number" min={1}
                      value={form.usageLimit}
                      onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                      className="w-full mt-1 rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                      placeholder="100"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Expiry Date
                    <input
                      type="date"
                      value={form.expiryDate}
                      onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                      className="w-full mt-1 rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Status
                    <select
                      value={form.isActive ? "active" : "inactive"}
                      onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}
                      className="w-full mt-1 rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>
                </div>

                <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                  Description (optional)
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full mt-1 min-h-[100px] rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm resize-none"
                    placeholder="e.g. Welcome discount for new users"
                  />
                </label>
              </div>

              <div className="p-6 border-t border-brand-brown/10 bg-white flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 border border-brand-brown/10 rounded-full text-brand-brown hover:bg-brand-light transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={store.isCreating || store.isUpdating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-brown text-white rounded-full font-bold hover:bg-brand-gold transition-colors disabled:opacity-50"
                >
                  {(store.isCreating || store.isUpdating) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {editingId ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
