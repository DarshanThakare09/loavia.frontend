import { apiClient } from '@/services/apiClient';
import { handleApiError } from '@/utils/adminErrorHandler';
import {
  ReviewDTO,
  UpdateReviewStatusRequestDTO,
  PaginatedResponse,
  ApiResponse,
  ReviewStatus,
} from '@/types/admin';

export const adminReviewService = {
  async listReviews(
    page: number = 1,
    limit: number = 10,
    status?: ReviewStatus,
    productId?: string
  ): Promise<PaginatedResponse<ReviewDTO>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ReviewDTO>>(
        '/admin/reviews',
        {
          params: { page, limit, status, productId },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateReviewStatus(
    id: string,
    status: ReviewStatus
  ): Promise<ReviewDTO> {
    try {
      const response = await apiClient.put<ApiResponse<ReviewDTO>>(
        `/admin/reviews/${id}/status`,
        { status } as UpdateReviewStatusRequestDTO
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
