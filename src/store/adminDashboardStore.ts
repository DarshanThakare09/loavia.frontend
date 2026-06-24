import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminDashboardService } from '@/services/admin/adminDashboardService';
import {
  DashboardSummary,
  SalesChartDataPoint,
  BestSeller,
  CategorySalesData,
} from '@/types/admin';
import { AdminServiceError } from '@/utils/adminErrorHandler';

interface AdminDashboardState {
  // Dashboard Data
  summary: DashboardSummary | null;
  salesChart: SalesChartDataPoint[];
  bestSellers: BestSeller[];
  categorySales: CategorySalesData[];

  // Loading States
  isLoadingSummary: boolean;
  isLoadingChart: boolean;
  isLoadingBestSellers: boolean;
  isLoadingCategorySales: boolean;

  // Error States
  summaryError: string | null;
  chartError: string | null;
  bestSellersError: string | null;
  categorySalesError: string | null;

  // Actions
  fetchSummary: () => Promise<void>;
  fetchSalesChart: () => Promise<void>;
  fetchBestSellers: () => Promise<void>;
  fetchCategorySales: () => Promise<void>;
  fetchAllDashboard: () => Promise<void>;
  clearErrors: () => void;
  reset: () => void;
}

const initialState = {
  summary: null,
  salesChart: [],
  bestSellers: [],
  categorySales: [],
  isLoadingSummary: false,
  isLoadingChart: false,
  isLoadingBestSellers: false,
  isLoadingCategorySales: false,
  summaryError: null,
  chartError: null,
  bestSellersError: null,
  categorySalesError: null,
};

export const useAdminDashboardStore = create<AdminDashboardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchSummary: async () => {
        set({ isLoadingSummary: true, summaryError: null });
        try {
          const data = await adminDashboardService.getSummary();
          set({ summary: data });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch dashboard summary';
          set({ summaryError: message });
        } finally {
          set({ isLoadingSummary: false });
        }
      },

      fetchSalesChart: async () => {
        set({ isLoadingChart: true, chartError: null });
        try {
          const data = await adminDashboardService.getSalesChart();
          set({ salesChart: data });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch sales chart';
          set({ chartError: message });
        } finally {
          set({ isLoadingChart: false });
        }
      },

      fetchBestSellers: async () => {
        set({ isLoadingBestSellers: true, bestSellersError: null });
        try {
          const data = await adminDashboardService.getBestSellers();
          set({ bestSellers: data });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch best sellers';
          set({ bestSellersError: message });
        } finally {
          set({ isLoadingBestSellers: false });
        }
      },

      fetchCategorySales: async () => {
        set({ isLoadingCategorySales: true, categorySalesError: null });
        try {
          const data = await adminDashboardService.getCategorySales();
          set({ categorySales: data });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch category sales';
          set({ categorySalesError: message });
        } finally {
          set({ isLoadingCategorySales: false });
        }
      },

      fetchAllDashboard: async () => {
        await Promise.all([
          get().fetchSummary(),
          get().fetchSalesChart(),
          get().fetchBestSellers(),
          get().fetchCategorySales(),
        ]);
      },

      clearErrors: () => {
        set({
          summaryError: null,
          chartError: null,
          bestSellersError: null,
          categorySalesError: null,
        });
      },

      reset: () => set(initialState),
    }),
    {
      name: 'admin-dashboard-store',
      version: 1,
    }
  )
);
