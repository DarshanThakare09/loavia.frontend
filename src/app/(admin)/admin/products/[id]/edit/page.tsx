"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAdminProductStore } from "@/store/adminProductStore";
import { ProductStatus } from "@/types/admin";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { getProduct, updateProduct, selectedProduct, isLoadingProduct, productError, isUpdating } = useAdminProductStore();

  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice]             = useState("");
  const [discountPrice, setDiscount]  = useState("");
  const [status, setStatus]           = useState<ProductStatus>("ACTIVE");
  const [isFeatured, setFeatured]     = useState(false);
  const [images, setImages]           = useState<string[]>(["", "", ""]);
  const [tags, setTags]               = useState("");

  // ── Load product ─────────────────────────────────────────────────────
  useEffect(() => {
    if (id) getProduct(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Pre-populate form when product loads ─────────────────────────────
  useEffect(() => {
    if (!selectedProduct) return;
    setName(selectedProduct.name);
    setDescription(selectedProduct.description ?? "");
    setPrice((selectedProduct.price / 100).toString());
    setDiscount(selectedProduct.discountPrice ? (selectedProduct.discountPrice / 100).toString() : "");
    setStatus(selectedProduct.status);
    setFeatured(selectedProduct.isFeatured);
    setImages(selectedProduct.images?.length ? [...selectedProduct.images, "", ""].slice(0, 3) : ["", "", ""]);
    setTags(selectedProduct.tags?.join(", ") ?? "");
  }, [selectedProduct]);

  const updateImage = (idx: number, val: string) => {
    const updated = [...images];
    updated[idx] = val;
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Product name is required."); return; }
    const cleanImages = images.filter(Boolean);
    if (cleanImages.length === 0) { toast.error("At least one image URL is required."); return; }

    try {
      await updateProduct(id, {
        name: name.trim(),
        description: description.trim(),
        price: Math.round(Number(price) * 100),
        discountPrice: discountPrice ? Math.round(Number(discountPrice) * 100) : undefined,
        images: cleanImages,
        status,
        isFeatured,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      });
      toast.success("Product updated.");
      router.push("/admin/products");
    } catch { /* toast shown by store */ }
  };

  const inputClass = "w-full px-4 py-2.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm";
  const labelClass = "block text-sm font-semibold text-brand-text-primary mb-1";

  // ── Loading State ─────────────────────────────────────────────────────
  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
          <p className="text-brand-text-secondary text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  // ── Error State ───────────────────────────────────────────────────────
  if (productError) {
    return (
      <div className="max-w-3xl">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">Failed to load product</p>
            <p className="text-red-700 text-sm mt-1">{productError}</p>
            <button onClick={() => getProduct(id)} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300 pb-16">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-brand-light rounded-xl transition-colors text-brand-text-secondary hover:text-brand-brown">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-brand-brown font-serif">Edit Product</h1>
          {selectedProduct && (
            <p className="text-brand-text-secondary text-sm mt-0.5 font-mono">{selectedProduct.sku}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-brand-brown/10 shadow-sm space-y-4">
          <h2 className="font-bold text-brand-brown text-base">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Product Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} required />
            </div>
            {selectedProduct && (
              <div className="sm:col-span-2">
                <label className={labelClass}>Category</label>
                <input type="text" value={selectedProduct.category?.name ?? "—"} className={`${inputClass} bg-brand-light/50 text-brand-text-secondary`} disabled />
              </div>
            )}
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} min-h-[100px] resize-none`} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-brown/10 shadow-sm space-y-4">
          <h2 className="font-bold text-brand-brown text-base">Pricing & Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Discount Price (₹)</label>
              <input type="number" min="0" step="0.01" value={discountPrice} onChange={e => setDiscount(e.target.value)} className={inputClass} placeholder="Optional" />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as ProductStatus)} className={inputClass}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Tags (comma-separated)</label>
              <input type="text" value={tags} onChange={e => setTags(e.target.value)} className={inputClass} placeholder="healthy, gift, bestseller" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="featured" checked={isFeatured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 accent-brand-brown" />
              <label htmlFor="featured" className="text-sm font-semibold text-brand-text-primary cursor-pointer">Mark as Featured Product</label>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-brown/10 shadow-sm space-y-4">
          <h2 className="font-bold text-brand-brown text-base">Product Images</h2>
          <p className="text-xs text-brand-text-secondary">First image is the primary display image.</p>
          <div className="space-y-2">
            {images.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-text-secondary w-6">{idx + 1}.</span>
                <input type="url" value={url} onChange={e => updateImage(idx, e.target.value)} className={`${inputClass} flex-1`} placeholder={`Image ${idx + 1} URL`} />
              </div>
            ))}
          </div>
        </div>

        {/* Existing variants (read-only) */}
        {selectedProduct?.variants && selectedProduct.variants.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-brand-brown/10 shadow-sm">
            <h2 className="font-bold text-brand-brown text-base mb-3">Existing Variants</h2>
            <p className="text-xs text-brand-text-secondary mb-4">Manage individual variant stock via the Inventory page.</p>
            <div className="space-y-2">
              {selectedProduct.variants.map(v => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-brand-light/40 rounded-xl text-sm">
                  <div>
                    <span className="font-semibold text-brand-brown">{v.name}</span>
                    <span className="text-xs text-brand-text-secondary ml-2 font-mono">{v.sku}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-brand-text-secondary">
                    <span>₹{(v.price / 100).toLocaleString()}</span>
                    <span className={`font-bold ${v.stock <= 5 ? "text-rose-600" : "text-emerald-700"}`}>
                      {v.stock} in stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.push("/admin/products")} className="px-6 py-2.5 border border-brand-brown/10 rounded-xl text-brand-brown font-semibold text-sm hover:bg-brand-light transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isUpdating} className="flex items-center gap-2 px-6 py-2.5 bg-brand-brown text-white rounded-xl font-semibold text-sm hover:bg-brand-gold transition-colors disabled:opacity-50">
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
