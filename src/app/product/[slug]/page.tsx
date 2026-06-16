"use client";

import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Truck, RotateCw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const params = useParams();
  const { products } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients'>('description');
  
  const product = products.find(p => p.id === params.slug);
  const [selectedImage, setSelectedImage] = useState(product ? (product.image || "/premium_cookie.png") : "");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update selected image once product is loaded or changed
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image || "/premium_cookie.png");
    }
  }, [product]);

  if (!mounted) return null;

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
      quantity: quantity
    });
    toast.success(`${quantity} ${product.name} added to cart`);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`text-xl leading-none ${i < fullStars ? "text-brand-gold" : "text-brand-brown/20"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const currentPrice = product.discountPrice || product.price;

  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-brand-text-secondary mb-8">
          <Link href="/" className="hover:text-brand-brown transition-colors">Home</Link>
          <span className="text-brand-brown/30">/</span>
          <Link href="/shop" className="hover:text-brand-brown transition-colors">Shop</Link>
          <span className="text-brand-brown/30">/</span>
          <span className="text-brand-brown font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image & Gallery */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-[32px] overflow-hidden bg-brand-light shadow-sm">
              <Image 
                src={selectedImage || "/premium_cookie.png"} 
                alt={product.name} 
                fill 
                className="object-cover"
                priority
              />
              {product.inStock === false && (
                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                  <span className="bg-brand-error text-white font-bold text-xs uppercase px-3 py-1.5 rounded-lg shadow-md tracking-wider">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 0 && (
              <div className="flex items-center space-x-4 overflow-x-auto py-2 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-brand-light flex-shrink-0 cursor-pointer transition-all duration-200 ${
                      selectedImage === img 
                        ? "ring-2 ring-brand-brown ring-offset-2 ring-offset-brand-cream scale-95" 
                        : "opacity-80 hover:opacity-100 border border-brand-brown/10"
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.name} preview ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-6 flex flex-col pt-2">
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <span className="inline-block px-3 py-1 bg-brand-brown/10 text-brand-brown text-xs font-bold rounded-full">
                  {product.category}
                </span>
                {product.inStock === false && (
                  <span className="inline-block px-3 py-1 bg-brand-error/10 text-brand-error text-xs font-bold rounded-full border border-brand-error/20 animate-pulse">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-brown tracking-tight mb-2">
                {product.name}
              </h1>

              <div className="flex items-center space-x-3 mb-6">
                {renderStars(product.rating)}
                <span className="text-sm font-medium text-brand-text-secondary">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              
              <div className="flex items-baseline space-x-4 mb-6">
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

            <p className="text-brand-text-secondary text-base lg:text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Selection actions (Qty + Add to Cart) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border border-brand-brown/15 rounded-full px-5 py-3 bg-white w-full sm:w-36 h-[54px] shadow-sm">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={product.inStock === false}
                  className="text-brand-text-secondary hover:text-brand-brown font-bold text-xl cursor-pointer w-8 h-8 flex items-center justify-center select-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="font-bold text-brand-text-primary text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  disabled={product.inStock === false}
                  className="text-brand-text-secondary hover:text-brand-brown font-bold text-xl cursor-pointer w-8 h-8 flex items-center justify-center select-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              {product.inStock === false ? (
                <button 
                  disabled
                  className="flex-grow flex items-center justify-center space-x-2 px-8 py-4 bg-brand-error/15 text-brand-error/70 border border-brand-error/30 font-bold rounded-full cursor-not-allowed h-[54px] w-full"
                >
                  <span>Out of Stock</span>
                </button>
              ) : (
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow flex items-center justify-center space-x-2 px-8 py-4 bg-brand-brown text-white font-bold rounded-full hover:bg-brand-brown/90 transition-colors shadow-md hover:shadow-lg h-[54px] cursor-pointer w-full text-base"
                >
                  <ShoppingCart className="w-5 h-5 mr-1" />
                  <span>Add to Cart - ₹{currentPrice * quantity}</span>
                </button>
              )}
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 py-6 border-t border-brand-brown/10 text-sm text-brand-text-secondary mb-8">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-brand-gold" />
                <span>Pan-India Delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCw className="w-5 h-5 text-brand-gold" />
                <span>Baked Fresh Daily</span>
              </div>
              <div className="flex items-center space-x-3 col-span-1 sm:col-span-2">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
                <span>100% Secure Checkout</span>
              </div>
            </div>

            {/* Description & Ingredients Tabs */}
            <div className="border-b border-brand-brown/10 mb-6 flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 text-lg font-medium relative transition-colors cursor-pointer ${
                  activeTab === 'description' 
                    ? "text-brand-brown font-bold" 
                    : "text-brand-text-secondary hover:text-brand-brown"
                }`}
              >
                Description
                {activeTab === 'description' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-brown" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-3 text-lg font-medium relative transition-colors cursor-pointer ${
                  activeTab === 'ingredients' 
                    ? "text-brand-brown font-bold" 
                    : "text-brand-text-secondary hover:text-brand-brown"
                }`}
              >
                Ingredients
                {activeTab === 'ingredients' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-brown" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[120px] text-brand-text-secondary leading-relaxed text-sm sm:text-base font-sans">
              {activeTab === 'description' ? (
                <p>{product.description}</p>
              ) : (
                <div className="space-y-6">
                  {/* Ingredients Box */}
                  <div className="bg-white rounded-2xl p-6 border border-brand-brown/10 shadow-sm">
                    <p className="text-brand-text-primary text-sm sm:text-base leading-relaxed font-medium">
                      {product.ingredients}
                    </p>
                  </div>
                  
                  {product.calories && (
                    <div className="flex items-center space-x-2 bg-brand-brown/5 rounded-xl px-4 py-2.5 border border-brand-brown/5 w-fit">
                      <span className="text-sm font-semibold text-brand-brown">Calories:</span>
                      <span className="text-sm font-bold text-brand-brown">{product.calories}</span>
                    </div>
                  )}

                  {product.nutritionTable && product.nutritionTable.length > 0 && (
                    <div className="max-w-md bg-white rounded-2xl p-6 border border-brand-brown/10 shadow-sm">
                      <h4 className="font-serif font-bold text-brand-brown mb-4 text-base">Nutrition Facts</h4>
                      <table className="w-full text-sm">
                        <tbody>
                          {product.nutritionTable.map((row, idx) => (
                            <tr key={idx} className="border-b border-brand-brown/5 last:border-0">
                              <td className="py-2 font-medium text-brand-text-secondary">{row.key}</td>
                              <td className="py-2 text-right font-bold text-brand-brown">{row.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}