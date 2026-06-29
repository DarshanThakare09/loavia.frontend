import { apiClient } from '@/services/apiClient';
import { handleApiError } from '@/utils/adminErrorHandler';
import {
  ReviewDTO,
  UpdateReviewStatusRequestDTO,
  PaginatedResponse,
  ReviewStatus,
} from '@/types/admin';

// Map raw backend review shape → flat ReviewDTO used by the admin UI
function mapBackendReview(r: any): ReviewDTO {
  return {
    id: r.id,
    productId: r.productId,
    productName: r.product?.name ?? r.productName ?? 'Unknown Product',
    userId: r.userId,
    userName: r.user?.name ?? r.userName ?? 'Anonymous',
    userEmail: r.user?.email ?? r.userEmail ?? '',
    rating: r.rating,
    title: r.title ?? '',            // backend may omit title
    content: r.comment ?? r.content ?? '',  // backend sends "comment"
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    moderatedBy: r.moderatedBy ?? null,
    moderatedAt: r.moderatedAt ?? null,
  };
}

export const adminReviewService = {
  async listReviews(
    page: number = 1,
    limit: number = 10,
    status?: ReviewStatus,
    productId?: string
  ): Promise<PaginatedResponse<ReviewDTO>> {
    try {
      const response = await apiClient.get<any>(
        '/admin/reviews',
        {
          params: { page, limit, status, productId },
        }
      );
      // Backend wraps in { success, message, data: { data: [...], total } }
      const payload = response.data?.data ?? response.data;
      const rawList: any[] = Array.isArray(payload?.data) ? payload.data : [];
      const total: number = payload?.total ?? rawList.length;
      return {
        data: rawList.map(mapBackendReview),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateReviewStatus(
    id: string,
    status: ReviewStatus
  ): Promise<ReviewDTO> {
    try {
      const response = await apiClient.put<any>(
        `/admin/reviews/${id}/status`,
        { status } as UpdateReviewStatusRequestDTO
      );
      const raw = response.data?.data ?? response.data;
      return mapBackendReview(raw);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
