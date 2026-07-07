"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useAdminProductStore } from "@/store/adminProductStore";
import { ProductStatus } from "@/types/admin";
import { catalogService } from "@/services/catalogService";
import { siteService } from "@/services/siteService";

export default function AddProductPage() {
  const router = useRouter();
  const { createProduct, isCreating } = useAdminProductStore();

  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [calories, setCalories]       = useState("");
  const [categoryId, setCategoryId]   = useState("");
  const [price, setPrice]             = useState("");
  const [discountPrice, setDiscount]  = useState("");
  const [sku, setSku]                 = useState("");
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

  // Load categories & moods
  useEffect(() => {
    async function loadData() {
      try {
        const cats = await catalogService.getCategories();
        setCategories(cats);
        if (cats.length > 0) {
          setCategoryId(cats[0].id);
        }
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
  }, []);

  const updateImage = (idx: number, val: string) => {
    const updated = [...images];
    updated[idx] = val;
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim())        { toast.error("Product name is required."); return; }
    if (!sku.trim())         { toast.error("SKU is required."); return; }
    if (!categoryId.trim())  { toast.error("Category is required."); return; }
    if (!description.trim() || description.trim().length < 10) { 
      toast.error("Description must be at least 10 characters."); 
      return; 
    }
    if (!ingredients.trim()) { toast.error("Ingredients list is required."); return; }
    if (!price || Number(price) <= 0) { toast.error("Valid price is required."); return; }
    
    const cleanImages = images.filter(Boolean);
    if (cleanImages.length === 0) { toast.error("At least one image URL is required."); return; }

    const finalVariants = [{
      name: "Standard Box",
      sku: `${sku.trim().toUpperCase()}-DEFAULT`,
      price: Math.round(Number(price) * 100),
      discountPrice: discountPrice ? Math.round(Number(discountPrice) * 100) : null,
      stockQuantity: 100,
      isDefault: true,
    }];

    try {
      await createProduct({
        name: name.trim(),
        description: description.trim(),
        ingredients: ingredients.trim(),
        calories: calories.trim() || null,
        categoryId: categoryId.trim(),
        sku: sku.trim(),
        images: cleanImages.map((url, idx) => ({
          url,
          isPrimary: idx === 0,
          altText: `${name.trim()} image ${idx + 1}`
        })),
        status,
        inStock,
        isFeatured,
        isBestSeller,
        variants: finalVariants,
        tags: Array.from(new Set(
          [selectedMood, ...tags.split(",").map(t => t.trim()).filter(Boolean)]
        )).filter(Boolean),
      } as any);
      toast.success("Product created successfully.");
      router.push("/admin/products");
    } catch { /* toast shown by store */ }
  };

  const inputClass = "w-full px-4 py-2.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm";
  const labelClass = "block text-sm font-semibold text-brand-text-primary mb-1";

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300 pb-16">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-brand-light rounded-xl transition-colors text-brand-text-secondary hover:text-brand-brown">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-brand-brown font-serif">Add New Product</h1>
          <p className="text-brand-text-secondary text-sm mt-0.5">All prices in ₹ (Rupees)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-brand-brown/10 shadow-sm space-y-4">
          <h2 className="font-bold text-brand-brown text-base">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Product Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="e.g. Choco Chip Delight" required />
            </div>
            <div>
              <label className={labelClass}>SKU *</label>
              <input type="text" value={sku} onChange={e => setSku(e.target.value.toUpperCase())} className={`${inputClass} font-mono uppercase`} placeholder="CHO-CHIP-001" required />
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
            <div className="sm:col-span-2">
              <label className={labelClass}>Description * (Minimum 10 characters)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} min-h-[100px] resize-none`} placeholder="Product description..." required />
              <p className="text-xs text-brand-text-secondary mt-1">
                {description.length}/10 characters minimum
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Ingredients *</label>
              <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} className={`${inputClass} min-h-[80px] resize-none`} placeholder="e.g. Flour, sugar, chocolate chunks..." required />
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
              <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className={inputClass} placeholder="499" required />
            </div>
            <div>
              <label className={labelClass}>Discount Price (₹)</label>
              <input type="number" min="0" step="0.01" value={discountPrice} onChange={e => setDiscount(e.target.value)} className={inputClass} placeholder="399 (optional)" />
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
                <input type="url" value={url} onChange={e => updateImage(idx, e.target.value)} className={`${inputClass} flex-1`} placeholder={`Image ${idx + 1} URL`} />
              </div>
            ))}
            <button type="button" onClick={() => setImages([...images, ""])} className="text-xs text-brand-gold font-semibold hover:text-brand-brown transition-colors flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add another image
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.push("/admin/products")} className="px-6 py-2.5 border border-brand-brown/10 rounded-xl text-brand-brown font-semibold text-sm hover:bg-brand-light transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isCreating} className="flex items-center gap-2 px-6 py-2.5 bg-brand-brown text-white rounded-xl font-semibold text-sm hover:bg-brand-gold transition-colors disabled:opacity-50">
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isCreating ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
