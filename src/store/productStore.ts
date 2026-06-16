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
}

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setProducts: (products: Product[]) => void;
}

// Convert mock data to new schema
const defaultProducts: Product[] = initialProducts.map(p => ({
  ...p,
  discountPrice: null,
  calories: p.calories || '',
  nutritionTable: p.nutritionTable || [],
  inStock: true,
  isPopular: true // Mark default products as popular initially
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
      setProducts: (products) => set({ products }),
    }),
    {
      name: 'loavia-product-storage-v2',
    }
  )
);
