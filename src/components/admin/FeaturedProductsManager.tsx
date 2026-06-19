"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Edit, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Product, useProductStore } from "@/store/productStore";
import { useSiteStore } from "@/store/siteStore";

export default function FeaturedProductsManager() {
  const { products, updateProduct, updateFeaturedProductOrder } = useProductStore();
  const {
    featuredProductsTitle,
    featuredProductsSubtitle,
    featuredProductsCtaText,
    updateFeaturedProducts,
  } = useSiteStore();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productDraft, setProductDraft] = useState<Partial<Product>>({});
  const [orderError, setOrderError] = useState<string>("");

  const featuredProducts = useMemo(
    () =>
      products
        .filter((product) => product.isFeatured)
        .sort((a, b) => {
          const orderA = Number(a.featuredOrder) || 999;
          const orderB = Number(b.featuredOrder) || 999;
          return orderA - orderB;
        }),
    [products]
  );

  const availableProducts = useMemo(
    () => products.filter((product) => !product.isFeatured),
    [products]
  );

  const nextFeaturedOrder =
    Math.max(0, ...featuredProducts.map((product) => product.featuredOrder || 0)) + 1;

  const handleSectionChange = (
    field: "title" | "subtitle" | "ctaText",
    value: string
  ) => {
    updateFeaturedProducts(
      field === "title" ? value : featuredProductsTitle,
      field === "subtitle" ? value : featuredProductsSubtitle,
      field === "ctaText" ? value : featuredProductsCtaText
    );
  };

  const handleAddFeatured = () => {
    if (!selectedProductId) {
      toast.error("Choose a product to feature.");
      return;
    }

    updateProduct(selectedProductId, {
      isFeatured: true,
      featuredOrder: nextFeaturedOrder,
      featuredBadgeText: "Featured",
    });
    setSelectedProductId("");
    toast.success("Product added to featured section.");
  };

  const handleRemoveFeatured = (product: Product) => {
    updateProduct(product.id, {
      isFeatured: false,
      featuredOrder: undefined,
    });
    toast.success(`${product.name} removed from featured section.`);
  };

  const handleStartEdit = (product: Product) => {
    setEditingProductId(product.id);
    setProductDraft({
      name: product.name,
      description: product.description,
      image: product.image,
      featuredOrder: product.featuredOrder || 1,
      featuredBadgeText: product.featuredBadgeText || "Featured",
      isFeatured: product.isFeatured,
    });
  };

  const handleSaveProduct = (product: Product) => {
    const newOrder = productDraft.featuredOrder;

    // Validate order
    if (newOrder === undefined || newOrder === null) {
      setOrderError("Display order is required");
      toast.error("Display order is required");
      return;
    }

    if (!Number.isInteger(newOrder) || newOrder < 1) {
      setOrderError("Display order must be a positive integer");
      toast.error("Display order must be a positive integer");
      return;
    }

    // Update basic product info
    updateProduct(product.id, {
      name: productDraft.name,
      description: productDraft.description,
      image: productDraft.image,
      featuredBadgeText: productDraft.featuredBadgeText,
      images: productDraft.image ? [productDraft.image] : product.images,
    });

    // Update featured order with conflict resolution
    const result = updateFeaturedProductOrder(product.id, newOrder);
    if (!result.success) {
      setOrderError(result.error || "Failed to update order");
      toast.error(result.error || "Failed to update order");
      return;
    }

    setOrderError("");
    setEditingProductId(null);
    setProductDraft({});
    toast.success("Featured product updated.");
  };

  const handleMove = (product: Product, direction: "up" | "down") => {
    const currentOrder = product.featuredOrder || 1;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

    if (newOrder < 1) {
      toast.error("Cannot move product above position 1");
      return;
    }

    if (newOrder > featuredProducts.length) {
      toast.error("Cannot move product below the last position");
      return;
    }

    const result = updateFeaturedProductOrder(product.id, newOrder);
    if (!result.success) {
      toast.error(result.error || "Failed to reorder products");
      return;
    }

    toast.success("Featured product order updated.");
  };

  return (
    <div className="space-y-6 pt-6 border-t border-brand-brown/10">
      <div>
        <h2 className="text-xl font-bold text-brand-brown font-serif">
          Featured Products
        </h2>
      </div>

      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-1">
              Section Heading
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm"
              value={featuredProductsTitle}
              onChange={(e) => handleSectionChange("title", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-1">
              CTA Text
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm"
              value={featuredProductsCtaText}
              onChange={(e) => handleSectionChange("ctaText", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-brand-text-primary mb-1">
              Section Subheading
            </label>
            <textarea
              className="w-full px-4 py-2 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none min-h-[90px] text-sm"
              value={featuredProductsSubtitle}
              onChange={(e) => handleSectionChange("subtitle", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => toast.success("Featured section content saved.")}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors text-sm font-semibold"
          >
            <Save className="w-4 h-4" />
            <span>Save Featured Section</span>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-brand-brown uppercase tracking-wider">
            Add Product to Featured
          </h3>
          <p className="text-xs text-brand-text-secondary mt-1">
            Pick any catalog product that is not currently featured.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            className="flex-1 px-4 py-2 border border-brand-brown/20 rounded-xl bg-white text-sm"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            disabled={availableProducts.length === 0}
          >
            <option value="">
              {availableProducts.length === 0
                ? "All products are currently featured"
                : "Choose a product"}
            </option>
            {availableProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddFeatured}
            disabled={availableProducts.length === 0}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors disabled:cursor-not-allowed disabled:opacity-50 text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Featured</span>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-brand-brown uppercase tracking-wider">
            Featured Product List
          </h3>
          <p className="text-xs text-brand-text-secondary mt-1">
            Products appear on the homepage in this order.
          </p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-2xl border border-brand-brown/10 bg-brand-light/35 p-8 text-center text-sm text-brand-text-secondary">
            No featured products yet. Add one from the product selector above.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {featuredProducts.map((product, index) => {
              const isEditing = editingProductId === product.id;

              return (
                <article
                  key={product.id}
                  className="rounded-2xl border border-brand-brown/10 bg-brand-light/25 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative w-full sm:w-28 aspect-square rounded-xl overflow-hidden bg-white shrink-0">
                      <Image
                        src={(isEditing ? productDraft.image : product.image) || "/premium_cookie.png"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-brand-brown/20 rounded-xl text-sm font-semibold"
                            value={productDraft.name || ""}
                            onChange={(e) => setProductDraft({...productDraft, name: e.target.value})}
                          />
                          <textarea
                            className="w-full px-3 py-2 border border-brand-brown/20 rounded-xl min-h-[84px] text-sm"
                            value={productDraft.description || ""}
                            onChange={(e) => setProductDraft({...productDraft, description: e.target.value})}
                          />
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-brand-brown/20 rounded-xl text-sm"
                            value={productDraft.image || ""}
                            onChange={(e) => setProductDraft({...productDraft, image: e.target.value})}
                            placeholder="Image URL"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <input
                                type="number"
                                min="1"
                                step="1"
                                className="w-full px-3 py-2 border border-brand-brown/20 rounded-xl text-sm"
                                value={productDraft.featuredOrder ?? 1}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const num = value === "" ? undefined : parseInt(value, 10);
                                  setProductDraft({...productDraft, featuredOrder: num});
                                  setOrderError("");
                                }}
                                onBlur={(e) => {
                                  const value = parseInt(e.target.value, 10);
                                  if (!Number.isInteger(value) || value < 1) {
                                    setOrderError("Must be a positive integer");
                                  }
                                }}
                              />
                              {orderError && editingProductId === product.id && (
                                <p className="text-xs text-red-600 mt-1">{orderError}</p>
                              )}
                            </div>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-brand-brown/20 rounded-xl text-sm"
                              value={productDraft.featuredBadgeText || ""}
                              onChange={(e) => setProductDraft({...productDraft, featuredBadgeText: e.target.value})}
                              placeholder="Badge text"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-brand-text-primary">
                              {product.name}
                            </h3>
                            <span className="rounded-full bg-brand-gold/15 px-2 py-0.5 text-xs font-semibold text-brand-brown">
                              {product.featuredBadgeText || "Featured"}
                            </span>
                          </div>
                          <p className="text-sm text-brand-text-secondary line-clamp-2">
                            {product.description}
                          </p>
                          <p className="text-sm font-medium text-brand-brown">
                            Order: {product.featuredOrder || index + 1}
                          </p>
                        </>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSaveProduct(product)}
                              className="inline-flex items-center space-x-1 px-3 py-2 bg-brand-brown text-white rounded-xl hover:bg-brand-gold transition-colors text-sm"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProductId(null);
                                setProductDraft({});
                              }}
                              className="inline-flex items-center space-x-1 px-3 py-2 bg-white text-brand-brown rounded-xl hover:bg-brand-gold/20 transition-colors text-sm"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleMove(product, "up")}
                              disabled={index === 0}
                              className="inline-flex items-center space-x-1 px-3 py-2 bg-white text-brand-brown rounded-xl hover:bg-brand-gold/20 transition-colors disabled:cursor-not-allowed disabled:opacity-50 text-sm"
                            >
                              <ArrowUp className="w-4 h-4" />
                              <span>Up</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMove(product, "down")}
                              disabled={index === featuredProducts.length - 1}
                              className="inline-flex items-center space-x-1 px-3 py-2 bg-white text-brand-brown rounded-xl hover:bg-brand-gold/20 transition-colors disabled:cursor-not-allowed disabled:opacity-50 text-sm"
                            >
                              <ArrowDown className="w-4 h-4" />
                              <span>Down</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(product)}
                              className="inline-flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeatured(product)}
                              className="inline-flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Remove</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center px-4 py-2 bg-brand-light text-brand-brown rounded-xl hover:bg-brand-gold/20 transition-colors text-sm font-semibold"
        >
          Manage Product Catalog
        </Link>
      </div>
    </div>
  );
}
