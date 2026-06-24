import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminCouponService } from '@/services/admin/adminCouponService';
import {
  CouponDTO,
  CreateCouponRequestDTO,
  UpdateCouponRequestDTO,
  PaginationMeta,
} from '@/types/admin';
import { AdminServiceError } from '@/utils/adminErrorHandler';

interface AdminCouponState {
  // Coupons Data
  coupons: CouponDTO[];
  selectedCoupon: CouponDTO | null;

  // Pagination
  pagination: PaginationMeta | null;
  currentPage: number;
  pageSize: number;

  // Loading States
  isLoadingCoupons: boolean;
  isLoadingCoupon: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Error States
  couponsError: string | null;
  couponError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;

  // Search
  searchQuery: string;

  // Actions
  fetchCoupons: (page?: number, limit?: number, search?: string) => Promise<void>;
  getCoupon: (id: string) => Promise<void>;
  createCoupon: (data: CreateCouponRequestDTO) => Promise<void>;
  updateCoupon: (id: string, data: UpdateCouponRequestDTO) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setPagination: (page: number, pageSize: number) => void;
  selectCoupon: (coupon: CouponDTO | null) => void;
  clearErrors: () => void;
  reset: () => void;
}

const initialState = {
  coupons: [],
  selectedCoupon: null,
  pagination: null,
  currentPage: 1,
  pageSize: 10,
  isLoadingCoupons: false,
  isLoadingCoupon: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  couponsError: null,
  couponError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  searchQuery: '',
};

export const useAdminCouponStore = create<AdminCouponState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchCoupons: async (page = 1, limit = 10, search?: string) => {
        set({
          isLoadingCoupons: true,
          couponsError: null,
          currentPage: page,
          pageSize: limit,
        });
        try {
          const data = await adminCouponService.listCoupons(page, limit, search);
          set({
            coupons: data.data,
            pagination: data.meta,
          });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch coupons';
          set({ couponsError: message });
        } finally {
          set({ isLoadingCoupons: false });
        }
      },

      getCoupon: async (id: string) => {
        set({ isLoadingCoupon: true, couponError: null });
        try {
          const data = await adminCouponService.getCoupon(id);
          set({ selectedCoupon: data });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch coupon';
          set({ couponError: message });
        } finally {
          set({ isLoadingCoupon: false });
        }
      },

      createCoupon: async (data: CreateCouponRequestDTO) => {
        set({ isCreating: true, createError: null });
        try {
          const response = await adminCouponService.createCoupon(data);
          set((state) => ({
            coupons: [response, ...state.coupons],
            selectedCoupon: null,
          }));
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to create coupon';
          set({ createError: message });
          throw error;
        } finally {
          set({ isCreating: false });
        }
      },

      updateCoupon: async (id: string, data: UpdateCouponRequestDTO) => {
        set({ isUpdating: true, updateError: null });
        try {
          const response = await adminCouponService.updateCoupon(id, data);
          set((state) => ({
            coupons: state.coupons.map((coupon) =>
              coupon.id === id ? response : coupon
            ),
            selectedCoupon: null,
          }));
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to update coupon';
          set({ updateError: message });
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      },

      deleteCoupon: async (id: string) => {
        set({ isDeleting: true, deleteError: null });
        try {
          await adminCouponService.deleteCoupon(id);
          set((state) => ({
            coupons: state.coupons.filter((coupon) => coupon.id !== id),
            selectedCoupon: null,
          }));
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to delete coupon';
          set({ deleteError: message });
          throw error;
        } finally {
          set({ isDeleting: false });
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setPagination: (page: number, pageSize: number) => {
        set({ currentPage: page, pageSize });
      },

      selectCoupon: (coupon: CouponDTO | null) => {
        set({ selectedCoupon: coupon });
      },

      clearErrors: () => {
        set({
          couponsError: null,
          couponError: null,
          createError: null,
          updateError: null,
          deleteError: null,
        });
      },

      reset: () => set(initialState),
    }),
    {
      name: 'admin-coupon-store',
      version: 1,
    }
  )
);
