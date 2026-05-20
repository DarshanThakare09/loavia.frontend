"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

const INITIAL_PRODUCTS = [
  { id: "1", name: "Classic Chocolate Chip", price: 299, stock: 150, status: "Active", image: "/premium_cookie.png" },
  { id: "2", name: "Double Dark Chocolate", price: 349, stock: 85, status: "Active", image: "/premium_cookie.png" },
  { id: "3", name: "Oatmeal Raisin Bliss", price: 279, stock: 0, status: "Out of Stock", image: "/premium_cookie.png" },
  { id: "4", name: "Peanut Butter Crunch", price: 329, stock: 45, status: "Active", image: "/premium_cookie.png" },
];

export default function AdminProductsPage() {
  const [products] = useState(INITIAL_PRODUCTS);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown">Products</h1>
          <p className="text-brand-text-secondary">Manage your inventory and catalog.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 bg-brand-brown text-white px-4 py-2 rounded-xl hover:bg-brand-gold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-brown/5 mb-8 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-brand-brown mb-6">Add New Product</h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAdding(false); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text-primary mb-1">Product Name</label>
                <input type="text" required className="w-full bg-brand-light border border-transparent focus:border-brand-gold rounded-xl py-2 px-4 outline-none font-medium text-brand-brown" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text-primary mb-1">Price (₹)</label>
                <input type="number" required className="w-full bg-brand-light border border-transparent focus:border-brand-gold rounded-xl py-2 px-4 outline-none font-medium text-brand-brown" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text-primary mb-1">Category</label>
                <select className="w-full bg-brand-light border border-transparent focus:border-brand-gold rounded-xl py-2 px-4 outline-none font-medium text-brand-brown">
                  <option>Classic</option>
                  <option>Vegan</option>
                  <option>Gluten-Free</option>
                  <option>Stuffed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text-primary mb-1">Initial Stock</label>
                <input type="number" required className="w-full bg-brand-light border border-transparent focus:border-brand-gold rounded-xl py-2 px-4 outline-none font-medium text-brand-brown" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-text-primary mb-1">Description</label>
                <textarea rows={3} required className="w-full bg-brand-light border border-transparent focus:border-brand-gold rounded-xl py-2 px-4 outline-none font-medium text-brand-brown resize-none"></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 text-brand-brown hover:bg-brand-light rounded-xl font-medium transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-brand-gold text-brand-brown font-bold rounded-xl hover:bg-yellow-500 transition-colors">Save Product</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/5 overflow-hidden">
        <div className="p-4 border-b border-brand-brown/5 flex justify-between items-center bg-brand-light/30">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2 border border-brand-brown/10 rounded-lg text-sm focus:outline-none focus:border-brand-gold" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-light/50 text-brand-text-secondary text-sm uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-brand-brown/5">Product</th>
                <th className="p-4 font-bold border-b border-brand-brown/5">Price</th>
                <th className="p-4 font-bold border-b border-brand-brown/5">Stock</th>
                <th className="p-4 font-bold border-b border-brand-brown/5">Status</th>
                <th className="p-4 font-bold border-b border-brand-brown/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-brown/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-brand-light/30 transition-colors">
                  <td className="p-4 flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-brand-light">
                      <Image src={product.image} fill alt={product.name} className="object-cover" />
                    </div>
                    <span className="font-bold text-brand-brown">{product.name}</span>
                  </td>
                  <td className="p-4 font-medium text-brand-text-secondary">₹{product.price}</td>
                  <td className="p-4 text-brand-text-secondary">{product.stock}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="p-2 text-brand-text-secondary hover:text-brand-gold transition-colors rounded-full hover:bg-brand-light"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 text-brand-text-secondary hover:text-red-500 transition-colors rounded-full hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
