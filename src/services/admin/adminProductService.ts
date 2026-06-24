import { apiClient } from '@/services/apiClient';
import { handleApiError } from '@/utils/adminErrorHandler';
import {
  ProductDTO,
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
  PaginatedResponse,
  ApiResponse,
} from '@/types/admin';

export const adminProductService = {
  async listProducts(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    search?: string
  ): Promise<PaginatedResponse<ProductDTO>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ProductDTO>>(
        '/admin/products',
        {
          params: { page, limit, categoryId, search },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getProduct(id: string): Promise<ProductDTO> {
    try {
      const response = await apiClient.get<ApiResponse<ProductDTO>>(
        `/admin/products/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async createProduct(data: CreateProductRequestDTO): Promise<ProductDTO> {
    try {
      const response = await apiClient.post<ApiResponse<ProductDTO>>(
        '/admin/products',
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateProduct(
    id: string,
    data: UpdateProductRequestDTO
  ): Promise<ProductDTO> {
    try {
      const response = await apiClient.put<ApiResponse<ProductDTO>>(
        `/admin/products/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/products/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
