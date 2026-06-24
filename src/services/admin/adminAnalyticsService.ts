import { apiClient } from '@/services/apiClient';
import { handleApiError } from '@/utils/adminErrorHandler';
import { AuditLogDTO, PaginatedResponse } from '@/types/admin';

export const adminAnalyticsService = {
  async getAuditLogs(
    page: number = 1,
    limit: number = 10,
    entityType?: string
  ): Promise<PaginatedResponse<AuditLogDTO>> {
    try {
      const response = await apiClient.get<PaginatedResponse<AuditLogDTO>>(
        '/admin/audit-logs',
        {
          params: { page, limit, entityType },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
