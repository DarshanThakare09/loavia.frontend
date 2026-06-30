import { apiClient } from "./apiClient";

export const reviewService = {
  /**
   * Fetches public approved reviews from the database.
   */
  async getApprovedReviews(): Promise<any[]> {
    const response = await apiClient.get<any>("/reviews");
    // Response envelope is { success: true, message: string, data: [...] }
    return response.data?.data ?? [];
  }
};
