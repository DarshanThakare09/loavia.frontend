import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminInventoryService } from '@/services/admin/adminInventoryService';
import {
  InventoryDTO,
  RestockRequestDTO,
  AdjustInventoryRequestDTO,
  PaginationMeta,
} from '@/types/admin';
import { AdminServiceError } from '@/utils/adminErrorHandler';

interface AdminInventoryState {
  // Inventory Data
  lowStockItems: InventoryDTO[];
  selectedVariant: InventoryDTO | null;

  // Pagination
  pagination: PaginationMeta | null;
  currentPage: number;
  pageSize: number;

  // Loading States
  isLoadingLowStock: boolean;
  isLoadingVariant: boolean;
  isRestocking: boolean;
  isAdjusting: boolean;

  // Error States
  lowStockError: string | null;
  variantError: string | null;
  restockError: string | null;
  adjustError: string | null;

  // Actions
  fetchLowStockItems: (page?: number, limit?: number) => Promise<void>;
  getVariantInventory: (variantId: string) => Promise<void>;
  restockInventory: (data: RestockRequestDTO) => Promise<void>;
  adjustInventory: (data: AdjustInventoryRequestDTO) => Promise<void>;
  setPagination: (page: number, pageSize: number) => void;
  selectVariant: (variant: InventoryDTO | null) => void;
  clearErrors: () => void;
  reset: () => void;
}

const initialState = {
  lowStockItems: [],
  selectedVariant: null,
  pagination: null,
  currentPage: 1,
  pageSize: 10,
  isLoadingLowStock: false,
  isLoadingVariant: false,
  isRestocking: false,
  isAdjusting: false,
  lowStockError: null,
  variantError: null,
  restockError: null,
  adjustError: null,
};

export const useAdminInventoryStore = create<AdminInventoryState>()(
  persist(
    (set) => ({
      ...initialState,

      fetchLowStockItems: async (page = 1, limit = 10) => {
        set({
          isLoadingLowStock: true,
          lowStockError: null,
          currentPage: page,
          pageSize: limit,
        });
        try {
          const data = await adminInventoryService.getLowStockItems(page, limit);
          set({
            lowStockItems: Array.isArray(data.data) ? data.data : [],
            pagination: data.meta,
          });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch low stock items';
          set({ lowStockError: message });
        } finally {
          set({ isLoadingLowStock: false });
        }
      },

      getVariantInventory: async (variantId: string) => {
        set({ isLoadingVariant: true, variantError: null });
        try {
          const data = await adminInventoryService.getVariantInventory(variantId);
          set({ selectedVariant: data });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch variant inventory';
          set({ variantError: message });
        } finally {
          set({ isLoadingVariant: false });
        }
      },

      restockInventory: async (data: RestockRequestDTO) => {
        set({ isRestocking: true, restockError: null });
        try {
          await adminInventoryService.restockInventory(data);
          // Re-fetch low stock after restock so counts update
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to restock inventory';
          set({ restockError: message });
          throw error;
        } finally {
          set({ isRestocking: false });
        }
      },

      adjustInventory: async (data: AdjustInventoryRequestDTO) => {
        set({ isAdjusting: true, adjustError: null });
        try {
          await adminInventoryService.adjustInventory(data);
          // Re-fetch after adjust so list updates
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to adjust inventory';
          set({ adjustError: message });
          throw error;
        } finally {
          set({ isAdjusting: false });
        }
      },

      setPagination: (page: number, pageSize: number) => {
        set({ currentPage: page, pageSize });
      },

      selectVariant: (variant: InventoryDTO | null) => {
        set({ selectedVariant: variant });
      },

      clearErrors: () => {
        set({
          lowStockError: null,
          variantError: null,
          restockError: null,
          adjustError: null,
        });
      },

      reset: () => set(initialState),
    }),
    {
      name: 'admin-inventory-store',
      version: 2,
      migrate: (persisted: unknown) => {
        const s = (persisted ?? {}) as Record<string, unknown>;
        return { ...s, lowStockItems: Array.isArray(s.lowStockItems) ? s.lowStockItems : [] };
      },
    }
  )
);
