"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Package, Minus, Plus, ShoppingCart, CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useProductStore } from "@/store/productStore";
import { toast } from "sonner";

export default function BuildBoxPage() {
  const { products: storeProducts } = useProductStore();

  const [boxSize, setBoxSize] = useState(6);
  const [selections, setSelections] = useState<{ [id: string]: number }>({});
  const [byobProduct, setByobProduct] = useState<any>(null);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCartStore();

  const totalSelected = Object.values(selections).reduce((a, b) => a + b, 0);
  const remaining = boxSize - totalSelected;

  const getCookieUnitPrice = (cookie: any) => {
    if (!cookie) return 0;
    if (typeof cookie.price === "number") return cookie.price;
    const variant = cookie.variants?.find((v: any) => v.isDefault) || cookie.variants?.[0];
    return variant?.price || 0;
  };

  const selectionPriceTotal = Object.entries(selections).reduce((total, [cookieId, qty]) => {
    const cookie = productsList.find(c => c.id === cookieId);
    return total + getCookieUnitPrice(cookie) * qty;
  }, 0);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { catalogService } = await import('@/services/catalogService');
        
        // Load BYOB product
        const prod = await catalogService.getProductBySlug("build-your-own-box");
        setByobProduct(prod);

        // Load catalog cookies/products
        let cookies = storeProducts;
        if (cookies.length === 0) {
          const res = await catalogService.getProducts({ limit: 100 });
          cookies = res.products;
        }
        
        // Filter out BYOB product
        const filteredCookies = cookies.filter(p => p.slug !== "build-your-own-box");
        setProductsList(filteredCookies);
      } catch (err) {
        console.error("Failed to load Build Your Own Box data from backend", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [storeProducts]);

  const handleUpdate = (id: string, delta: number) => {
    const current = selections[id] || 0;
    const newCount = current + delta;

    if (newCount < 0) return;
    if (delta > 0 && remaining <= 0) return;

    setSelections({ ...selections, [id]: newCount });
  };

  const handleAddToCart = () => {
    const byobVariant = byobProduct?.variants?.find((v: any) => v.sku === `BYOB-${boxSize}` || v.name.includes(`${boxSize}`)) || {
      id: boxSize === 6 ? "301becef-924e-4639-b02a-37c60f96a452" : boxSize === 12 ? "20f35574-cd93-4c40-a245-af04cc9882fb" : "d1fb14b3-43a1-4242-bd87-33b0069c2bc2",
      name: `${boxSize}-Pack Custom Box`,
      price: 0,
      sku: `BYOB-${boxSize}`
    };

    const cookieVariantFallbacks: Record<string, string> = {
      // Mock IDs
      "1": "558f6dec-3c0b-4a1c-9f80-d8903fdde206",
      "2": "4290a2ce-5f42-4b7f-b523-27a875a2f1f2",
      "3": "85aacf94-b96d-46ca-87d9-c231e114c545",
      "4": "e072bea9-663e-4287-a765-790666e465c1",
      "5": "efea770c-1d38-43e3-946f-33bf6c859f05",
      "6": "08c76cd5-a219-4b05-8299-724774f411eb",
      "7": "16b95ad8-70e8-4ed9-aa28-2d4b7aaa736d",
      "8": "a19fce3e-d136-4574-939b-c6bfcbb04e31",
      // Database IDs (UUIDs)
      "f5cf7b28-f43b-499b-8fb4-78f411dd46bd": "558f6dec-3c0b-4a1c-9f80-d8903fdde206",
      "ae99c0f2-1d8f-4d97-8da2-597c8db90bb9": "4290a2ce-5f42-4b7f-b523-27a875a2f1f2",
      "5ca6de60-05d1-4777-a494-f0041dbb866e": "85aacf94-b96d-46ca-87d9-c231e114c545",
      "042769c3-c900-4017-b126-6e8897cd6b8f": "e072bea9-663e-4287-a765-790666e465c1",
      "ab55f520-f7dd-4c2a-9e9b-8f287bf36951": "efea770c-1d38-43e3-946f-33bf6c859f05",
      "5df975df-8e6e-4da3-bdfd-7d02be223d47": "08c76cd5-a219-4b05-8299-724774f411eb",
      "a9f9fd7b-d6c4-4bb8-bdb6-e8114b2149fc": "16b95ad8-70e8-4ed9-aa28-2d4b7aaa736d",
      "93cdd386-46cd-413b-952c-8404fcfa19f4": "a19fce3e-d136-4574-939b-c6bfcbb04e31",
    };

    const customBoxSelections = Object.entries(selections)
      .map(([cookieId, qty]) => {
        const cookie = productsList.find(c => c.id === cookieId);
        const defaultVar = (cookie as any)?.variants?.find((v: any) => v.isDefault) || (cookie as any)?.variants?.[0];
        const variantId = defaultVar?.id || cookieVariantFallbacks[cookieId];
        if (!variantId) return null;
        return {
          variantId,
          quantity: qty
        };
      })
      .filter(Boolean);

    addItem({
      id: byobVariant.id,
      variantId: byobVariant.id,
      name: byobVariant.name || `Custom Box (${boxSize} Pack)`,
      price: selectionPriceTotal,
      image: "/cookie_gift_box.png",
      quantity: 1,
      isCustomBox: true,
      customBoxSelections
    });
    toast.success(`Custom ${boxSize}-Pack added to cart`);

    // Reset selection after adding
    setSelections({});
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-8 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-brand-gold font-sans font-bold text-xs uppercase tracking-[3px] mb-2 block">Custom Creation</span>
          <h1
            style={{ fontFamily: "'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2 justify-center"
          >
            <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">Build Your</span>
            <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">Box</span>
          </h1>
          <p className="text-brand-text-secondary text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Mix and match your favorite flavors. Choose a size and fill it up to your heart's content.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Main Content */}
          <div className="w-full lg:w-2/3">

            {/* Box Size Selector */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgba(92,51,23,0.02)] border border-brand-brown/5 mb-8">
              <h2 className="text-lg font-extrabold text-brand-brown mb-6 flex items-center tracking-wide">
                <Package className="w-5 h-5 mr-3 text-brand-gold" /> Step 1: Choose Size
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="h-20 rounded-[2rem] bg-gray-100/70 animate-pulse border border-brand-brown/5" />
                  ))
                ) : (
                  [6, 12, 24].map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        setBoxSize(size);
                        setSelections({});
                      }}
                      className={`p-6 rounded-[2rem] border-2 transition-all duration-300 text-center cursor-pointer ${boxSize === size
                        ? "border-brand-brown bg-brand-brown text-white shadow-lg scale-[1.02]"
                        : "border-brand-brown/10 bg-white text-brand-brown hover:border-brand-gold/40 hover:bg-[#FDFBF7]"
                        }`}
                    >
                      <span className="block text-2xl font-black mb-1">{size} Pack</span>

                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Flavor Selector */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgba(92,51,23,0.02)] border border-brand-brown/5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 border-b border-brand-brown/5 pb-4 gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-brand-brown flex items-center tracking-wide">
                    <CheckCircle className="w-5 h-5 mr-3 text-brand-gold" /> Step 2: Fill Your Box
                  </h2>
                  <p className="text-sm text-brand-text-secondary mt-2">
                    {totalSelected}/{boxSize} Selected
                  </p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${remaining === 0 ? "bg-green-100 text-green-700" : "bg-brand-gold/10 text-brand-gold"}`}>
                  {remaining === 0 ? "Box is Full!" : `${remaining} slots left`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {loading ? (
                  [1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex items-center space-x-4 p-4 border border-brand-brown/10 rounded-2xl bg-white animate-pulse">
                      <div className="w-20 h-20 bg-gray-100/70 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-100/70 rounded w-3/4" />
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100/70 animate-pulse" />
                          <div className="w-8 h-8 rounded bg-gray-100/70 animate-pulse" />
                          <div className="w-8 h-8 rounded-full bg-gray-100/70 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : productsList.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-brand-text-secondary font-light">
                    No custom flavors available at the moment.
                  </div>
                ) : (
                  productsList.slice(0, 6).map(cookie => {
                    const count = selections[cookie.id] || 0;
                    return (
                      <div key={cookie.id} className="flex items-center space-x-4 p-4 border border-brand-brown/10 rounded-2xl hover:border-brand-gold/30 hover:shadow-sm transition-all duration-300 bg-[#FDFBF7]/40 group">
                        <div className="relative w-20 h-20 bg-brand-light rounded-xl overflow-hidden flex-shrink-0 border border-brand-brown/5 group-hover:scale-95 transition-transform duration-300">
                          <Image src={cookie.image} alt={cookie.name} fill className="object-cover" sizes="80px" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-extrabold text-sm text-brand-brown mb-3 line-clamp-2 leading-tight">{cookie.name}</h3>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleUpdate(cookie.id, -1)}
                              disabled={count === 0}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${count === 0
                                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                : "border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white"
                                }`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-extrabold text-brand-brown w-4 text-center">{count}</span>
                            <button
                              onClick={() => handleUpdate(cookie.id, 1)}
                              disabled={remaining === 0}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${remaining === 0
                                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                : "border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white"
                                }`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgba(92,51,23,0.02)] border border-brand-brown/5 sticky top-24">
              <h3 className="text-xl font-bold text-brand-brown mb-6 border-b border-brand-brown/5 pb-4">
                Your Box ({boxSize}-Pack)
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {loading ? (
                  Array.from({ length: boxSize }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-gray-100/70 animate-pulse border border-brand-brown/5" />
                  ))
                ) : (
                  Array.from({ length: boxSize }).map((_, i) => {
                    const flatSelections = Object.entries(selections).flatMap(([id, count]) => Array(count).fill(id));
                    const cookieId = flatSelections[i];
                    const cookie = productsList.find(c => c.id === cookieId);

                    return (
                      <div key={i} className="aspect-square rounded-2xl bg-[#FDFBF7] border-2 border-dashed border-brand-brown/15 flex items-center justify-center relative overflow-hidden group shadow-inner">
                        {cookie ? (
                          <Image src={cookie.image} alt={cookie.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="90px" />
                        ) : (
                          <span className="text-brand-brown/25 font-bold text-xs select-none">Empty</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-brand-brown/5 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-extrabold text-brand-brown text-sm uppercase tracking-wider">Total Price</span>
                  <span className="font-black text-2xl text-brand-brown">₹{selectionPriceTotal}</span>
                </div>
                <button
                  disabled={remaining > 0}
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center space-x-2 px-8 py-4 font-bold rounded-full transition-all duration-300 ${remaining === 0
                    ? "bg-brand-brown text-white hover:bg-brand-gold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{remaining === 0 ? "Add to Cart" : `Select ${remaining} more`}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
