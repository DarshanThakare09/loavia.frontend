import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminReviewService } from '@/services/admin/adminReviewService';
import {
  ReviewDTO,
  PaginationMeta,
  ReviewStatus,
} from '@/types/admin';
import { AdminServiceError } from '@/utils/adminErrorHandler';

interface AdminReviewState {
  // Reviews Data
  reviews: ReviewDTO[];
  selectedReview: ReviewDTO | null;

  // Pagination
  pagination: PaginationMeta | null;
  currentPage: number;
  pageSize: number;

  // Loading States
  isLoadingReviews: boolean;
  isLoadingReview: boolean;
  isUpdatingStatus: boolean;

  // Error States
  reviewsError: string | null;
  reviewError: string | null;
  statusError: string | null;

  // Filter
  selectedStatus: ReviewStatus | null;
  selectedProductId: string | null;

  // Actions
  fetchReviews: (
    page?: number,
    limit?: number,
    status?: ReviewStatus,
    productId?: string
  ) => Promise<void>;
  updateReviewStatus: (id: string, status: ReviewStatus) => Promise<void>;
  setSelectedStatus: (status: ReviewStatus | null) => void;
  setSelectedProductId: (productId: string | null) => void;
  setPagination: (page: number, pageSize: number) => void;
  selectReview: (review: ReviewDTO | null) => void;
  clearErrors: () => void;
  reset: () => void;
}

const initialState = {
  reviews: [],
  selectedReview: null,
  pagination: null,
  currentPage: 1,
  pageSize: 10,
  isLoadingReviews: false,
  isLoadingReview: false,
  isUpdatingStatus: false,
  reviewsError: null,
  reviewError: null,
  statusError: null,
  selectedStatus: null,
  selectedProductId: null,
};

export const useAdminReviewStore = create<AdminReviewState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchReviews: async (
        page = 1,
        limit = 10,
        status?: ReviewStatus,
        productId?: string
      ) => {
        set({
          isLoadingReviews: true,
          reviewsError: null,
          currentPage: page,
          pageSize: limit,
        });
        try {
          const data = await adminReviewService.listReviews(
            page,
            limit,
            status || get().selectedStatus || undefined,
            productId || get().selectedProductId || undefined
          );
          set({
            reviews: Array.isArray(data.data) ? data.data : [],
            pagination: data.meta,
          });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch reviews';
          set({ reviewsError: message });
        } finally {
          set({ isLoadingReviews: false });
        }
      },

      updateReviewStatus: async (id: string, status: ReviewStatus) => {
        set({ isUpdatingStatus: true, statusError: null });
        try {
          const response = await adminReviewService.updateReviewStatus(
            id,
            status
          );
          set((state) => ({
            reviews: state.reviews.map((review) =>
              review.id === id ? { ...review, status } : review
            ),
            selectedReview: null,
          }));
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to update review status';
          set({ statusError: message });
          throw error;
        } finally {
          set({ isUpdatingStatus: false });
        }
      },

      setSelectedStatus: (status: ReviewStatus | null) => {
        set({ selectedStatus: status });
      },

      setSelectedProductId: (productId: string | null) => {
        set({ selectedProductId: productId });
      },

      setPagination: (page: number, pageSize: number) => {
        set({ currentPage: page, pageSize });
      },

      selectReview: (review: ReviewDTO | null) => {
        set({ selectedReview: review });
      },

      clearErrors: () => {
        set({
          reviewsError: null,
          reviewError: null,
          statusError: null,
        });
      },

      reset: () => set(initialState),
    }),
    {
      name: 'admin-review-store',
      version: 2,
      migrate: (persisted: unknown) => {
        const s = (persisted ?? {}) as Record<string, unknown>;
        return { ...s, reviews: Array.isArray(s.reviews) ? s.reviews : [] };
      },
    }
  )
);
