"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore, Product } from "@/store/productStore";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AddProduct() {
  const router = useRouter();
  const { addProduct } = useProductStore();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "Classic",
    price: 0,
    discountPrice: null,
    image: "",
    images: [],
    primaryImage: "",
    coverImage: "",
    tags: [],
    moods: [],
    description: "",
    ingredients: "",
    calories: "",
    nutritionTable: [],
    inStock: true,
    isPopular: false,
    isFeatured: false,
    featuredOrder: 1,
    featuredBadgeText: "Featured"
  });

  const [newTag, setNewTag] = useState("");
  const [newMood, setNewMood] = useState("");

  const images = formData.images || [];
  const coverImage = images.includes(formData.coverImage || "") ? formData.coverImage! : (images[0] || "");

  const handleSetCoverImage = (url: string) => {
    setFormData({ ...formData, coverImage: url, primaryImage: url, image: url });
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), newTag] });
      setNewTag("");
    }
  };

  const handleAddMood = () => {
    if (newMood && !formData.moods?.includes(newMood)) {
      setFormData({ ...formData, moods: [...(formData.moods || []), newMood] });
      setNewMood("");
    }
  };

  const addNutritionRow = () => {
    setFormData({
      ...formData,
      nutritionTable: [...(formData.nutritionTable || []), { key: "", value: "" }]
    });
  };

  const updateNutritionRow = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...(formData.nutritionTable || [])];
    updated[index][field] = val;
    setFormData({ ...formData, nutritionTable: updated });
  };

  const removeNutritionRow = (index: number) => {
    const updated = [...(formData.nutritionTable || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, nutritionTable: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Name and Price are required.");
      return;
    }
    const productData = formData.isFeatured
      ? formData
      : { ...formData, featuredOrder: undefined };

    const cover = coverImage || productData.images?.[0] || "";
    addProduct({ ...productData, coverImage: cover, primaryImage: cover, image: cover } as Omit<Product, 'id' | 'rating' | 'reviews'>);
    toast.success("Product added successfully.");
    router.push('/admin/products');
  };

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="text-brand-text-secondary hover:text-brand-brown transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Add Product</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6 space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-1">Product Name *</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-1">Category *</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-1">Regular Price (₹) *</label>
              <input type="number" required min="0" className="w-full px-4 py-2 border rounded-xl" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-1">Discount Price (₹) (Optional)</label>
              <input type="number" min="0" className="w-full px-4 py-2 border rounded-xl" value={formData.discountPrice || ''} onChange={e => setFormData({...formData, discountPrice: e.target.value ? Number(e.target.value) : null})} />
            </div>
            <div className="md:col-span-2 flex items-center space-x-6 py-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-brand-text-primary cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-brand-brown focus:ring-brand-gold w-4 h-4 cursor-pointer"
                  checked={formData.inStock ?? true} 
                  onChange={e => setFormData({...formData, inStock: e.target.checked})} 
                />
                <span>In Stock</span>
              </label>
              <label className="flex items-center space-x-2 text-sm font-medium text-brand-text-primary cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-brand-brown focus:ring-brand-gold w-4 h-4 cursor-pointer"
                  checked={formData.isPopular ?? false} 
                  onChange={e => setFormData({...formData, isPopular: e.target.checked})} 
                />
                <span>Mark as Popular (Best Seller)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm font-medium text-brand-text-primary cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-brand-brown focus:ring-brand-gold w-4 h-4 cursor-pointer"
                  checked={formData.isFeatured ?? false}
                  onChange={e => setFormData({
                    ...formData,
                    isFeatured: e.target.checked,
                    featuredOrder: e.target.checked ? (formData.featuredOrder || 1) : undefined
                  })}
                />
                <span>Mark as Featured</span>
              </label>
            </div>
            {formData.isFeatured && (
              <>
                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-1">Featured Display Order</label>
                  <input type="number" min="1" className="w-full px-4 py-2 border rounded-xl" value={formData.featuredOrder ?? 1} onChange={e => setFormData({...formData, featuredOrder: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-1">Featured Badge Text</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-xl" value={formData.featuredBadgeText || ''} onChange={e => setFormData({...formData, featuredBadgeText: e.target.value})} />
                </div>
              </>
            )}
            {images.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-text-primary mb-2">Product Images</label>
                <div className="flex flex-wrap gap-4">
                  {images.map((img, idx) => {
                    const isCover = img === coverImage;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <div
                          className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                          style={{ border: `2px solid ${isCover ? '#5C4033' : '#e5e7eb'}` }}
                        >
                          <img src={img} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                          {isCover && (
                            <span className="absolute top-1 left-1 text-[9px] font-bold bg-brand-brown text-white px-1.5 py-0.5 rounded">Cover</span>
                          )}
                        </div>
                        {isCover ? (
                          <span className="text-[11px] font-semibold text-brand-brown">Cover Image</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(img)}
                            className="text-[11px] font-medium text-brand-text-secondary border border-brand-brown/20 rounded-lg px-2 py-0.5 hover:bg-brand-brown hover:text-white transition-colors cursor-pointer"
                          >
                            Set as Cover
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Product Details</h2>
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-1">Description</label>
            <textarea className="w-full px-4 py-2 border rounded-xl min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-1">Ingredients</label>
            <textarea className="w-full px-4 py-2 border rounded-xl min-h-[80px]" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} />
          </div>
        </div>

        {/* Nutrition */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Nutrition & Calories</h2>
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-1">Calories (e.g., &quot;120 kcal / cookie&quot;)</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">Nutrition Table</label>
            {formData.nutritionTable?.map((row, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input type="text" placeholder="Nutrient (e.g., Protein)" className="flex-1 px-4 py-2 border rounded-xl" value={row.key} onChange={e => updateNutritionRow(index, 'key', e.target.value)} />
                <input type="text" placeholder="Amount (e.g., 5g)" className="flex-1 px-4 py-2 border rounded-xl" value={row.value} onChange={e => updateNutritionRow(index, 'value', e.target.value)} />
                <button type="button" onClick={() => removeNutritionRow(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 className="w-5 h-5"/></button>
              </div>
            ))}
            <button type="button" onClick={addNutritionRow} className="flex items-center space-x-1 text-brand-gold font-medium mt-2"><Plus className="w-4 h-4"/> <span>Add Row</span></button>
          </div>
        </div>

        {/* Tags & Moods */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Tags & Moods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-1">Tags (e.g., Sweet, Nutty)</label>
              <div className="flex space-x-2 mb-2">
                <input type="text" className="flex-1 px-4 py-2 border rounded-xl" value={newTag} onChange={e => setNewTag(e.target.value)} />
                <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-brand-light text-brand-brown rounded-xl">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map(t => (
                  <span key={t} className="px-2 py-1 bg-brand-brown text-white text-xs rounded-full flex items-center">
                    {t} <button type="button" onClick={() => setFormData({...formData, tags: formData.tags?.filter(tag => tag !== t)})} className="ml-2">&times;</button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-1">Moods (e.g., Happy, Cozy)</label>
              <div className="flex space-x-2 mb-2">
                <input type="text" className="flex-1 px-4 py-2 border rounded-xl" value={newMood} onChange={e => setNewMood(e.target.value)} />
                <button type="button" onClick={handleAddMood} className="px-4 py-2 bg-brand-light text-brand-brown rounded-xl">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.moods?.map(m => (
                  <span key={m} className="px-2 py-1 bg-brand-gold text-brand-brown text-xs rounded-full flex items-center">
                    {m} <button type="button" onClick={() => setFormData({...formData, moods: formData.moods?.filter(mood => mood !== m)})} className="ml-2">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-brand-brown/10">
          <button type="submit" className="flex items-center space-x-2 px-6 py-3 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors font-medium">
            <Save className="w-5 h-5" />
            <span>Save Product</span>
          </button>
        </div>

      </form>
    </div>
  );
}
