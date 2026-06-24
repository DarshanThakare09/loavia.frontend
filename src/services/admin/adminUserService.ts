import { apiClient } from '@/services/apiClient';
import { handleApiError } from '@/utils/adminErrorHandler';
import {
  CustomerSummaryDTO,
  CustomerProfileDTO,
  PaginatedResponse,
  UpdateCustomerStatusRequestDTO,
  UpdateCustomerRoleRequestDTO,
  ApiResponse,
  ListCustomersQuery,
} from '@/types/admin';

export const adminUserService = {
  async listCustomers(
    page: number = 1,
    limit: number = 10,
    query?: ListCustomersQuery
  ): Promise<PaginatedResponse<CustomerSummaryDTO>> {
    try {
      const response = await apiClient.get<
        PaginatedResponse<CustomerSummaryDTO>
      >('/admin/customers', {
        params: { page, limit, ...query },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getCustomerProfile(id: string): Promise<CustomerProfileDTO> {
    try {
      const response = await apiClient.get<ApiResponse<CustomerProfileDTO>>(
        `/admin/customers/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateCustomerStatus(
    id: string,
    status: 'ACTIVE' | 'SUSPENDED'
  ): Promise<CustomerSummaryDTO> {
    try {
      const response = await apiClient.put<
        ApiResponse<CustomerSummaryDTO>
      >(`/admin/customers/${id}/status`, {
        status,
      } as UpdateCustomerStatusRequestDTO);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateCustomerRole(
    id: string,
    role: string
  ): Promise<CustomerSummaryDTO> {
    try {
      const response = await apiClient.put<
        ApiResponse<CustomerSummaryDTO>
      >(`/admin/customers/${id}/role`, {
        role,
      } as UpdateCustomerRoleRequestDTO);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
