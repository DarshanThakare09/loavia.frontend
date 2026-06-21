"use client";

import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Truck, RotateCw, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const params = useParams();
  const { products } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);
  const { user, toggleWishlist } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients'>('description');
  
  const product = products.find(p => p.id === params.slug);
  const getDisplayImage = (p: typeof product) => p?.coverImage || p?.primaryImage || p?.images?.[0] || p?.image || "/premium_cookie.png";
  const [selectedImage, setSelectedImage] = useState(product ? getDisplayImage(product) : "");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update selected image once product is loaded or changed
  useEffect(() => {
    if (product) {
      setSelectedImage(getDisplayImage(product));
    }
  }, [product]);

  if (!mounted) return null;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] font-sans">
        <h1 className="text-3xl font-bold text-brand-brown mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-brand-gold hover:underline font-bold">Return to Shop</Link>
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

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }
    toggleWishlist({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image || "/premium_cookie.png"
    });
    toast.success(
      user.wishlist?.some((w) => w.id === product.id.toString())
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`text-xl leading-none ${i < fullStars ? "text-brand-gold" : "text-brand-brown/25"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const currentPrice = product.discountPrice || product.price;

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-brand-text-secondary mb-12 border-b border-brand-brown/5 pb-4">
          <Link href="/" className="hover:text-brand-brown font-semibold transition-colors">Home</Link>
          <span className="text-brand-brown/30">/</span>
          <Link href="/shop" className="hover:text-brand-brown font-semibold transition-colors">Shop</Link>
          <span className="text-brand-brown/30">/</span>
          <span className="text-brand-brown font-black">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image & Gallery */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-[2.5rem] overflow-hidden bg-brand-light shadow-[0_20px_50px_rgba(92,51,23,0.04)] border border-brand-brown/5">
              <Image 
                src={selectedImage || "/premium_cookie.png"} 
                alt={product.name} 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
              {product.inStock === false && (
                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                  <span className="bg-brand-error text-white font-black text-xs uppercase px-4 py-2 rounded-xl shadow-lg tracking-wider">Out of Stock</span>
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
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-[#FDFBF7] flex-shrink-0 cursor-pointer transition-all duration-300 ${
                      selectedImage === img 
                        ? "ring-2 ring-brand-gold ring-offset-2 ring-offset-[#FDFBF7] scale-95" 
                        : "opacity-75 hover:opacity-100 border border-brand-brown/10"
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
          <div className="lg:col-span-6 flex flex-col pt-2 font-sans">
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <span className="inline-block px-3.5 py-1 bg-brand-gold/10 text-brand-gold text-xs font-black uppercase tracking-wider rounded-full border border-brand-gold/15 shadow-sm">
                  {product.category}
                </span>
                {product.inStock === false && (
                  <span className="inline-block px-3.5 py-1 bg-brand-error/10 text-brand-error text-xs font-black uppercase tracking-wider rounded-full border border-brand-error/20 animate-pulse">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-brand-brown tracking-tight mb-3 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center space-x-3 mb-6">
                {renderStars(product.rating)}
                <span className="text-sm font-semibold text-brand-text-secondary">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              
              <div className="flex items-baseline space-x-4 mb-6">
                {product.discountPrice ? (
                  <>
                    <span className="text-4xl font-black text-[#E29B52]">₹{product.discountPrice}</span>
                    <span className="text-2xl line-through text-brand-text-secondary/50 font-bold">₹{product.price}</span>
                  </>
                ) : (
                  <span className="text-4xl font-black text-brand-brown">₹{product.price}</span>
                )}
              </div>
            </div>

            <p className="text-brand-text-secondary text-base lg:text-lg leading-relaxed mb-8 font-light">
              {product.description}
            </p>

            {/* Selection actions (Qty + Add to Cart + Wishlist) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border border-brand-brown/15 rounded-full px-5 py-3 bg-white w-full sm:w-36 h-[54px] shadow-sm">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={product.inStock === false}
                  className="text-brand-text-secondary hover:text-brand-brown font-bold text-xl cursor-pointer w-8 h-8 flex items-center justify-center select-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="font-extrabold text-brand-text-primary text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  disabled={product.inStock === false}
                  className="text-brand-text-secondary hover:text-brand-brown font-bold text-xl cursor-pointer w-8 h-8 flex items-center justify-center select-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-3 flex-grow">
                {/* Add to Cart button */}
                {product.inStock === false ? (
                  <button 
                    disabled
                    className="flex-grow flex items-center justify-center space-x-2 px-8 py-4 bg-brand-error/10 text-brand-error/60 border border-brand-error/20 font-bold rounded-full cursor-not-allowed h-[54px] text-base"
                  >
                    <span>Out of Stock</span>
                  </button>
                ) : (
                  <button 
                    onClick={handleAddToCart}
                    className="flex-grow flex items-center justify-center space-x-2 px-8 py-4 bg-brand-brown hover:bg-brand-gold text-white font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 h-[54px] cursor-pointer text-base"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    <span>Add to Cart - ₹{currentPrice * quantity}</span>
                  </button>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`w-[54px] h-[54px] rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex-shrink-0 ${
                    user?.wishlist?.some((w) => w.id === product.id.toString())
                      ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                      : "border-brand-brown/15 bg-white text-brand-text-secondary hover:bg-brand-brown/5 hover:text-brand-brown"
                  }`}
                  title={user?.wishlist?.some((w) => w.id === product.id.toString()) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-5 h-5 ${user?.wishlist?.some((w) => w.id === product.id.toString()) ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 py-6 border-t border-brand-brown/10 text-sm font-semibold text-brand-text-secondary mb-8">
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
                className={`pb-3 text-lg font-extrabold relative transition-colors cursor-pointer ${
                  activeTab === 'description' 
                    ? "text-brand-brown font-black" 
                    : "text-brand-text-secondary hover:text-brand-brown"
                }`}
              >
                Description
                {activeTab === 'description' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-brown rounded-full" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-3 text-lg font-extrabold relative transition-colors cursor-pointer ${
                  activeTab === 'ingredients' 
                    ? "text-brand-brown font-black" 
                    : "text-brand-text-secondary hover:text-brand-brown"
                }`}
              >
                Ingredients
                {activeTab === 'ingredients' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-brown rounded-full" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[120px] text-brand-text-secondary leading-relaxed text-sm sm:text-base font-light">
              {activeTab === 'description' ? (
                <p>{product.description}</p>
              ) : (
                <div className="space-y-6">
                  {/* Ingredients Box */}
                  <div className="bg-white rounded-[2rem] p-6 border border-brand-brown/10 shadow-sm leading-relaxed text-brand-brown font-bold text-sm">
                    <p>{product.ingredients}</p>
                  </div>
                  
                  {product.calories && (
                    <div className="flex items-center space-x-2 bg-brand-brown/5 rounded-xl px-4 py-2 border border-brand-brown/5 w-fit font-bold text-xs uppercase tracking-wide">
                      <span className="text-brand-text-secondary">Calories:</span>
                      <span className="text-brand-brown font-black">{product.calories}</span>
                    </div>
                  )}

                  {product.nutritionTable && product.nutritionTable.length > 0 && (
                    <div className="max-w-md bg-white rounded-[2rem] p-6 border border-brand-brown/10 shadow-sm">
                      <h4 className="font-extrabold text-brand-brown mb-4 text-sm uppercase tracking-wide">Nutrition Facts</h4>
                      <table className="w-full text-sm">
                        <tbody>
                          {product.nutritionTable.map((row, idx) => (
                            <tr key={idx} className="border-b border-brand-brown/5 last:border-0">
                              <td className="py-2.5 font-bold text-brand-text-secondary">{row.key}</td>
                              <td className="py-2.5 text-right font-black text-brand-brown">{row.value}</td>
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