// Admin Dashboard DTOs and Types
// Aligned with DTO_MAPPING_REPORT and ADMIN_INTEGRATION_MATRIX

// ─── Shared ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

export interface DashboardSummary {
  revenue: number;           // Total revenue in paise
  ordersCount: number;       // Total order count
  averageOrderValue: number; // in paise
  customersCount: number;    // CUSTOMER role users
  lowStockCount: number;     // Variants below threshold
}

export interface SalesChartDataPoint {
  date: string;   // ISO 8601
  revenue: number; // in paise
  count: number;   // order count for the day
}

export interface BestSeller {
  variantId: string;
  name: string;      // Variant name
  totalSold: number; // Quantity sold
}

export interface CategorySalesData {
  categoryId: string;
  categoryName: string;
  revenue: number;   // in paise
  quantity: number;  // total items sold
}

// ─── Orders ────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED';

export type ShipmentStatus =
  | 'PENDING'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURNED';

export interface OrderItemDTO {
  productName: string;
  variantName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number; // in paise
}

export interface ShipmentDTO {
  id?: string;
  status: ShipmentStatus;
  trackingNumber?: string | null;
  courierPartner?: string;
  updatedAt?: string;
}

export interface OrderListDTO {
  id: string;
  receiptNumber: string;
  status: OrderStatus;
  totalAmount: number; // in paise
  createdAt: string;   // ISO date
  items: OrderItemDTO[];
  shipment?: ShipmentDTO;
  customer?: {
    name: string;
    email: string;
  };
}

export interface UpdateOrderStatusRequestDTO {
  status: OrderStatus;
}

export interface UpdateShipmentRequestDTO {
  trackingNumber: string;
  courierPartner: string;
  status: ShipmentStatus;
}

export interface UpdateOrderStatusResponseDTO {
  id: string;
  status: string;
  updatedAt: string;
}

export interface UpdateShipmentResponseDTO {
  id: string;
  orderId: string;
  trackingNumber: string;
  courierPartner: string;
  status: ShipmentStatus;
  updatedAt: string;
}

// ─── Customers ─────────────────────────────────────────────────────────────

export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface LoyaltyPoints {
  currentPoints: number;
  totalEarned: number;
  lastUpdated: string;
}

export interface CustomerSummaryDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  ordersCount?: number;
  totalSpent?: number; // in paise
}

export interface CustomerProfileDTO extends CustomerSummaryDTO {
  addresses: Address[];
  orders: OrderListDTO[]; // Last 10 orders
  loyaltyPoints?: LoyaltyPoints;
}

export interface UpdateCustomerStatusRequestDTO {
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface UpdateCustomerRoleRequestDTO {
  role: UserRole;
}

export interface ListCustomersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isVerified?: boolean;
}

// ─── Coupons ───────────────────────────────────────────────────────────────
// NOTE: Backend uses "type" and "value", not "discountType"/"discountValue"
//       and "minOrder" / "maxDiscount" in rupees (not paise)

export type CouponType = 'PERCENTAGE' | 'FIXED';

export interface CreateCouponRequestDTO {
  code: string;           // Uppercase, 3-20 chars, unique
  type: CouponType;       // PERCENTAGE | FIXED
  value: number;          // For PERCENTAGE: 1-100, For FIXED: amount in rupees
  minOrder: number;       // Minimum order amount in rupees
  maxDiscount?: number;   // Max discount for PERCENTAGE type (rupees)
  usageLimit: number;     // Total uses allowed
  expiryDate: string;     // ISO date string
  isActive: boolean;
  description?: string;
}

export interface CouponDTO {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  timesUsed: number;
  expiryDate: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isExpired?: boolean;         // Derived: expiryDate < now
  usagePercentage?: number;    // Derived: timesUsed / usageLimit * 100
}

export type UpdateCouponRequestDTO = Partial<Omit<CreateCouponRequestDTO, 'code'>>;

export interface ListCouponsQuery {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}

// ─── Products ──────────────────────────────────────────────────────────────

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface ProductCategoryDTO {
  id: string;
  name: string;
  slug?: string;
}

export interface ProductVariantDTO {
  id: string;
  name: string;
  sku: string;
  price: number;          // in paise
  discountPrice?: number; // in paise
  stock: number;
  isActive?: boolean;
}

export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;              // in paise
  discountPrice?: number;     // in paise
  sku: string;
  category: ProductCategoryDTO;
  image: string;              // Primary image URL (first image)
  images?: string[];          // All images
  isFeatured: boolean;
  status: ProductStatus;
  variants?: ProductVariantDTO[];
  tags?: string[];
  createdAt: string;
}

export interface ProductListResponse {
  data: ProductDTO[];
  meta: PaginationMeta;
}

export interface CreateProductRequestDTO {
  name: string;
  description: string;
  price: number;          // in rupees (API converts to paise)
  discountPrice?: number; // in rupees
  categoryId: string;
  sku: string;
  images: string[];
  status: ProductStatus;
  isFeatured?: boolean;
  variants: Array<{
    name: string;
    sku: string;
    price: number; // in rupees
    stock: number;
  }>;
  tags?: string[];
}

export type UpdateProductRequestDTO = Partial<Omit<CreateProductRequestDTO, 'sku'>>;

export interface ListProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
}

// ─── Inventory ─────────────────────────────────────────────────────────────
// NOTE: Backend returns availableQty/reservedQty/totalQty/lowStockThreshold

export interface InventoryDTO {
  id: string;
  variantId: string;
  variantName: string;
  productId: string;
  productName: string;
  availableQty: number;      // Available for purchase
  reservedQty: number;       // Reserved in pending orders
  totalQty: number;          // Total stock
  lowStockThreshold: number; // Alert threshold
  lastRestockedAt: string;   // ISO date
  updatedAt: string;
}

export type LowStockItemDTO = InventoryDTO;

export interface RestockRequestDTO {
  variantId: string;
  quantity: number; // Must be > 0
}

export interface RestockResponseDTO {
  variantId: string;
  availableQty: number;
  reservedQty: number;
  totalQty: number;
  lastRestockedAt: string;
}

export interface AdjustInventoryRequestDTO {
  variantId: string;
  quantity: number; // Positive or negative
  reason: string;   // e.g., "Damage", "Shrinkage", "Correction"
}

// Keep backward-compatible alias for existing store references
export type InventoryAdjustmentDTO = InventoryDTO;

// ─── Reviews ───────────────────────────────────────────────────────────────
// NOTE: Backend returns userName/userEmail not authorName/authorEmail

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN';

export interface ReviewDTO {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;    // Reviewer display name
  userEmail: string;   // Reviewer email
  rating: number;      // 1-5
  title: string;
  content: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  moderatedBy?: string; // Admin ID who moderated
  moderatedAt?: string;
}

export interface UpdateReviewStatusRequestDTO {
  status: ReviewStatus;
}

export interface ListReviewsQuery {
  page?: number;
  limit?: number;
  status?: ReviewStatus;
  productId?: string;
}

// ─── Audit Logs ────────────────────────────────────────────────────────────

export interface AuditLogDTO {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  changes?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
