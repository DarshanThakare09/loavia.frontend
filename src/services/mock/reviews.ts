import { ReviewItem, ReviewStatus } from "@/store/siteStore";

const defaultReviews: ReviewItem[] = [
  {
    id: 1,
    customerName: "Sarah Jenkins",
    customerEmail: "sarah@example.com",
    reviewText: "These are genuinely the best cookies I've ever had. The Double Dark Chocolate is incredibly rich, and the packaging makes it feel so premium. Worth every penny!",
    rating: 5,
    status: "approved",
    featured: true,
    pinned: false,
    createdAt: "2024-01-15T10:30:00Z",
    name: "Sarah Jenkins",
    role: "Verified Buyer",
    content: "These are genuinely the best cookies I've ever had. The Double Dark Chocolate is incredibly rich, and the packaging makes it feel so premium. Worth every penny!",
  },
  {
    id: 2,
    customerName: "Michael Chen",
    customerEmail: "michael@example.com",
    reviewText: "I sent the 12-pack custom box to my team for the holidays. They arrived fresh and everyone loved them. The UI for building the box was super easy to use.",
    rating: 5,
    status: "approved",
    featured: false,
    pinned: false,
    createdAt: "2024-02-03T14:15:00Z",
    name: "Michael Chen",
    role: "Verified Buyer",
    content: "I sent the 12-pack custom box to my team for the holidays. They arrived fresh and everyone loved them. The UI for building the box was super easy to use.",
  },
  {
    id: 3,
    customerName: "Emma Roberts",
    customerEmail: "emma@example.com",
    reviewText: "I'm obsessed with the healthy alternatives. They actually taste like real, indulgent cookies without the guilt. LOAVIA has a customer for life.",
    rating: 5,
    status: "approved",
    featured: true,
    pinned: true,
    createdAt: "2024-02-20T09:00:00Z",
    name: "Emma Roberts",
    role: "Verified Buyer",
    content: "I'm obsessed with the healthy alternatives. They actually taste like real, indulgent cookies without the guilt. LOAVIA has a customer for life.",
  },
];

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
