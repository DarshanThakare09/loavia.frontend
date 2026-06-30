import { apiClient } from "./apiClient";

export interface AddressDTO {
  recipientName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
}

export interface CheckoutValidatePayload {
  couponCode?: string;
  items?: Array<{
    variantId: string;
    quantity: number;
    isCustomBox?: boolean;
    customBoxSelections?: any[];
  }>;
}

export interface CheckoutValidateResponse {
  subtotal: number;       // in Paise
  discountAmount: number; // in Paise
  taxAmount: number;      // in Paise
  shippingFee: number;    // in Paise
  totalAmount: number;     // in Paise
  appliedCoupon?: any;
}

export interface PlaceOrderPayload {
  addressId?: string;
  shippingAddress?: AddressDTO;
  couponCode?: string;
  customGiftNote?: string;
  items?: Array<{
    variantId: string;
    quantity: number;
    isCustomBox?: boolean;
    customBoxSelections?: any[];
  }>;
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  method: string;
}

export const checkoutService = {
  async validateCheckout(payload: CheckoutValidatePayload): Promise<CheckoutValidateResponse> {
    const response = await apiClient.post("/checkout/validate", payload);
    return response.data.data;
  },

  async placeOrder(payload: PlaceOrderPayload): Promise<any> {
    const response = await apiClient.post("/orders", payload);
    return response.data.data;
  },

  async verifyPayment(payload: VerifyPaymentPayload): Promise<any> {
    const response = await apiClient.post("/payments/verify", payload);
    return response.data.data;
  },

  async retryPayment(orderId: string): Promise<any> {
    const response = await apiClient.post("/payments/retry", { orderId });
    return response.data.data;
  }
};
