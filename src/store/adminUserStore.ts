import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminUserService } from '@/services/admin/adminUserService';
import {
  CustomerSummaryDTO,
  CustomerProfileDTO,
  PaginationMeta,
  UserRole,
} from '@/types/admin';
import { AdminServiceError } from '@/utils/adminErrorHandler';

interface AdminUserState {
  // Customers Data
  customers: CustomerSummaryDTO[];
  selectedCustomer: CustomerProfileDTO | null;

  // Pagination
  pagination: PaginationMeta | null;
  currentPage: number;
  pageSize: number;

  // Loading States
  isLoadingCustomers: boolean;
  isLoadingCustomer: boolean;
  isUpdatingStatus: boolean;
  isUpdatingRole: boolean;

  // Error States
  customersError: string | null;
  customerError: string | null;
  statusError: string | null;
  roleError: string | null;

  // Search/Filter
  searchQuery: string;
  selectedRole: UserRole | null;

  contactMessages: any[];
  isLoadingMessages: boolean;
  messagesError: string | null;
  isRespondingMessage: boolean;

  // Actions
  fetchCustomers: (page?: number, limit?: number, search?: string) => Promise<void>;
  getCustomerProfile: (id: string) => Promise<void>;
  updateCustomerStatus: (
    id: string,
    status: 'ACTIVE' | 'SUSPENDED'
  ) => Promise<void>;
  updateCustomerRole: (id: string, role: UserRole) => Promise<void>;
  fetchContactMessages: (page?: number, limit?: number) => Promise<void>;
  respondContactMessage: (id: string, responseText: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedRole: (role: UserRole | null) => void;
  setPagination: (page: number, pageSize: number) => void;
  selectCustomer: (customer: CustomerProfileDTO | null) => void;
  clearErrors: () => void;
  reset: () => void;
}

const initialState = {
  customers: [],
  selectedCustomer: null,
  pagination: null,
  currentPage: 1,
  pageSize: 10,
  isLoadingCustomers: false,
  isLoadingCustomer: false,
  isUpdatingStatus: false,
  isUpdatingRole: false,
  customersError: null,
  customerError: null,
  statusError: null,
  roleError: null,
  searchQuery: '',
  selectedRole: null,
  contactMessages: [],
  isLoadingMessages: false,
  messagesError: null,
  isRespondingMessage: false,
};

export const useAdminUserStore = create<AdminUserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchCustomers: async (page = 1, limit = 10, search?: string) => {
        set({
          isLoadingCustomers: true,
          customersError: null,
          currentPage: page,
          pageSize: limit,
        });
        try {
          const data = await adminUserService.listCustomers(page, limit, {
            search,
            role: get().selectedRole || undefined,
          });
          set({
            customers: Array.isArray(data.data) ? data.data : [],
            pagination: data.meta,
          });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch customers';
          set({ customersError: message });
        } finally {
          set({ isLoadingCustomers: false });
        }
      },

      getCustomerProfile: async (id: string) => {
        set({ isLoadingCustomer: true, customerError: null });
        try {
          const data = await adminUserService.getCustomerProfile(id);
          set({ selectedCustomer: data });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch customer profile';
          set({ customerError: message });
        } finally {
          set({ isLoadingCustomer: false });
        }
      },

      updateCustomerStatus: async (
        id: string,
        status: 'ACTIVE' | 'SUSPENDED'
      ) => {
        set({ isUpdatingStatus: true, statusError: null });
        try {
          const response = await adminUserService.updateCustomerStatus(
            id,
            status
          );
          // Update the customer in the list
          const customers = get().customers.map((customer) =>
            customer.id === id ? { ...customer, status } : customer
          );
          set({ customers, selectedCustomer: null });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to update customer status';
          set({ statusError: message });
          throw error;
        } finally {
          set({ isUpdatingStatus: false });
        }
      },

      updateCustomerRole: async (id: string, role: UserRole) => {
        set({ isUpdatingRole: true, roleError: null });
        try {
          const response = await adminUserService.updateCustomerRole(id, role);
          // Update the customer in the list
          const customers = get().customers.map((customer) =>
            customer.id === id ? { ...customer, role } : customer
          );
          set({ customers, selectedCustomer: null });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to update customer role';
          set({ roleError: message });
          throw error;
        } finally {
          set({ isUpdatingRole: false });
        }
      },

      fetchContactMessages: async (page = 1, limit = 50) => {
        set({ isLoadingMessages: true, messagesError: null });
        try {
          const data = await adminUserService.listContactMessages(page, limit);
          set({
            contactMessages: Array.isArray(data.data) ? data.data : [],
          });
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to fetch contact messages';
          set({ messagesError: message });
        } finally {
          set({ isLoadingMessages: false });
        }
      },

      respondContactMessage: async (id: string, responseText: string) => {
        set({ isRespondingMessage: true });
        try {
          const updated = await adminUserService.respondContactMessage(id, responseText);
          // Optimistically patch the message in local state
          set((state: any) => ({
            contactMessages: state.contactMessages.map((m: any) =>
              m.id === id ? { ...m, ...updated } : m
            ),
          }));
        } catch (error) {
          const message =
            error instanceof AdminServiceError
              ? error.message
              : 'Failed to send response';
          throw new Error(message);
        } finally {
          set({ isRespondingMessage: false });
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setSelectedRole: (role: UserRole | null) => {
        set({ selectedRole: role });
      },

      setPagination: (page: number, pageSize: number) => {
        set({ currentPage: page, pageSize });
      },

      selectCustomer: (customer: CustomerProfileDTO | null) => {
        set({ selectedCustomer: customer });
      },

      clearErrors: () => {
        set({
          customersError: null,
          customerError: null,
          statusError: null,
          roleError: null,
        });
      },

      reset: () => set(initialState),
    }),
    {
      name: 'admin-user-store',
      version: 2,
      migrate: (persisted: unknown) => {
        const s = (persisted ?? {}) as Record<string, unknown>;
        return { ...s, customers: Array.isArray(s.customers) ? s.customers : [] };
      },
    }
  )
);
