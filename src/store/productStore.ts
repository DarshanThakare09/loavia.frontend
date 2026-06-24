import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { catalogService } from '@/services/catalogService';
import { ProductFilterInput, PaginationMeta } from '@/types/catalog';

export interface NutritionFact {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  slug?: string;
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
  variants?: any[];
}

interface ProductState {
  products: Product[]; // Holds general storefront/admin products listing
  paginatedProducts: Product[]; // Holds currently filtered shop products
  pagination: PaginationMeta | null; // Currently loaded pagination meta
  isLoading: boolean;
  error: string | null;

  // Fetch actions
  fetchProducts: (filters?: ProductFilterInput) => Promise<void>;
  fetchProductDetail: (slug: string) => Promise<Product | null>;
  fetchHomeProducts: () => Promise<void>;

  // Legacy/Admin compatibility actions (modified to work alongside database seeds)
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleFeatured: (id: string) => void;
  updateFeaturedProductOrder: (id: string, newOrder: number) => { success: boolean; error?: string };
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      paginatedProducts: [],
      pagination: null,
      isLoading: false,
      error: null,

      fetchProducts: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          const { products, pagination } = await catalogService.getProducts(filters);
          set({ paginatedProducts: products, pagination, isLoading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message || "Failed to fetch products", isLoading: false });
        }
      },

      fetchProductDetail: async (slug) => {
        set({ isLoading: true, error: null });
        try {
          const product = await catalogService.getProductBySlug(slug);
          set({ isLoading: false });
          return product;
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message || "Failed to fetch product detail", isLoading: false });
          return null;
        }
      },

      fetchHomeProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          // Fetch featured products
          const featuredRes = await catalogService.getProducts({ isFeatured: true, limit: 6 });
          // Fetch best seller products
          const bestSellerRes = await catalogService.getProducts({ isBestSeller: true, limit: 4 });
          // Fetch all products
          const allRes = await catalogService.getProducts({ limit: 100 });

          set({
            products: allRes.products,
            isLoading: false
          });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message || "Failed to load homepage products", isLoading: false });
        }
      },

      addProduct: (productData) => set((state) => {
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          rating: 5.0,
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
        if (!Number.isInteger(newOrder) || newOrder < 1) {
          return { success: false, error: "Display order must be a positive integer" };
        }

        const state = get();
        const product = state.products.find(p => p.id === id);
        
        if (!product || !product.isFeatured) {
          return { success: false, error: "Product not found or not featured" };
        }

        const featuredProducts = state.products
          .filter(p => p.isFeatured && p.id !== id)
          .sort((a, b) => {
            const orderA = Number(a.featuredOrder) || 999;
            const orderB = Number(b.featuredOrder) || 999;
            return orderA - orderB;
          });

        const orderExists = featuredProducts.some(p => p.featuredOrder === newOrder);

        if (!orderExists) {
          set((state) => ({
            products: state.products.map(p =>
              p.id === id ? { ...p, featuredOrder: newOrder } : p
            )
          }));
          return { success: true };
        }

        const updatedProducts = state.products.map(p => {
          if (!p.isFeatured) return p;
          
          if (p.id === id) {
            return { ...p, featuredOrder: newOrder };
          }

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
