import { ReviewItem, ReviewStatus } from "@/store/siteStore";

const defaultReviews: ReviewItem[] = [];


let reviewsDb = [...defaultReviews];

export const mockReviewService = {
  async getReviews(): Promise<ReviewItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...reviewsDb]);
      }, 100);
    });
  },

  async addReview(reviewData: Omit<ReviewItem, 'id' | 'createdAt' | 'status' | 'featured' | 'pinned'>): Promise<ReviewItem> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReview: ReviewItem = {
          ...reviewData,
          id: Date.now(),
          status: "pending",
          featured: false,
          pinned: false,
          createdAt: new Date().toISOString(),
          // Legacy compat
          role: "Verified Buyer",
          content: reviewData.reviewText
        };
        reviewsDb = [newReview, ...reviewsDb];
        resolve(newReview);
      }, 150);
    });
  },

  async moderateReview(id: number, status: ReviewStatus): Promise<ReviewItem> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = reviewsDb.findIndex((r) => r.id === id);
        if (index === -1) {
          reject(new Error("Review not found"));
          return;
        }
        reviewsDb[index].status = status;
        resolve(reviewsDb[index]);
      }, 100);
    });
  },

  async toggleFeatured(id: number): Promise<ReviewItem> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = reviewsDb.findIndex((r) => r.id === id);
        if (index === -1) {
          reject(new Error("Review not found"));
          return;
        }
        reviewsDb[index].featured = !reviewsDb[index].featured;
        resolve(reviewsDb[index]);
      }, 100);
    });
  },

  async togglePinned(id: number): Promise<ReviewItem> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = reviewsDb.findIndex((r) => r.id === id);
        if (index === -1) {
          reject(new Error("Review not found"));
          return;
        }
        reviewsDb[index].pinned = !reviewsDb[index].pinned;
        resolve(reviewsDb[index]);
      }, 100);
    });
  },

  async deleteReview(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        reviewsDb = reviewsDb.filter((r) => r.id !== id);
        resolve(true);
      }, 100);
    });
  }
};
