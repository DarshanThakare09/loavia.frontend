import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminProductService } from '@/services/admin/adminProductService';
import {
  ProductDTO,
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
  PaginationMeta,
} from '@/types/admin';
import { AdminServiceError } from '@/utils/adminErrorHandler';

interface AdminProductState {
  // Products Data
  products: ProductDTO[];
  selectedProduct: ProductDTO | null;

  // Pagination
  pagination: PaginationMeta | null;
  currentPage: number;
  pageSize: number;

  // Loading States
  isLoadingProducts: boolean;
  isLoadingProduct: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Error States
  productsError: string | null;
  productError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;

  // Search/Filter
  searchQuery: string;
  selectedCategory: string | null;

  // Actions
  fetchProducts: (
    page?: number,
    limit?: number,
    categoryId?: string,
    search?: string
  ) => Promise<void>;
  getProduct: (id: string) => Promise<void>;
  createProduct: (data: CreateProductRequestDTO) => Promise<void>;
  updateProduct: (id: string, data: UpdateProductRequestDTO) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setPagination: (page: number, pageSize: number) => void;
  selectProduct: (product: ProductDTO | null) => void;
  updateFeaturedStatus: (id: string, isFeatured: boolean) => void;
  clearErrors: () => void;
  reset: () => void;
}

const initialState = {
  products: [],
  selectedProduct: null,
  pagination: null,
  currentPage: 1,
  pageSize: 10,
  isLoadingProducts: false,
  isLoadingProduct: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  productsError: null,
  productError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  searchQuery: '',
  selectedCategory: null,
};

export const useAdminProductStore = create<AdminProductState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchProducts: async (
        page = 1,
        limit = 10,
        categoryId?: string,
        search?: string
      ) => {
        set({
          isLoadingProducts: true,
          productsError: null,
          currentPage: page,
          pageSize: limit,
        });
        try {
          const data = await adminProductService.listProducts(
            page,
            limit,
            categoryId || get().selectedCategory || undefined,
            search
          );
          set({
            products: Array.isArray(data.data) ? data.data : [],
            pagination: data.meta,
          });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch products';
          set({ productsError: message });
        } finally {
          set({ isLoadingProducts: false });
        }
      },

      getProduct: async (id: string) => {
        set({ isLoadingProduct: true, productError: null });
        try {
          const data = await adminProductService.getProduct(id);
          set({ selectedProduct: data });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch product';
          set({ productError: message });
        } finally {
          set({ isLoadingProduct: false });
        }
      },

      createProduct: async (data: CreateProductRequestDTO) => {
        set({ isCreating: true, createError: null });
        try {
          const response = await adminProductService.createProduct(data);
          set((state) => ({
            products: [response, ...state.products],
            selectedProduct: null,
          }));
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to create product';
          set({ createError: message });
          throw error;
        } finally {
          set({ isCreating: false });
        }
      },

      updateProduct: async (id: string, data: UpdateProductRequestDTO) => {
        set({ isUpdating: true, updateError: null });
        try {
          const response = await adminProductService.updateProduct(id, data);
          set((state) => ({
            products: state.products.map((product) =>
              product.id === id ? response : product
            ),
            selectedProduct: null,
          }));
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to update product';
          set({ updateError: message });
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      },

      deleteProduct: async (id: string) => {
        set({ isDeleting: true, deleteError: null });
        try {
          await adminProductService.deleteProduct(id);
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
            selectedProduct: null,
          }));
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to delete product';
          set({ deleteError: message });
          throw error;
        } finally {
          set({ isDeleting: false });
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setSelectedCategory: (categoryId: string | null) => {
        set({ selectedCategory: categoryId });
      },

      setPagination: (page: number, pageSize: number) => {
        set({ currentPage: page, pageSize });
      },

      selectProduct: (product: ProductDTO | null) => {
        set({ selectedProduct: product });
      },

      updateFeaturedStatus: (id: string, isFeatured: boolean) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, isFeatured } : product
          ),
        }));
      },

      clearErrors: () => {
        set({
          productsError: null,
          productError: null,
          createError: null,
          updateError: null,
          deleteError: null,
        });
      },

      reset: () => set(initialState),
    }),
    {
      name: 'admin-product-store',
      version: 2,
      migrate: (persisted: unknown) => {
        const s = (persisted ?? {}) as Record<string, unknown>;
        return { ...s, products: Array.isArray(s.products) ? s.products : [] };
      },
    }
  )
);
