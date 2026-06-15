"use client";

import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const params = useParams();
  const { products } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const product = products.find(p => p.id === params.slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream">
        <h1 className="text-3xl font-serif text-brand-brown mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-brand-gold hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.image,
      quantity: 1
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <Link href="/shop" className="inline-flex items-center text-brand-text-secondary hover:text-brand-brown mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Shop
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Left Column: Image */}
          <div className="bg-brand-light relative aspect-square md:aspect-auto">
            <Image 
              src={product.image || "/premium_cookie.png"} 
              alt={product.name} 
              fill 
              className="object-cover"
              priority
            />
          </div>

          {/* Right Column: Details */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <span className="inline-block px-3 py-1 bg-brand-brown/10 text-brand-brown text-sm font-bold rounded-full">
                  {product.category}
                </span>
                {product.inStock === false && (
                  <span className="inline-block px-3 py-1 bg-brand-error/10 text-brand-error text-sm font-bold rounded-full border border-brand-error/20 animate-pulse">
                    Out of Stock
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mt-4">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-brand-brown">₹{product.discountPrice}</span>
                    <span className="text-xl line-through text-brand-text-secondary">₹{product.price}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-brand-brown">₹{product.price}</span>
                )}
              </div>
            </div>

            <p className="text-brand-text-secondary text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {product.inStock === false ? (
              <button 
                disabled
                className="flex items-center justify-center space-x-2 w-full md:w-auto px-8 py-4 bg-brand-error/15 text-brand-error/70 border border-brand-error/30 font-bold rounded-full cursor-not-allowed mb-8"
              >
                <span>Out of Stock</span>
              </button>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="flex items-center justify-center space-x-2 w-full md:w-auto px-8 py-4 bg-brand-brown text-white font-bold rounded-full hover:bg-brand-gold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-8 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            )}

            <div className="space-y-6 pt-8 border-t border-brand-brown/10">
              
              {product.ingredients && (
                <div>
                  <h3 className="text-lg font-bold text-brand-brown mb-2">Ingredients</h3>
                  <p className="text-brand-text-secondary">{product.ingredients}</p>
                </div>
              )}

              {product.calories && (
                <div>
                  <h3 className="text-lg font-bold text-brand-brown mb-2">Calories</h3>
                  <p className="text-brand-text-secondary">{product.calories}</p>
                </div>
              )}

              {product.nutritionTable && product.nutritionTable.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-brand-brown mb-3">Nutrition Information</h3>
                  <table className="w-full text-left border-collapse bg-brand-light rounded-lg overflow-hidden">
                    <tbody>
                      {product.nutritionTable.map((row, idx) => (
                        <tr key={idx} className="border-b border-brand-brown/5 last:border-0">
                          <td className="py-2 px-4 text-brand-text-secondary font-medium">{row.key}</td>
                          <td className="py-2 px-4 text-brand-text-primary text-right">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}