import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminOrderService } from '@/services/admin/adminOrderService';
import {
  OrderListDTO,
  PaginationMeta,
  OrderStatus,
  ShipmentStatus,
} from '@/types/admin';
import { AdminServiceError } from '@/utils/adminErrorHandler';

interface AdminOrderState {
  // Orders Data
  orders: OrderListDTO[];
  selectedOrder: OrderListDTO | null;

  // Pagination
  pagination: PaginationMeta | null;
  currentPage: number;
  pageSize: number;

  // Loading States
  isLoadingOrders: boolean;
  isLoadingOrder: boolean;
  isUpdatingStatus: boolean;
  isUpdatingShipment: boolean;

  // Error States
  ordersError: string | null;
  orderError: string | null;
  statusError: string | null;
  shipmentError: string | null;

  // Search/Filter
  searchQuery: string;

  // Actions
  fetchOrders: (page?: number, limit?: number) => Promise<void>;
  getOrder: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  updateShipmentTracking: (
    id: string,
    data: {
      trackingNumber: string;
      courierPartner: string;
      status: ShipmentStatus;
    }
  ) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setPagination: (page: number, pageSize: number) => void;
  selectOrder: (order: OrderListDTO | null) => void;
  clearErrors: () => void;
  reset: () => void;
}

const initialState = {
  orders: [],
  selectedOrder: null,
  pagination: null,
  currentPage: 1,
  pageSize: 10,
  isLoadingOrders: false,
  isLoadingOrder: false,
  isUpdatingStatus: false,
  isUpdatingShipment: false,
  ordersError: null,
  orderError: null,
  statusError: null,
  shipmentError: null,
  searchQuery: '',
};

export const useAdminOrderStore = create<AdminOrderState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchOrders: async (page = 1, limit = 10) => {
        set({
          isLoadingOrders: true,
          ordersError: null,
          currentPage: page,
          pageSize: limit,
        });
        try {
          const data = await adminOrderService.listOrders(page, limit);
          set({
            orders: data.data,
            pagination: data.meta,
          });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch orders';
          set({ ordersError: message });
        } finally {
          set({ isLoadingOrders: false });
        }
      },

      getOrder: async (id: string) => {
        set({ isLoadingOrder: true, orderError: null });
        try {
          const data = await adminOrderService.getOrder(id);
          set({ selectedOrder: data });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch order';
          set({ orderError: message });
        } finally {
          set({ isLoadingOrder: false });
        }
      },

      updateOrderStatus: async (id: string, status: OrderStatus) => {
        set({ isUpdatingStatus: true, statusError: null });
        try {
          const response = await adminOrderService.updateOrderStatus(id, status);
          // Update the order in the list
          const orders = get().orders.map((order) =>
            order.id === id ? { ...order, status } : order
          );
          set({ orders, selectedOrder: null });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to update order status';
          set({ statusError: message });
          throw error;
        } finally {
          set({ isUpdatingStatus: false });
        }
      },

      updateShipmentTracking: async (id: string, data) => {
        set({ isUpdatingShipment: true, shipmentError: null });
        try {
          const response = await adminOrderService.updateShipmentTracking(
            id,
            data
          );
          // Update the order in the list
          const orders = get().orders.map((order) =>
            order.id === id
              ? {
                  ...order,
                  shipment: {
                    status: data.status,
                    trackingNumber: data.trackingNumber,
                    courierPartner: data.courierPartner,
                  },
                }
              : order
          );
          set({ orders, selectedOrder: null });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to update shipment tracking';
          set({ shipmentError: message });
          throw error;
        } finally {
          set({ isUpdatingShipment: false });
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setPagination: (page: number, pageSize: number) => {
        set({ currentPage: page, pageSize });
      },

      selectOrder: (order: OrderListDTO | null) => {
        set({ selectedOrder: order });
      },

      clearErrors: () => {
        set({
          ordersError: null,
          orderError: null,
          statusError: null,
          shipmentError: null,
        });
      },

      reset: () => set(initialState),
    }),
    {
      name: 'admin-order-store',
      version: 1,
    }
  )
);
