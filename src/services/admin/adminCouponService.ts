import { apiClient } from '@/services/apiClient';
import { handleApiError } from '@/utils/adminErrorHandler';
import {
  CouponDTO,
  CreateCouponRequestDTO,
  UpdateCouponRequestDTO,
  PaginatedResponse,
  ApiResponse,
} from '@/types/admin';

function mapBackendCoupon(c: any): CouponDTO {
  return {
    id: c.id,
    code: c.code,
    type: c.discountType,
    value: c.discountType === 'FIXED' ? c.value / 100 : c.value,
    minOrder: c.minOrderValue / 100,
    maxDiscount: c.maxDiscount ? c.maxDiscount / 100 : undefined,
    usageLimit: c.usageLimit || 1000,
    timesUsed: c.timesUsed || 0,
    expiryDate: c.expiresAt,
    isActive: c.active,
    description: c.description || '',
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export const adminCouponService = {
  async listCoupons(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedResponse<CouponDTO>> {
    try {
      const response = await apiClient.get<any>(
        '/admin/coupons',
        {
          params: { page, limit, search },
        }
      );
      const { data, total } = response.data.data;
      return {
        data: data.map(mapBackendCoupon),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getCoupon(id: string): Promise<CouponDTO> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `/admin/coupons/${id}`
      );
      return mapBackendCoupon(response.data.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async createCoupon(data: CreateCouponRequestDTO): Promise<CouponDTO> {
    try {
      const backendPayload = {
        code: data.code,
        discountType: data.type,
        value: data.type === 'FIXED' ? Math.round(data.value * 100) : Math.round(data.value),
        minOrderValue: Math.round(data.minOrder * 100),
        maxDiscount: data.maxDiscount ? Math.round(data.maxDiscount * 100) : undefined,
        expiresAt: data.expiryDate,
      };
      const response = await apiClient.post<ApiResponse<any>>(
        '/admin/coupons',
        backendPayload
      );
      return mapBackendCoupon(response.data.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateCoupon(
    id: string,
    data: UpdateCouponRequestDTO
  ): Promise<CouponDTO> {
    try {
      const backendPayload: any = {};
      if (data.isActive !== undefined) backendPayload.active = data.isActive;
      if (data.type !== undefined) backendPayload.discountType = data.type;
      if (data.value !== undefined) {
        const isFixed = data.type === 'FIXED' || (data.type === undefined && data.value > 100);
        backendPayload.value = isFixed ? Math.round(data.value * 100) : Math.round(data.value);
      }
      if (data.minOrder !== undefined) backendPayload.minOrderValue = Math.round(data.minOrder * 100);
      if (data.maxDiscount !== undefined) backendPayload.maxDiscount = Math.round(data.maxDiscount * 100);
      if (data.expiryDate !== undefined) backendPayload.expiresAt = data.expiryDate;

      const response = await apiClient.put<ApiResponse<any>>(
        `/admin/coupons/${id}`,
        backendPayload
      );
      return mapBackendCoupon(response.data.data);
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
