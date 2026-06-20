import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS as initialProducts } from '@/lib/mockData';

export interface NutritionFact {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  images: string[];
  primaryImage?: string;
  coverImage?: string;
  rating: number;
  reviews: number;
  category: string;
  tags: string[];
  moods: string[];
  description: string;
  ingredients: string;
  calories?: string;
  nutritionTable?: NutritionFact[];
  inStock?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  featuredBadgeText?: string;
}

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleFeatured: (id: string) => void;
  updateFeaturedProductOrder: (id: string, newOrder: number) => { success: boolean; error?: string };
  setProducts: (products: Product[]) => void;
}

// Convert mock data to new schema
const defaultProducts: Product[] = initialProducts.map((p, index) => ({
  ...p,
  discountPrice: null,
  calories: p.calories || '',
  nutritionTable: p.nutritionTable || [],
  inStock: true,
  isPopular: true, // Mark default products as popular initially
  isFeatured: index < 3,
  featuredOrder: index + 1,
  featuredBadgeText: "Featured",
}));

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: defaultProducts,
      addProduct: (productData) => set((state) => {
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          rating: 5.0, // Default rating for new product
          reviews: 0,
        };
        return { products: [newProduct, ...state.products] };
      }),
      updateProduct: (id, productData) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...productData } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      toggleFeatured: (id) => set((state) => {
        const nextFeaturedOrder = Math.max(0, ...state.products.map(p => p.featuredOrder || 0)) + 1;

        return {
          products: state.products.map(p => {
            if (p.id !== id) return p;

            const isFeatured = !p.isFeatured;
            return {
              ...p,
              isFeatured,
              featuredOrder: isFeatured ? nextFeaturedOrder : undefined,
              featuredBadgeText: isFeatured ? (p.featuredBadgeText || "Featured") : p.featuredBadgeText,
            };
          }),
        };
      }),
      updateFeaturedProductOrder: (id, newOrder) => {
        // Validation
        if (!Number.isInteger(newOrder) || newOrder < 1) {
          return { success: false, error: "Display order must be a positive integer" };
        }

        const state = get();
        const product = state.products.find(p => p.id === id);
        
        if (!product || !product.isFeatured) {
          return { success: false, error: "Product not found or not featured" };
        }

        // Get all featured products
        const featuredProducts = state.products
          .filter(p => p.isFeatured && p.id !== id)
          .sort((a, b) => {
            const orderA = Number(a.featuredOrder) || 999;
            const orderB = Number(b.featuredOrder) || 999;
            return orderA - orderB;
          });

        // Check if newOrder already exists
        const orderExists = featuredProducts.some(p => p.featuredOrder === newOrder);

        if (!orderExists) {
          // No conflict, just update the order
          set((state) => ({
            products: state.products.map(p =>
              p.id === id ? { ...p, featuredOrder: newOrder } : p
            )
          }));
          return { success: true };
        }

        // Conflict detected: reindex all featured products sequentially starting from 1
        const updatedProducts = state.products.map(p => {
          if (!p.isFeatured) return p;
          
          if (p.id === id) {
            // Target product gets the requested order
            return { ...p, featuredOrder: newOrder };
          }

          // Other featured products: get current index and adjust
          const currentIndex = featuredProducts.findIndex(fp => fp.id === p.id);
          // If this product's order is >= newOrder, shift it up by 1
          if ((p.featuredOrder || 0) >= newOrder) {
            return { ...p, featuredOrder: (p.featuredOrder || 0) + 1 };
          }
          return p;
        });

        set({ products: updatedProducts });
        return { success: true };
      },
      setProducts: (products) => set({ products }),
    }),
    {
      name: 'loavia-product-storage-v3',
    }
  )
);
