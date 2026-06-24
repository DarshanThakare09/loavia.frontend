import { apiClient } from '@/services/apiClient';
import { handleApiError } from '@/utils/adminErrorHandler';
import {
  CouponDTO,
  CreateCouponRequestDTO,
  UpdateCouponRequestDTO,
  PaginatedResponse,
  ApiResponse,
} from '@/types/admin';

export const adminCouponService = {
  async listCoupons(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedResponse<CouponDTO>> {
    try {
      const response = await apiClient.get<PaginatedResponse<CouponDTO>>(
        '/admin/coupons',
        {
          params: { page, limit, search },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getCoupon(id: string): Promise<CouponDTO> {
    try {
      const response = await apiClient.get<ApiResponse<CouponDTO>>(
        `/admin/coupons/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async createCoupon(data: CreateCouponRequestDTO): Promise<CouponDTO> {
    try {
      const response = await apiClient.post<ApiResponse<CouponDTO>>(
        '/admin/coupons',
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateCoupon(
    id: string,
    data: UpdateCouponRequestDTO
  ): Promise<CouponDTO> {
    try {
      const response = await apiClient.put<ApiResponse<CouponDTO>>(
        `/admin/coupons/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deleteCoupon(id: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/coupons/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
