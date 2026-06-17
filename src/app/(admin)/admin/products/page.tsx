"use client";

import { useProductStore } from "@/store/productStore";
import Link from "next/link";
import { Edit, Trash2, Plus } from "lucide-react";
import Image from "next/image";

export default function AdminProducts() {
  const { products, deleteProduct } = useProductStore();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Products</h1>
          <p className="text-brand-text-secondary mt-1">Manage your cookie catalogue</p>
        </div>
        <Link 
          href="/admin/products/add"
          className="flex items-center space-x-2 px-4 py-2 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-light border-b border-brand-brown/10">
                <th className="p-4 font-semibold text-brand-brown">Product</th>
                <th className="p-4 font-semibold text-brand-brown">Category</th>
                <th className="p-4 font-semibold text-brand-brown">Price</th>
                <th className="p-4 font-semibold text-brand-brown">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-brand-brown/5 hover:bg-brand-light/50 transition-colors">
                  <td className="p-4 flex items-center space-x-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-light">
                      <Image src={product.image || "/premium_cookie.png"} alt={product.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium text-brand-text-primary">{product.name}</span>
                  </td>
                  <td className="p-4 text-brand-text-secondary">{product.category}</td>
                  <td className="p-4 text-brand-text-secondary">
                    {product.discountPrice ? (
                      <div>
                        <span className="text-green-600 font-medium">₹{product.discountPrice}</span>
                        <span className="text-xs line-through ml-2">₹{product.price}</span>
                      </div>
                    ) : (
                      <span>₹{product.price}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-3">
                      <Link 
                        href={`/admin/products/edit/${product.id}`}
                        className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-brand-text-secondary">
                    No products found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
