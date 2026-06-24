import { apiClient } from '@/services/apiClient';
import { handleApiError } from '@/utils/adminErrorHandler';
import {
  DashboardSummary,
  SalesChartDataPoint,
  BestSeller,
  CategorySalesData,
  ApiResponse,
} from '@/types/admin';

export const adminDashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiClient.get<ApiResponse<DashboardSummary>>(
        '/admin/dashboard/summary'
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getSalesChart(): Promise<SalesChartDataPoint[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<SalesChartDataPoint[]>
      >('/admin/dashboard/sales-chart');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getBestSellers(): Promise<BestSeller[]> {
    try {
      const response = await apiClient.get<ApiResponse<BestSeller[]>>(
        '/admin/dashboard/best-sellers'
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getCategorySales(): Promise<CategorySalesData[]> {
    try {
      const response = await apiClient.get<ApiResponse<CategorySalesData[]>>(
        '/admin/dashboard/category-sales'
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
