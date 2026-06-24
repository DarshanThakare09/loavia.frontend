import { apiClient } from '@/services/apiClient';
import { handleApiError } from '@/utils/adminErrorHandler';
import {
  OrderListDTO,
  PaginatedResponse,
  UpdateOrderStatusRequestDTO,
  UpdateOrderStatusResponseDTO,
  UpdateShipmentRequestDTO,
  UpdateShipmentResponseDTO,
  ApiResponse,
} from '@/types/admin';

export const adminOrderService = {
  async listOrders(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<OrderListDTO>> {
    try {
      const response = await apiClient.get<
        PaginatedResponse<OrderListDTO>
      >('/admin/orders', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getOrder(id: string): Promise<OrderListDTO> {
    try {
      const response = await apiClient.get<ApiResponse<OrderListDTO>>(
        `/admin/orders/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateOrderStatus(
    id: string,
    status: string
  ): Promise<UpdateOrderStatusResponseDTO> {
    try {
      const response = await apiClient.put<
        ApiResponse<UpdateOrderStatusResponseDTO>
      >(`/admin/orders/${id}/status`, {
        status,
      } as UpdateOrderStatusRequestDTO);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateShipmentTracking(
    id: string,
    data: UpdateShipmentRequestDTO
  ): Promise<UpdateShipmentResponseDTO> {
    try {
      const response = await apiClient.post<
        ApiResponse<UpdateShipmentResponseDTO>
      >(`/admin/orders/${id}/tracking`, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
