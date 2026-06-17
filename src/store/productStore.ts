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
    (set) => ({
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
      setProducts: (products) => set({ products }),
    }),
    {
      name: 'loavia-product-storage-v2',
    }
  )
);
