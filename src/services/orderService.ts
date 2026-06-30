import { apiClient } from './apiClient';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PAYMENT_RECEIVED_REVIEW';

export type ShipmentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURNED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface OrderHistoryItem {
  id: string;
  receiptNumber: string;
  status: OrderStatus;
  totalAmount: number;       // Paise
  subtotalAmount: number;    // Paise
  discountAmount: number;    // Paise
  createdAt: string;
  items: {
    productName: string;
    variantName: string;
    productImage: string | null;
    quantity: number;
    unitPrice: number;       // Paise
  }[];
  shipment?: {
    status: ShipmentStatus;
    trackingNumber: string | null;
  } | null;
}

export interface OrderHistoryResponse {
  data: OrderHistoryItem[];
  total: number;
}

export interface OrderShippingAddress {
  recipientName?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  phone?: string;
  email?: string;
}

export interface OrderDetailItem {
  id: string;
  productName: string;
  variantName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;         // Paise
  totalPrice: number;        // Paise
}

export interface OrderDetailPayment {
  status: PaymentStatus;
  method: string | null;
  gatewayPaymentId: string | null;
  amount: number;            // Paise
  refundedAmount: number;    // Paise
}

export interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string | null;
  timestamp: string;
}

export interface OrderDetailShipment {
  id: string;
  trackingNumber: string | null;
  courierPartner: string | null;
  status: ShipmentStatus;
  shippedAt: string | null;
  deliveredAt: string | null;
  events: TrackingEvent[];
}

export interface OrderDetail {
  id: string;
  receiptNumber: string;
  status: OrderStatus;
  totalAmount: number;       // Paise
  subtotalAmount: number;    // Paise
  taxAmount: number;         // Paise
  shippingFee: number;       // Paise
  discountAmount: number;    // Paise
  couponCode: string | null;
  createdAt: string;
  shippingAddress: OrderShippingAddress;
  customGiftNote?: string | null;
  items: OrderDetailItem[];
  payment: OrderDetailPayment | null;
  shipment: OrderDetailShipment | null;
}

export interface PublicTrackingResponse {
  orderId: string;
  receiptNumber: string;
  orderStatus: string;
  shipmentStatus: string;
  trackingNumber: string | null;
  courierPartner: string | null;
  events: TrackingEvent[];
}

// ─── Status Display Map ───────────────────────────────────────────────────────

export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; color: string; bgColor: string; step: number }
> = {
  PENDING:                 { label: 'Awaiting Payment',  color: 'text-amber-700',  bgColor: 'bg-amber-100',  step: 0 },
  PAID:                    { label: 'Payment Confirmed', color: 'text-blue-700',   bgColor: 'bg-blue-100',   step: 1 },
  PROCESSING:              { label: 'Being Prepared',    color: 'text-blue-700',   bgColor: 'bg-blue-100',   step: 1 },
  SHIPPED:                 { label: 'Shipped',           color: 'text-indigo-700', bgColor: 'bg-indigo-100', step: 2 },
  DELIVERED:               { label: 'Delivered',         color: 'text-green-700',  bgColor: 'bg-green-100',  step: 3 },
  CANCELLED:               { label: 'Cancelled',         color: 'text-red-700',    bgColor: 'bg-red-100',    step: -1 },
  REFUNDED:                { label: 'Refunded',          color: 'text-gray-600',   bgColor: 'bg-gray-100',   step: -1 },
  PAYMENT_RECEIVED_REVIEW: { label: 'Under Review',      color: 'text-orange-700', bgColor: 'bg-orange-100', step: 0 },
};

// ─── Helper: Paise → ₹ ──────────────────────────────────────────────────────

export function paiseToRupees(paise: number): string {
  return (paise / 100).toFixed(2);
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const orderService = {
  /**
   * GET /api/v1/orders?page=N&limit=N
   * Returns paginated order history for the authenticated user.
   */
  async getOrderHistory(page = 1, limit = 10): Promise<OrderHistoryResponse> {
    const res = await apiClient.get(`/orders?page=${page}&limit=${limit}`);
    return res.data.data as OrderHistoryResponse;
  },

  /**
   * GET /api/v1/orders/:id
   * Returns full order detail including items, payment, shipment, and tracking events.
   * Requires authentication.
   */
  async getOrderById(id: string): Promise<OrderDetail> {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data.data as OrderDetail;
  },

  /**
   * POST /api/v1/orders/:id/cancel
   * Cancels a PENDING order. Releases inventory reservations.
   * Requires authentication.
   */
  async cancelOrder(id: string): Promise<void> {
    await apiClient.post(`/orders/${id}/cancel`);
  },

  /**
   * GET /api/v1/orders/:idOrReceipt/tracking
   * Public endpoint — no auth required.
   * Accepts both order UUID and receipt number (LOAVIA-XXXX-YYYY).
   */
  async getPublicTracking(idOrReceipt: string): Promise<PublicTrackingResponse> {
    const res = await apiClient.get(`/orders/${idOrReceipt}/tracking`);
    return res.data.data as PublicTrackingResponse;
  },
};
