import { apiClient } from '@/services/apiClient';
import { handleApiError } from '@/utils/adminErrorHandler';
import {
  InventoryDTO,
  RestockRequestDTO,
  RestockResponseDTO,
  AdjustInventoryRequestDTO,
  PaginatedResponse,
  ApiResponse,
} from '@/types/admin';

// Alias for low-stock response — same shape as InventoryDTO
interface LowStockResponse {
  items: InventoryDTO[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminInventoryService = {
  async getLowStockItems(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<InventoryDTO>> {
    try {
      const response = await apiClient.get<LowStockResponse>(
        '/admin/inventory/low-stock',
        { params: { page, limit } }
      );
      // Normalize items/meta → data/meta for PaginatedResponse
      const { items, meta } = response.data;
      return { data: items ?? [], meta };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getVariantInventory(variantId: string): Promise<InventoryDTO> {
    try {
      const response = await apiClient.get<ApiResponse<InventoryDTO>>(
        `/admin/inventory/${variantId}`
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async restockInventory(data: RestockRequestDTO): Promise<RestockResponseDTO> {
    try {
      const response = await apiClient.post<ApiResponse<RestockResponseDTO>>(
        '/admin/inventory/restock',
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async adjustInventory(
    data: AdjustInventoryRequestDTO
  ): Promise<RestockResponseDTO> {
    try {
      const response = await apiClient.post<ApiResponse<RestockResponseDTO>>(
        '/admin/inventory/adjust',
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
