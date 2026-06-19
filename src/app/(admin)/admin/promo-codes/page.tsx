"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus, Edit3, Trash2, CheckCircle2, X, Tag } from "lucide-react";
import { usePromoStore, PromoCode } from "@/store/promoStore";
import { toast } from "sonner";

type DiscountType = "percentage" | "fixed";

type PromoFormState = {
  code: string;
  type: DiscountType;
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  expiry: string;
  status: "Active" | "Inactive";
  description: string;
};

const emptyForm: PromoFormState = {
  code: "",
  type: "percentage",
  value: 20,
  minOrder: 499,
  maxDiscount: 200,
  usageLimit: 100,
  expiry: "",
  status: "Active",
  description: "",
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

export default function AdminPromoCodesPage() {
  const promoCodes = usePromoStore((state) => state.promoCodes);
  const addPromoCode = usePromoStore((state) => state.addPromoCode);
  const updatePromoCode = usePromoStore((state) => state.updatePromoCode);
  const deletePromoCode = usePromoStore((state) => state.deletePromoCode);
  const togglePromoCodeActive = usePromoStore((state) => state.togglePromoCodeActive);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PromoFormState>(emptyForm);

  const sortedPromoCodes = useMemo(
    () => [...promoCodes].sort((a, b) => a.code.localeCompare(b.code)),
    [promoCodes]
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const handleEdit = (promo: PromoCode) => {
    setEditingId(promo.id);
    setForm({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      minOrder: promo.minOrder,
      maxDiscount: promo.maxDiscount ?? 0,
      usageLimit: promo.usageLimit,
      expiry: promo.expiry ? promo.expiry.slice(0, 10) : "",
      status: promo.isActive ? "Active" : "Inactive",
      description: promo.description ?? "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (promo: PromoCode) => {
    if (!confirm(`Delete promo "${promo.code}"? This cannot be undone.`)) return;
    deletePromoCode(promo.id);
    toast.success(`Promo code ${promo.code} deleted.`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = form.code.trim().toUpperCase();
    if (!code) {
      toast.error("Promo code is required.");
      return;
    }

    const duplicate = promoCodes.some(
      (item) => item.code.toUpperCase() === code && item.id !== editingId
    );
    if (duplicate) {
      toast.error("A promo code with this code already exists.");
      return;
    }

    if (form.value <= 0) {
      toast.error("Discount value must be greater than zero.");
      return;
    }

    if (form.type === "percentage" && (form.value <= 0 || form.value > 100)) {
      toast.error("Percentage value must be between 1 and 100.");
      return;
    }

    if (form.type === "percentage" && form.maxDiscount <= 0) {
      toast.error("Maximum discount is required for percentage promo codes.");
      return;
    }

    if (form.minOrder < 0) {
      toast.error("Minimum order amount cannot be negative.");
      return;
    }

    if (form.usageLimit <= 0) {
      toast.error("Usage limit must be greater than zero.");
      return;
    }

    if (form.expiry) {
      const expiryDate = new Date(form.expiry);
      if (Number.isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
        toast.error("Expiry date must be a valid future date.");
        return;
      }
    }

    const payload = {
      code,
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder),
      maxDiscount: form.type === "percentage" ? Number(form.maxDiscount) : undefined,
      usageLimit: Number(form.usageLimit),
      expiry: form.expiry ? new Date(form.expiry).toISOString() : null,
      isActive: form.status === "Active",
      description: form.description.trim() || undefined,
    };

    if (editingId) {
      updatePromoCode(editingId, payload);
      toast.success("Promo code updated.");
    } else {
      addPromoCode(payload);
      toast.success("Promo code created.");
    }

    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Promo Codes</h1>
          <p className="text-brand-text-secondary mt-1">Manage promo codes that work across the storefront.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-6 py-3 font-bold text-white bg-brand-brown rounded-full hover:bg-brand-gold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Promo Code
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-brand-brown/10 overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-brand-light text-brand-brown text-sm uppercase tracking-[0.18em] font-semibold">
            <tr>
              <th className="px-5 py-4">Promo Code</th>
              <th className="px-5 py-4">Discount Type</th>
              <th className="px-5 py-4">Discount Value</th>
              <th className="px-5 py-4">Minimum Order</th>
              <th className="px-5 py-4">Maximum Discount</th>
              <th className="px-5 py-4">Usage Limit</th>
              <th className="px-5 py-4">Times Used</th>
              <th className="px-5 py-4">Expiry Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPromoCodes.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-5 py-10 text-center text-brand-text-secondary">
                  No promo codes created yet.
                </td>
              </tr>
            ) : (
              sortedPromoCodes.map((promo) => (
                <tr key={promo.id} className="border-t border-brand-brown/10 hover:bg-brand-light/60 transition-colors">
                  <td className="px-5 py-4 font-semibold text-brand-brown">{promo.code}</td>
                  <td className="px-5 py-4 text-sm text-brand-text-secondary capitalize">{promo.type}</td>
                  <td className="px-5 py-4 text-sm text-brand-text-primary">
                    {promo.type === "percentage" ? `${promo.value}%` : `₹${promo.value}`}
                  </td>
                  <td className="px-5 py-4 text-sm text-brand-text-primary">{formatCurrency(promo.minOrder)}</td>
                  <td className="px-5 py-4 text-sm text-brand-text-primary">
                    {promo.type === "percentage" ? formatCurrency(promo.maxDiscount ?? 0) : "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-brand-text-primary">{promo.usageLimit}</td>
                  <td className="px-5 py-4 text-sm text-brand-text-primary">{promo.timesUsed}</td>
                  <td className="px-5 py-4 text-sm text-brand-text-primary">{formatDate(promo.expiry)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${promo.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                      {promo.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 space-x-2 text-sm">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-brand-brown/10 text-brand-brown rounded-xl hover:bg-brand-brown/15 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => togglePromoCodeActive(promo.id)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${promo.isActive ? "bg-rose-50 text-rose-700 hover:bg-rose-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
                    >
                      {promo.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => handleDelete(promo)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl h-full max-h-[calc(100vh-48px)] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-brand-brown/10 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-brand-brown">
                  {editingId ? "Edit Promo Code" : "Create Promo Code"}
                </h2>
                <p className="text-sm text-brand-text-secondary mt-1">
                  {editingId ? "Update the selected promo code." : "Create a new promo code for the storefront."}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-brand-text-secondary hover:text-brand-brown rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
              <div className="overflow-y-auto px-6 py-4 flex-1 min-h-0 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Promo Code
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      className="w-full rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                      placeholder="WELCOME20"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Discount Type
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as DiscountType })}
                      className="w-full rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </label>

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Discount Value
                    <input
                      type="number"
                      min="0"
                      value={form.value}
                      onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                      placeholder={form.type === "percentage" ? "20" : "100"}
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Minimum Order Amount
                    <input
                      type="number"
                      min="0"
                      value={form.minOrder}
                      onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                      placeholder="499"
                    />
                  </label>

                  {form.type === "percentage" && (
                    <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                      Maximum Discount Amount
                      <input
                        type="number"
                        min="0"
                        value={form.maxDiscount}
                        onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                        className="w-full rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                        placeholder="200"
                      />
                    </label>
                  )}

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Usage Limit
                    <input
                      type="number"
                      min="1"
                      value={form.usageLimit}
                      onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                      placeholder="100"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Expiry Date
                    <input
                      type="date"
                      value={form.expiry}
                      onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                      className="w-full rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                    Status
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Inactive" })}
                      className="w-full rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>
                </div>

                <label className="space-y-2 text-sm font-medium text-brand-text-primary">
                  Description (optional)
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full min-h-[120px] rounded-2xl border border-brand-brown/10 px-4 py-3 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-sm resize-none"
                    placeholder="Add an optional description for this promo code"
                  />
                </label>
              </div>

              <div className="sticky bottom-0 z-10 p-6 border-t border-brand-brown/10 bg-white flex flex-col gap-3 sm:flex-row sm:justify-end flex-shrink-0">
                <span className="text-sm text-brand-brown font-semibold">FOOTER TEST - IF YOU SEE THIS THE FOOTER IS RENDERING</span>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 border border-brand-brown/10 rounded-full text-brand-brown hover:bg-brand-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-brown text-white rounded-full font-bold hover:bg-brand-gold transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingId ? "Save Changes" : "Create Promo Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
