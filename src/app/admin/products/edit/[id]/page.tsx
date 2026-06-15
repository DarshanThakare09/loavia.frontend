"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useProductStore, Product } from "@/store/productStore";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import Link from "next/link";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const { products, updateProduct } = useProductStore();
  
  const [formData, setFormData] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    const productToEdit = products.find(p => p.id === params.id);
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      router.push('/admin/products');
    }
  }, [params.id, products, router]);

  const [newTag, setNewTag] = useState("");
  const [newMood, setNewMood] = useState("");

  if (!formData) return <div>Loading...</div>;

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
    if (!formData.name || formData.price === undefined) {
      alert("Name and Price are required.");
      return;
    }
    updateProduct(params.id as string, formData);
    alert("Product updated successfully!");
    router.push('/admin/products');
  };

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="text-brand-text-secondary hover:text-brand-brown transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Edit Product</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-6 space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-1">Product Name *</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-xl" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-1">Category *</label>
              <input type="text" required className="w-full px-4 py-2 border rounded-xl" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-1">Regular Price (₹) *</label>
              <input type="number" required min="0" className="w-full px-4 py-2 border rounded-xl" value={formData.price ?? ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
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
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text-primary mb-1">Image URL</label>
              <input type="text" className="w-full px-4 py-2 border rounded-xl" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value, images: [e.target.value]})} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Product Details</h2>
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-1">Description</label>
            <textarea className="w-full px-4 py-2 border rounded-xl min-h-[100px]" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-1">Ingredients</label>
            <textarea className="w-full px-4 py-2 border rounded-xl min-h-[80px]" value={formData.ingredients || ''} onChange={e => setFormData({...formData, ingredients: e.target.value})} />
          </div>
        </div>

        {/* Nutrition */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-brown border-b border-brand-brown/10 pb-2">Nutrition & Calories</h2>
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-1">Calories (e.g., "120 kcal / cookie")</label>
            <input type="text" className="w-full px-4 py-2 border rounded-xl" value={formData.calories || ''} onChange={e => setFormData({...formData, calories: e.target.value})} />
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
            <span>Update Product</span>
          </button>
        </div>

      </form>
    </div>
  );
}
