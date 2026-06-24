import { apiClient } from "./apiClient";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
}

export function mapBackendWishlistItem(item: any): WishlistItem {
  const p = item.product;
  const primaryImageObj = p.images?.find((img: any) => img.isPrimary) || p.images?.[0];
  const image = primaryImageObj?.url || "/premium_cookie.png";
  
  return {
    id: item.productId, // Map product ID as frontend ID for matching
    name: p.name,
    price: p.basePrice / 100, // Paise to Rupees
    image,
    rating: p.averageRating,
    reviews: p.reviewCount
  };
}

export const wishlistService = {
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await apiClient.get("/wishlist");
    const items = response.data.data?.items || [];
    return items.map(mapBackendWishlistItem);
  },

  async addToWishlist(productId: string): Promise<any> {
    const response = await apiClient.post("/wishlist/items", { productId });
    return response.data;
  },

  async removeFromWishlist(productId: string): Promise<any> {
    const response = await apiClient.delete(`/wishlist/items/${productId}`);
    return response.data;
  }
};
