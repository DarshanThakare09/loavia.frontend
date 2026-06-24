"use client";

import { useState, useEffect } from "react";
import { useAdminInventoryStore } from "@/store/adminInventoryStore";
import { InventoryDTO, RestockRequestDTO, AdjustInventoryRequestDTO } from "@/types/admin";
import {
  Package, AlertCircle, Loader2, RefreshCw, Plus, X,
  ArrowDown, ArrowUp, PackageX,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────

function StockBar({ available, total }: { available: number; total: number }) {
  if (total === 0) return <div className="h-1.5 bg-gray-100 rounded-full w-full" />;
  const pct = Math.min((available / total) * 100, 100);
  const color =
    pct > 40 ? "bg-emerald-400" :
    pct > 15 ? "bg-amber-400" :
    "bg-rose-500";
  return (
    <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

const ADJUST_REASONS = [
  "Damage", "Shrinkage", "Correction", "Return to Stock",
  "Sample / Tasting", "Spoilage", "Other",
];

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminInventoryPage() {
  const store = useAdminInventoryStore();

  const [restockModal, setRestockModal] = useState<InventoryDTO | null>(null);
  const [adjustModal, setAdjustModal]   = useState<InventoryDTO | null>(null);

  // Restock form state
  const [restockQty, setRestockQty] = useState("");

  // Adjust form state
  const [adjustQty, setAdjustQty]       = useState("");
  const [adjustReason, setAdjustReason] = useState(ADJUST_REASONS[0]);

  // ── Fetch on mount ────────────────────────────────────────────────────
  useEffect(() => {
    store.fetchLowStockItems(1, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleRestock = async () => {
    if (!restockModal || !restockQty || Number(restockQty) <= 0) return;
    const dto: RestockRequestDTO = {
      variantId: restockModal.variantId,
      quantity: Number(restockQty),
    };
    try {
      await store.restockInventory(dto);
      setRestockModal(null);
      setRestockQty("");
      // Refresh list so counts update
      store.fetchLowStockItems(store.currentPage, store.pageSize);
    } catch { /* toast shown by store */ }
  };

  const handleAdjust = async () => {
    if (!adjustModal) return;
    const qty = Number(adjustQty);
    if (adjustQty === "" || qty === 0) return;
    const dto: AdjustInventoryRequestDTO = {
      variantId: adjustModal.variantId,
      quantity: qty,
      reason: adjustReason,
    };
    try {
      await store.adjustInventory(dto);
      setAdjustModal(null);
      setAdjustQty("");
      setAdjustReason(ADJUST_REASONS[0]);
      store.fetchLowStockItems(store.currentPage, store.pageSize);
    } catch { /* toast shown by store */ }
  };

  const fetchPage = (page: number) => store.fetchLowStockItems(page, store.pageSize);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Inventory</h1>
          <p className="text-brand-text-secondary mt-1">
            {store.pagination
              ? `${store.pagination.total} low-stock variants`
              : "Monitor and manage product stock levels"}
          </p>
        </div>
        <button
          onClick={() => store.fetchLowStockItems(store.currentPage, store.pageSize)}
          disabled={store.isLoadingLowStock}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-brown/10 rounded-xl text-sm font-semibold text-brand-brown hover:bg-brand-light transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${store.isLoadingLowStock ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {store.lowStockError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Error loading inventory</p>
            <p className="text-red-700 text-sm">{store.lowStockError}</p>
            <button
              onClick={() => store.fetchLowStockItems(store.currentPage, store.pageSize)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {store.isLoadingLowStock && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gradient-to-r from-brand-light to-brand-gold/10 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!store.isLoadingLowStock && store.lowStockItems.length === 0 && !store.lowStockError && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-12 text-center">
          <Package className="w-12 h-12 text-emerald-400/60 mx-auto mb-4" />
          <p className="text-brand-text-secondary text-lg font-semibold">All stock levels are healthy</p>
          <p className="text-brand-text-secondary text-sm mt-1">No variants are below their low-stock threshold.</p>
        </div>
      )}

      {/* Table */}
      {!store.isLoadingLowStock && store.lowStockItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-light border-b border-brand-brown/10">
                  <th className="p-4 font-semibold text-brand-brown text-sm">Product / Variant</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Available</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Reserved</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Total</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Threshold</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Level</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {store.lowStockItems.map((item) => {
                  const isCritical = item.availableQty <= Math.floor(item.lowStockThreshold * 0.3);
                  return (
                    <tr key={item.variantId} className="border-b border-brand-brown/5 hover:bg-brand-light/40 transition-colors">
                      <td className="p-4">
                        <div>
                          <span className="font-semibold text-brand-text-primary text-sm block">{item.productName}</span>
                          <span className="text-xs text-brand-text-secondary">{item.variantName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold text-sm ${isCritical ? "text-rose-600" : "text-amber-600"}`}>
                          {item.availableQty}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-brand-text-secondary">{item.reservedQty}</td>
                      <td className="p-4 text-sm font-semibold text-brand-text-primary">{item.totalQty}</td>
                      <td className="p-4">
                        <span className="text-xs text-brand-text-secondary bg-brand-light px-2 py-1 rounded-lg">
                          ≤ {item.lowStockThreshold}
                        </span>
                      </td>
                      <td className="p-4 w-32">
                        <StockBar available={item.availableQty} total={item.totalQty} />
                        <span className="text-xs text-brand-text-secondary mt-1 block">
                          {item.totalQty > 0 ? Math.round((item.availableQty / item.totalQty) * 100) : 0}% available
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setRestockModal(item); setRestockQty(""); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors border border-emerald-200"
                            title="Restock"
                          >
                            <Plus className="w-3.5 h-3.5" /> Restock
                          </button>
                          <button
                            onClick={() => { setAdjustModal(item); setAdjustQty(""); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors border border-blue-200"
                            title="Adjust"
                          >
                            Adjust
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!store.isLoadingLowStock && store.pagination && store.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          <button disabled={store.currentPage <= 1} onClick={() => fetchPage(store.currentPage - 1)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20 disabled:opacity-40 disabled:cursor-not-allowed">
            ← Prev
          </button>
          {Array.from({ length: store.pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => fetchPage(page)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${store.currentPage === page ? "bg-brand-brown text-white" : "bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20"}`}>
              {page}
            </button>
          ))}
          <button disabled={store.currentPage >= store.pagination.totalPages} onClick={() => fetchPage(store.currentPage + 1)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20 disabled:opacity-40 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>
      )}

      {/* ── Restock Modal ─────────────────────────────────────────────────── */}
      {restockModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-brand-brown/10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-brand-brown/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-brand-brown flex items-center gap-2">
                  <ArrowUp className="w-5 h-5 text-emerald-600" /> Restock Inventory
                </h3>
                <p className="text-sm text-brand-text-secondary mt-1">{restockModal.productName} · {restockModal.variantName}</p>
              </div>
              <button onClick={() => setRestockModal(null)} className="p-2 hover:bg-brand-light rounded-full transition-colors">
                <X className="w-5 h-5 text-brand-text-secondary" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary">Current available:</span>
                <span className="font-bold text-brand-brown">{restockModal.availableQty} units</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1">Quantity to Add *</label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={e => setRestockQty(e.target.value)}
                  className="w-full px-4 py-2.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm"
                  placeholder="e.g. 50"
                  autoFocus
                />
              </div>
              {restockQty && Number(restockQty) > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-700">
                  New total: <strong>{restockModal.availableQty + Number(restockQty)} units</strong>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-brand-brown/10 flex justify-end gap-3">
              <button onClick={() => setRestockModal(null)} className="px-5 py-2.5 border border-brand-brown/10 rounded-xl text-brand-brown font-semibold text-sm hover:bg-brand-light">
                Cancel
              </button>
              <button
                onClick={handleRestock}
                disabled={store.isRestocking || !restockQty || Number(restockQty) <= 0}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
              >
                {store.isRestocking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Adjust Modal ──────────────────────────────────────────────────── */}
      {adjustModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-brand-brown/10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-brand-brown/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-brand-brown flex items-center gap-2">
                  <PackageX className="w-5 h-5 text-blue-600" /> Adjust Inventory
                </h3>
                <p className="text-sm text-brand-text-secondary mt-1">{adjustModal.productName} · {adjustModal.variantName}</p>
              </div>
              <button onClick={() => setAdjustModal(null)} className="p-2 hover:bg-brand-light rounded-full transition-colors">
                <X className="w-5 h-5 text-brand-text-secondary" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary">Current available:</span>
                <span className="font-bold text-brand-brown">{adjustModal.availableQty} units</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1">
                  Quantity Adjustment * <span className="text-xs font-normal text-brand-text-secondary">(positive to add, negative to remove)</span>
                </label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={e => setAdjustQty(e.target.value)}
                  className="w-full px-4 py-2.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm"
                  placeholder="e.g. -5 or +10"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1">Reason *</label>
                <select
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-2.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm bg-white"
                >
                  {ADJUST_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {adjustQty !== "" && Number(adjustQty) !== 0 && (
                <div className={`border rounded-xl p-3 text-sm ${
                  Number(adjustQty) > 0
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-rose-50 border-rose-200 text-rose-700"
                }`}>
                  {Number(adjustQty) > 0 ? <ArrowUp className="w-4 h-4 inline mr-1" /> : <ArrowDown className="w-4 h-4 inline mr-1" />}
                  New available: <strong>{Math.max(0, adjustModal.availableQty + Number(adjustQty))} units</strong>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-brand-brown/10 flex justify-end gap-3">
              <button onClick={() => setAdjustModal(null)} className="px-5 py-2.5 border border-brand-brown/10 rounded-xl text-brand-brown font-semibold text-sm hover:bg-brand-light">
                Cancel
              </button>
              <button
                onClick={handleAdjust}
                disabled={store.isAdjusting || adjustQty === "" || Number(adjustQty) === 0}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {store.isAdjusting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
