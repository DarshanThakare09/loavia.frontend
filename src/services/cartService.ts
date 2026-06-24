import { apiClient } from "./apiClient";
import { CartItem } from "@/store/cartStore";

export function mapBackendCartItem(item: any): CartItem {
  const p = item.product;
  const v = item.variant;
  const primaryImageObj = p.images?.find((img: any) => img.isPrimary) || p.images?.[0];
  const image = primaryImageObj?.url || "/premium_cookie.png";
  
  const name = v.isDefault 
    ? p.name 
    : `${p.name} (${v.displayLabel || v.name})`;

  const price = v.discountPrice ? v.discountPrice / 100 : v.price / 100;

  return {
    id: item.id, // Database cartItem.id or guest_item_variantId
    variantId: item.variantId,
    productId: item.productId,
    name,
    price,
    quantity: item.quantity,
    image,
    isCustomBox: item.isCustomBox || false,
    customBoxSelections: item.customBoxSelections || []
  };
}

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    const response = await apiClient.get("/cart");
    const items = response.data.data?.items || [];
    return items.map(mapBackendCartItem);
  },

  async addToCart(
    variantId: string,
    quantity: number,
    isCustomBox: boolean,
    customBoxSelections?: any[]
  ): Promise<CartItem[]> {
    const response = await apiClient.post("/cart/items", {
      variantId,
      quantity,
      isCustomBox,
      customBoxSelections
    });
    const items = response.data.data?.items || [];
    return items.map(mapBackendCartItem);
  },

  async updateQuantity(cartItemId: string, quantity: number): Promise<CartItem[]> {
    const response = await apiClient.put(`/cart/items/${cartItemId}`, { quantity });
    const items = response.data.data?.items || [];
    return items.map(mapBackendCartItem);
  },

  async removeFromCart(cartItemId: string): Promise<CartItem[]> {
    const response = await apiClient.delete(`/cart/items/${cartItemId}`);
    const items = response.data.data?.items || [];
    return items.map(mapBackendCartItem);
  },

  async clearCart(): Promise<CartItem[]> {
    const response = await apiClient.delete("/cart");
    const items = response.data.data?.items || [];
    return items.map(mapBackendCartItem);
  },

  async mergeCarts(
    items: Array<{
      variantId: string;
      quantity: number;
      isCustomBox: boolean;
      customBoxSelections?: any[];
    }>
  ): Promise<{ items: CartItem[]; clampedItems: any[] }> {
    const response = await apiClient.post("/cart/merge", { items });
    const cartItems = response.data.data?.cart?.items || [];
    const clampedItems = response.data.data?.clampedItems || [];
    return {
      items: cartItems.map(mapBackendCartItem),
      clampedItems
    };
  }
};
