"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAdminProductStore } from "@/store/adminProductStore";
import { ProductStatus } from "@/types/admin";
import { catalogService } from "@/services/catalogService";
import { siteService } from "@/services/siteService";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { getProduct, updateProduct, selectedProduct, isLoadingProduct, productError, isUpdating } = useAdminProductStore();

  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [calories, setCalories]       = useState("");
  const [categoryId, setCategoryId]   = useState("");
  const [price, setPrice]             = useState("");
  const [discountPrice, setDiscount]  = useState("");
  const [status, setStatus]           = useState<ProductStatus>("ACTIVE");
  const [isFeatured, setFeatured]     = useState(false);
  const [isBestSeller, setBestSeller] = useState(false);
  const [inStock, setInStock]         = useState(true);
  const [images, setImages]           = useState<string[]>(["", "", ""]);
  const [tags, setTags]               = useState("");
  const [categories, setCategories]   = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  const [selectedMood, setSelectedMood] = useState("");
  const [moods, setMoods]             = useState<string[]>([]);
  const [isLoadingMoods, setIsLoadingMoods] = useState(true);

  // ── Load product and categories ───────────────────────────────────────
  useEffect(() => {
    if (id) getProduct(id);
    
    async function loadData() {
      try {
        const cats = await catalogService.getCategories();
        setCategories(cats);
      } catch (err) {
        toast.error("Failed to load categories.");
      } finally {
        setIsLoadingCategories(false);
      }

      try {
        const settings = await siteService.getSettings();
        if (settings && settings.shopByMoodList) {
          const parsed = JSON.parse(settings.shopByMoodList);
          if (Array.isArray(parsed)) {
            setMoods(parsed.map((m: any) => m.name));
          }
        }
      } catch (err) {
        console.error("Failed to load moods settings:", err);
      } finally {
        setIsLoadingMoods(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Pre-populate form when product loads ─────────────────────────────
  useEffect(() => {
    if (!selectedProduct) return;
    setName(selectedProduct.name);
    setDescription(selectedProduct.description ?? "");
    setIngredients(selectedProduct.ingredients ?? "");
    setCalories(selectedProduct.calories ?? "");
    setCategoryId(selectedProduct.category?.id ?? "");
    setPrice((selectedProduct.price / 100).toString());
    setDiscount(selectedProduct.discountPrice ? (selectedProduct.discountPrice / 100).toString() : "");
    setStatus(selectedProduct.status);
    setFeatured(selectedProduct.isFeatured);
    setBestSeller(selectedProduct.isBestSeller ?? (selectedProduct.tags?.includes("Best Seller") || false));
    setInStock(selectedProduct.inStock ?? true);
    setImages(selectedProduct.images?.length ? [...selectedProduct.images, "", ""].slice(0, 3) : ["", "", ""]);
    
    // Extract matching mood from product tags
    if (selectedProduct.tags && moods.length > 0) {
      const match = selectedProduct.tags.find(t => moods.some(m => m.toLowerCase() === t.toLowerCase()));
      if (match) {
        const exactMood = moods.find(m => m.toLowerCase() === match.toLowerCase()) || match;
        setSelectedMood(exactMood);
      } else {
        setSelectedMood("");
      }
    } else {
      setSelectedMood("");
    }
    
    // Filter out mood from tags input text
    const otherTags = selectedProduct.tags 
      ? selectedProduct.tags.filter(t => !moods.some(m => m.toLowerCase() === t.toLowerCase())) 
      : [];
    setTags(otherTags.join(", "));
  }, [selectedProduct, moods]);

  const updateImage = (idx: number, val: string) => {
    const updated = [...images];
    updated[idx] = val;
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Product name is required."); return; }
    if (!categoryId.trim()) { toast.error("Category is required."); return; }
    if (!description.trim() || description.trim().length < 10) { 
      toast.error("Description must be at least 10 characters."); 
      return; 
    }
    if (!ingredients.trim()) { toast.error("Ingredients list is required."); return; }
    
    const cleanImages = images.filter(Boolean);
    if (cleanImages.length === 0) { toast.error("At least one image URL is required."); return; }

    const productVariants = selectedProduct?.variants || [];
    const defaultVariant = productVariants.find((v: any) => v.isDefault) || productVariants[0];
    
    let updatedVariants = [];
    if (productVariants.length > 0) {
      updatedVariants = productVariants.map((v: any) => {
        if (v.id === defaultVariant?.id || productVariants.length === 1) {
          return {
            name: v.name,
            sku: v.sku,
            price: Math.round(Number(price) * 100),
            discountPrice: discountPrice ? Math.round(Number(discountPrice) * 100) : null,
            stockQuantity: v.stock || 100,
            isDefault: v.isDefault ?? true,
          };
        }
        return {
          name: v.name,
          sku: v.sku,
          price: Math.round(v.price), // already in Paise in DTO
          discountPrice: v.discountPrice ? Math.round(v.discountPrice) : null, // already in Paise in DTO
          stockQuantity: v.stock || 100,
          isDefault: v.isDefault ?? false,
        };
      });
    } else {
      updatedVariants = [{
        name: "Standard Box",
        sku: `${selectedProduct?.sku || "SKU-9"}-DEFAULT`,
        price: Math.round(Number(price) * 100),
        discountPrice: discountPrice ? Math.round(Number(discountPrice) * 100) : null,
        stockQuantity: 100,
        isDefault: true,
      }];
    }

    try {
      await updateProduct(id, {
        name: name.trim(),
        description: description.trim(),
        ingredients: ingredients.trim(),
        calories: calories.trim() || null,
        categoryId: categoryId.trim(),
        images: cleanImages.map((url, idx) => ({
          url,
          isPrimary: idx === 0,
          altText: `${name.trim()} image ${idx + 1}`
        })),
        status,
        inStock,
        isFeatured,
        isBestSeller,
        variants: updatedVariants,
        tags: Array.from(new Set(
          [selectedMood, ...tags.split(",").map(t => t.trim()).filter(Boolean)]
        )).filter(Boolean),
      } as any);
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
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-brand-brown/10 shadow-sm space-y-4">
          <h2 className="font-bold text-brand-brown text-base">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Product Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              {isLoadingCategories ? (
                <div className="text-sm text-brand-text-secondary py-2.5">Loading categories...</div>
              ) : (
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass} required>
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className={labelClass}>SKU (Read Only)</label>
              <input type="text" value={selectedProduct?.sku || ""} className={`${inputClass} bg-brand-light/50 text-brand-text-secondary font-mono`} disabled />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description * (Minimum 10 characters)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} min-h-[100px] resize-none`} required />
              <p className="text-xs text-brand-text-secondary mt-1">
                {description.length}/10 characters minimum
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Ingredients *</label>
              <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} className={`${inputClass} min-h-[80px] resize-none`} required />
            </div>
            <div>
              <label className={labelClass}>Calories (e.g. 220 kcal)</label>
              <input type="text" value={calories} onChange={e => setCalories(e.target.value)} className={inputClass} placeholder="e.g. 220 kcal (optional)" />
            </div>
            <div>
              <label className={labelClass}>Mood</label>
              {isLoadingMoods ? (
                <div className="text-sm text-brand-text-secondary py-2.5">Loading moods...</div>
              ) : (
                <select value={selectedMood} onChange={e => setSelectedMood(e.target.value)} className={inputClass}>
                  <option value="">Select Mood (Optional)</option>
                  {moods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Status */}
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
            <div className="sm:col-span-2 flex flex-wrap gap-6 mt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="w-4 h-4 accent-brand-brown" />
                <span className="text-sm font-semibold text-brand-text-primary">Product is In Stock</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={isFeatured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 accent-brand-brown" />
                <span className="text-sm font-semibold text-brand-text-primary">Mark as Featured Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={isBestSeller} onChange={e => setBestSeller(e.target.checked)} className="w-4 h-4 accent-brand-brown" />
                <span className="text-sm font-semibold text-brand-text-primary">Mark as Best Seller</span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white p-6 rounded-2xl border border-brand-brown/10 shadow-sm space-y-4">
          <h2 className="font-bold text-brand-brown text-base">Product Images</h2>
          <p className="text-xs text-brand-text-secondary">First image is the primary display image.</p>
          <div className="space-y-2">
            {images.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-text-secondary w-6">{idx + 1}.</span>
                <input type="text" value={url} onChange={e => updateImage(idx, e.target.value)} className={`${inputClass} flex-1`} placeholder={`Image ${idx + 1} URL or path (e.g. /image.png or https://...)`} />
              </div>
            ))}
          </div>
        </div>



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
