"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useCallback } from "react";
import { Edit, Plus, Star, Trash2, AlertCircle, RefreshCw, Package } from "lucide-react";
import { toast } from "sonner";
import { useAdminProductStore } from "@/store/adminProductStore";

// ── Helpers ────────────────────────────────────────────────────────────────
function formatRupees(paise?: number) {
  if (paise == null) return "—";
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const store = useAdminProductStore();

  // ── Fetch on mount ────────────────────────────────────────────────────
  useEffect(() => {
    store.fetchProducts(1, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPage = useCallback(
    (page: number) => store.fetchProducts(page, store.pageSize),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.pageSize]
  );

  // ── Actions ───────────────────────────────────────────────────────────
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await store.deleteProduct(id);
      toast.success(`"${name}" deleted.`);
    } catch { /* toast shown by store */ }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await store.updateProduct(id, { isFeatured: !current } as any);
      toast.success(current ? "Removed from featured." : "Added to featured.");
    } catch { /* toast shown by store */ }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Products</h1>
          <p className="text-brand-text-secondary mt-1">
            {store.pagination
              ? `${store.pagination.total.toLocaleString()} products in catalogue`
              : "Manage your cookie catalogue"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => store.fetchProducts(store.currentPage, store.pageSize)}
            disabled={store.isLoadingProducts}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-brown/10 rounded-xl text-sm font-semibold text-brand-brown hover:bg-brand-light transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${store.isLoadingProducts ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors font-semibold text-sm"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Error */}
      {store.productsError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Error loading products</p>
            <p className="text-red-700 text-sm">{store.productsError}</p>
            <button
              onClick={() => store.fetchProducts(store.currentPage, store.pageSize)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {store.isLoadingProducts && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gradient-to-r from-brand-light to-brand-gold/10 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!store.isLoadingProducts && store.products.length === 0 && !store.productsError && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-12 text-center">
          <Package className="w-12 h-12 text-brand-gold/40 mx-auto mb-4" />
          <p className="text-brand-text-secondary text-lg font-semibold">No products yet</p>
          <p className="text-brand-text-secondary text-sm mt-1">Add your first product to get started.</p>
          <Link href="/admin/products/add" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-brand-brown text-white rounded-xl text-sm font-semibold hover:bg-brand-gold transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      )}

      {/* Products Table */}
      {!store.isLoadingProducts && store.products.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-light border-b border-brand-brown/10">
                  <th className="p-4 font-semibold text-brand-brown text-sm">Product</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Category</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Price</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Status</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Featured</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {store.products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-brand-brown/5 hover:bg-brand-light/50 transition-colors"
                  >
                    {/* Product */}
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-light shrink-0">
                          <Image
                            src={product.image || "/premium_cookie.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-brand-text-primary text-sm block">
                            {product.name}
                          </span>
                          <span className="text-xs text-brand-text-secondary font-mono">{product.sku}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-sm text-brand-text-secondary">
                      {product.category?.name ?? "—"}
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      {product.discountPrice ? (
                        <div>
                          <span className="text-emerald-700 font-semibold text-sm block">
                            {formatRupees(product.discountPrice)}
                          </span>
                          <span className="text-xs line-through text-brand-text-secondary">
                            {formatRupees(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-brand-text-primary">{formatRupees(product.price)}</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        product.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : product.status === "INACTIVE"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}>
                        {product.status}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                        disabled={store.isUpdating}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                          product.isFeatured
                            ? "bg-brand-brown text-white hover:bg-brand-gold"
                            : "bg-brand-light text-brand-text-secondary hover:text-brand-brown hover:bg-brand-gold/15"
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${product.isFeatured ? "fill-current" : ""}`} />
                        {product.isFeatured ? "Featured" : "Set Featured"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={store.isDeleting}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!store.isLoadingProducts && store.pagination && store.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          <button
            disabled={store.currentPage <= 1}
            onClick={() => fetchPage(store.currentPage - 1)}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          {Array.from({ length: store.pagination.totalPages }, (_, i) => i + 1)
            .filter(p => Math.abs(p - store.currentPage) <= 2 || p === 1 || p === store.pagination!.totalPages)
            .map((page, idx, arr) => (
              <>
                {idx > 0 && arr[idx - 1] !== page - 1 && (
                  <span key={`e-${page}`} className="px-2 py-2 text-brand-text-secondary text-sm">…</span>
                )}
                <button
                  key={page}
                  onClick={() => fetchPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    store.currentPage === page
                      ? "bg-brand-brown text-white"
                      : "bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20"
                  }`}
                >
                  {page}
                </button>
              </>
            ))}
          <button
            disabled={store.currentPage >= store.pagination.totalPages}
            onClick={() => fetchPage(store.currentPage + 1)}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
