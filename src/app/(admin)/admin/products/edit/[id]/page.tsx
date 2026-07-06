"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminProductStore } from "@/store/adminProductStore";
import { catalogService } from "@/services/catalogService";
import { ArrowLeft, Plus, Trash2, Save, Loader2, ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ProductStatus } from "@/types/admin";

type VariantForm = {
  id?: string;
  name: string;
  sku: string;
  price: string;       // rupees display
  discountPrice: string;
  stock: string;
  weight: string;
  isDefault: boolean;
  displayLabel: string;
};

const EMPTY_VARIANT: VariantForm = {
  name: "Standard",
  sku: "",
  price: "",
  discountPrice: "",
  stock: "0",
  weight: "",
  isDefault: true,
  displayLabel: "",
};

const inputCls =
  "w-full px-4 py-2.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none text-sm transition-all";

const labelCls = "block text-xs font-bold text-brand-text-secondary mb-1.5 uppercase tracking-wider";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const { getProduct, updateProduct, isLoadingProduct, isUpdating, selectedProduct } =
    useAdminProductStore();

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [calories, setCalories] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState<ProductStatus>("ACTIVE");
  const [isFeatured, setFeatured] = useState(false);
  const [isBestSeller, setBestSeller] = useState(false);
  const [isNewArrival, setNewArrival] = useState(false);
  const [featuredOrder, setFeaturedOrder] = useState("");
  const [images, setImages] = useState<string[]>(["", "", ""]);
  const [primaryImageIdx, setPrimaryImageIdx] = useState(0);
  const [variants, setVariants] = useState<VariantForm[]>([{ ...EMPTY_VARIANT }]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Load categories
  useEffect(() => {
    catalogService.getCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setIsLoadingCats(false));
  }, []);

  // Load product from backend
  useEffect(() => {
    getProduct(productId);
  }, [productId, getProduct]);

  // Populate form when product loads
  useEffect(() => {
    if (!selectedProduct) return;
    const p = selectedProduct;
    setName(p.name || "");
    setDescription(p.description || "");
    setIngredients(p.ingredients || "");
    setCalories(p.calories || "");
    setCategoryId(
      typeof p.category === "object" ? (p.category as any).id || "" : ""
    );
    setSku(p.sku || "");
    setStatus(p.status || "ACTIVE");
    setFeatured(p.isFeatured ?? false);

    // Images: ensure at least 3 slots
    const imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || ""];
    const padded = [...imgs];
    while (padded.length < 3) padded.push("");
    setImages(padded);

    // Primary image index
    const primaryIdx = imgs.findIndex((img) => img === p.image) || 0;
    setPrimaryImageIdx(Math.max(primaryIdx, 0));

    // Tags
    setTags(Array.isArray(p.tags) ? p.tags : []);

    // Variants — convert paise → rupees for display
    if (p.variants && p.variants.length > 0) {
      setVariants(
        p.variants.map((v: any) => ({
          id: v.id,
          name: v.name || "Standard",
          sku: v.sku || "",
          price: v.price ? String(Math.round(v.price / 100)) : "",
          discountPrice: v.discountPrice ? String(Math.round(v.discountPrice / 100)) : "",
          stock: String(v.stock ?? v.stockQuantity ?? 0),
          weight: String(v.weight || ""),
          isDefault: v.isDefault ?? false,
          displayLabel: v.displayLabel || "",
        }))
      );
    }
  }, [selectedProduct]);

  const updateVariant = (idx: number, field: keyof VariantForm, val: string | boolean) => {
    const updated = [...variants];
    updated[idx] = { ...updated[idx], [field]: val };
    setVariants(updated);
  };

  const addVariant = () =>
    setVariants([...variants, { ...EMPTY_VARIANT, sku: `${sku}-V${variants.length + 1}`, isDefault: false }]);

  const removeVariant = (idx: number) => {
    if (variants.length <= 1) { toast.error("At least one variant is required."); return; }
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const updateImage = (idx: number, val: string) => {
    const updated = [...images];
    updated[idx] = val;
    setImages(updated);
  };

  const addImageSlot = () => setImages([...images, ""]);

  const removeImageSlot = (idx: number) => {
    if (images.length <= 1) return;
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    if (primaryImageIdx >= updated.length) setPrimaryImageIdx(0);
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) { toast.error("Product name is required."); return; }
    if (!categoryId) { toast.error("Please select a category."); return; }
    if (!sku.trim()) { toast.error("SKU is required."); return; }
    if (description.trim().length < 10) { toast.error("Description must be at least 10 characters."); return; }
    if (!ingredients.trim()) { toast.error("Ingredients are required."); return; }

    // Validate variants
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.sku.trim()) { toast.error(`Variant ${i + 1}: SKU is required.`); return; }
      if (!v.price || Number(v.price) <= 0) { toast.error(`Variant ${i + 1}: Valid price is required.`); return; }
    }

    const validImages = images.filter((u) => u.trim());
    if (validImages.length === 0) { toast.error("At least one product image URL is required."); return; }

    const imagePayload = validImages.map((url, idx) => ({
      url,
      isPrimary: idx === (primaryImageIdx < validImages.length ? primaryImageIdx : 0),
      altText: name,
    }));

    const variantPayload = variants.map((v) => ({
      name: v.name,
      sku: v.sku.trim().toUpperCase(),
      price: Math.round(Number(v.price) * 100),   // rupees → paise
      discountPrice: v.discountPrice
        ? Math.round(Number(v.discountPrice) * 100)
        : undefined,
      stockQuantity: Number(v.stock) || 0,
      weight: v.weight ? Number(v.weight) : undefined,
      isDefault: v.isDefault,
      displayLabel: v.displayLabel || undefined,
    }));

    try {
      await updateProduct(productId, {
        name: name.trim(),
        description: description.trim(),
        ingredients: ingredients.trim(),
        calories: calories.trim() || undefined,
        categoryId,
        images: imagePayload,
        status,
        isFeatured,
        isBestSeller,
        variants: variantPayload,
        tags,
      });
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update product. Please try again.");
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-brown" />
        <span className="ml-3 text-brand-text-secondary">Loading product…</span>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="text-center py-16 text-brand-text-secondary">
        Product not found.{" "}
        <Link href="/admin/products" className="text-brand-brown underline">Go back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="text-brand-text-secondary hover:text-brand-brown transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Edit Product</h1>
          <p className="text-sm text-brand-text-secondary mt-0.5">ID: {productId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic Info ──────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6 space-y-5">
          <h2 className="text-lg font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Product Name *</label>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>SKU *</label>
              <input className={inputCls} value={sku} onChange={(e) => setSku(e.target.value.toUpperCase())} required />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              {isLoadingCats ? (
                <div className="flex items-center gap-2 text-xs text-brand-text-secondary"><Loader2 className="w-4 h-4 animate-spin" /> Loading categories…</div>
              ) : (
                <select className={inputCls} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">— Select a category —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)}>
                <option value="ACTIVE">Active (Published)</option>
                <option value="INACTIVE">Inactive (Draft)</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Calories (e.g. "120 kcal / cookie")</label>
              <input className={inputCls} value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="120 kcal" />
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-6 pt-1">
            {[
              { label: "Featured Product", val: isFeatured, set: setFeatured },
              { label: "Best Seller", val: isBestSeller, set: setBestSeller },
              { label: "New Arrival", val: isNewArrival, set: setNewArrival },
            ].map(({ label, val, set }) => (
              <label key={label} className="flex items-center gap-2 text-sm font-medium text-brand-text-primary cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-brand-brown focus:ring-brand-gold w-4 h-4 cursor-pointer"
                  checked={val}
                  onChange={(e) => set(e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </section>

        {/* ── Description ─────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6 space-y-4">
          <h2 className="text-lg font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Descriptions</h2>
          <div>
            <label className={labelCls}>Full Description *</label>
            <textarea className={`${inputCls} min-h-[110px]`} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Ingredients *</label>
            <textarea className={`${inputCls} min-h-[80px]`} value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
          </div>
        </section>

        {/* ── Images ──────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6 space-y-4">
          <h2 className="text-lg font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Product Images</h2>
          <p className="text-xs text-brand-text-secondary">Enter full image URLs (from Cloudinary or your CDN). Click "Set Primary" to set the cover photo.</p>

          <div className="space-y-3">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {/* Preview thumbnail */}
                <div className="w-12 h-12 rounded-xl border border-brand-brown/15 overflow-hidden flex-shrink-0 bg-brand-light/50 flex items-center justify-center">
                  {img ? (
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-brand-brown/30" />
                  )}
                </div>
                <input
                  className={inputCls}
                  value={img}
                  onChange={(e) => updateImage(idx, e.target.value)}
                  placeholder={`Image ${idx + 1} URL`}
                />
                <button
                  type="button"
                  onClick={() => setPrimaryImageIdx(idx)}
                  className={`flex-shrink-0 text-xs font-bold px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
                    primaryImageIdx === idx
                      ? "bg-brand-brown text-white border-brand-brown"
                      : "bg-white text-brand-text-secondary border-brand-brown/20 hover:bg-brand-brown hover:text-white"
                  }`}
                >
                  {primaryImageIdx === idx ? "✓ Primary" : "Set Primary"}
                </button>
                <button type="button" onClick={() => removeImageSlot(idx)} className="flex-shrink-0 p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button type="button" onClick={addImageSlot} className="flex items-center gap-1.5 text-sm text-brand-gold font-semibold hover:text-brand-brown transition-colors cursor-pointer mt-1">
            <Plus className="w-4 h-4" /> Add Image URL
          </button>
        </section>

        {/* ── Variants ────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-brown/10 pb-2">
            <h2 className="text-lg font-bold text-brand-brown">Variants & Pricing</h2>
            <button type="button" onClick={addVariant} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-gold/20 text-brand-brown border border-brand-gold/40 hover:bg-brand-gold hover:text-white rounded-xl transition-colors text-xs font-bold cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add Variant
            </button>
          </div>
          <p className="text-xs text-brand-text-secondary -mt-2">Prices are in ₹ (Rupees). Each variant can have its own SKU, price, and stock.</p>

          <div className="space-y-4">
            {variants.map((v, idx) => (
              <div key={idx} className="p-4 bg-brand-light/30 border border-brand-brown/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">Variant {idx + 1}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-brand-text-primary cursor-pointer">
                      <input
                        type="radio"
                        name="defaultVariant"
                        checked={v.isDefault}
                        onChange={() => setVariants(variants.map((vv, ii) => ({ ...vv, isDefault: ii === idx })))}
                        className="cursor-pointer"
                      />
                      Default
                    </label>
                    <button type="button" onClick={() => removeVariant(idx)} className="text-xs font-bold text-rose-400 hover:text-rose-600 transition-colors cursor-pointer px-2 py-0.5 rounded-lg hover:bg-rose-50">
                      ✕ Remove
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Variant Name</label>
                    <input className={`${inputCls} text-xs`} value={v.name} onChange={(e) => updateVariant(idx, "name", e.target.value)} placeholder="e.g. 250g Box" />
                  </div>
                  <div>
                    <label className={labelCls}>SKU *</label>
                    <input className={`${inputCls} text-xs`} value={v.sku} onChange={(e) => updateVariant(idx, "sku", e.target.value.toUpperCase())} placeholder="PROD-250G" />
                  </div>
                  <div>
                    <label className={labelCls}>Display Label</label>
                    <input className={`${inputCls} text-xs`} value={v.displayLabel} onChange={(e) => updateVariant(idx, "displayLabel", e.target.value)} placeholder="250g" />
                  </div>
                  <div>
                    <label className={labelCls}>Price (₹) *</label>
                    <input type="number" min="0" step="0.01" className={`${inputCls} text-xs`} value={v.price} onChange={(e) => updateVariant(idx, "price", e.target.value)} placeholder="299" />
                  </div>
                  <div>
                    <label className={labelCls}>Discount Price (₹)</label>
                    <input type="number" min="0" step="0.01" className={`${inputCls} text-xs`} value={v.discountPrice} onChange={(e) => updateVariant(idx, "discountPrice", e.target.value)} placeholder="249" />
                  </div>
                  <div>
                    <label className={labelCls}>Stock Qty</label>
                    <input type="number" min="0" className={`${inputCls} text-xs`} value={v.stock} onChange={(e) => updateVariant(idx, "stock", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Weight (grams)</label>
                    <input type="number" min="0" className={`${inputCls} text-xs`} value={v.weight} onChange={(e) => updateVariant(idx, "weight", e.target.value)} placeholder="250" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tags ────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6 space-y-4">
          <h2 className="text-lg font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Tags</h2>
          <div className="flex space-x-2">
            <input
              className={inputCls}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              placeholder="e.g. Sweet, Nutty, Gifting…"
            />
            <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-brand-brown text-white rounded-xl text-sm font-semibold hover:bg-brand-gold transition-colors cursor-pointer flex-shrink-0">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-brand-light/50 border border-brand-brown/5 rounded-xl">
            {tags.map((t) => (
              <span key={t} className="px-3 py-1 bg-brand-brown text-white text-xs font-bold rounded-full flex items-center shadow-sm">
                {t}
                <button type="button" onClick={() => setTags(tags.filter((tag) => tag !== t))} className="ml-2 hover:text-brand-gold transition-colors cursor-pointer">×</button>
              </span>
            ))}
            {tags.length === 0 && <span className="text-xs text-brand-text-secondary/60 italic m-auto">No tags yet.</span>}
          </div>
        </section>

        {/* ── Submit ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/admin/products" className="text-sm text-brand-text-secondary hover:text-brand-brown transition-colors">
            ← Cancel
          </Link>
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center space-x-2 px-8 py-3 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{isUpdating ? "Saving…" : "Update Product"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
