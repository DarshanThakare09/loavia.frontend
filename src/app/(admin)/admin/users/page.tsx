"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAdminUserStore } from "@/store/adminUserStore";
import { CustomerSummaryDTO, CustomerProfileDTO, UserRole } from "@/types/admin";
import {
  Search, Eye, X, User as UserIcon, MapPin, ShoppingBag,
  Mail, Phone, AlertCircle, Loader2, RefreshCw, Shield, Ban,
  CheckCircle2,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────

function getStatusBadge(status: "ACTIVE" | "SUSPENDED") {
  return status === "ACTIVE"
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-rose-50 text-rose-700 border border-rose-200";
}

function getRoleBadge(role: UserRole) {
  switch (role) {
    case "SUPER_ADMIN": return "bg-purple-50 text-purple-700 border-purple-200";
    case "ADMIN":       return "bg-blue-50 text-blue-700 border-blue-200";
    case "STAFF":       return "bg-amber-50 text-amber-700 border-amber-200";
    default:            return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}

function formatRupees(paise?: number) {
  if (paise == null) return "—";
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

const ALL_ROLES: UserRole[] = ["CUSTOMER", "STAFF", "ADMIN", "SUPER_ADMIN"];

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const store = useAdminUserStore();

  const [searchQuery, setSearchQuery]     = useState("");
  const [selectedUser, setSelectedUser]   = useState<CustomerProfileDTO | null>(null);
  const [roleFilter, setRoleFilter]       = useState<UserRole | "ALL">("ALL");

  // For modal role/status update
  const [pendingRole, setPendingRole]     = useState<UserRole>("CUSTOMER");
  const [pendingStatus, setPendingStatus] = useState<"ACTIVE" | "SUSPENDED">("ACTIVE");

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ── Fetch on mount ────────────────────────────────────────────────────
  useEffect(() => {
    store.fetchCustomers(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Debounced search ──────────────────────────────────────────────────
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      store.fetchCustomers(1, 10, query);
    }, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPage = useCallback(
    (page: number) => store.fetchCustomers(page, store.pageSize, searchQuery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.pageSize, searchQuery]
  );

  // ── Open profile modal ────────────────────────────────────────────────
  const handleViewProfile = async (customer: CustomerSummaryDTO) => {
    await store.getCustomerProfile(customer.id);
    const profile = useAdminUserStore.getState().selectedCustomer;
    if (profile) {
      setSelectedUser(profile);
      setPendingRole(profile.role);
      setPendingStatus(profile.status);
    }
  };

  // ── Update role ───────────────────────────────────────────────────────
  const handleRoleUpdate = async () => {
    if (!selectedUser) return;
    try {
      await store.updateCustomerRole(selectedUser.id, pendingRole);
      setSelectedUser(prev => prev ? { ...prev, role: pendingRole } : null);
    } catch { /* toast shown by store */ }
  };

  // ── Update status (suspend / activate) ───────────────────────────────
  const handleStatusUpdate = async () => {
    if (!selectedUser) return;
    try {
      await store.updateCustomerStatus(selectedUser.id, pendingStatus);
      setSelectedUser(prev => prev ? { ...prev, status: pendingStatus } : null);
    } catch { /* toast shown by store */ }
  };

  // ── Filter displayed customers ─────────────────────────────────────────
  const displayedCustomers = store.customers.filter(c =>
    roleFilter === "ALL" || c.role === roleFilter
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Customers</h1>
          <p className="text-brand-text-secondary mt-1">
            {store.pagination
              ? `${store.pagination.total.toLocaleString()} total customers`
              : "Manage customer profiles and accounts"}
          </p>
        </div>
        <button
          onClick={() => store.fetchCustomers(store.currentPage, store.pageSize, searchQuery)}
          disabled={store.isLoadingCustomers}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-brown/10 rounded-xl text-sm font-semibold text-brand-brown hover:bg-brand-light transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${store.isLoadingCustomers ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {store.customersError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Error loading customers</p>
            <p className="text-red-700 text-sm">{store.customersError}</p>
            <button
              onClick={() => store.fetchCustomers(store.currentPage, store.pageSize)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-white p-4 rounded-2xl border border-brand-brown/5 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            className="w-full pl-10 pr-4 py-2 border border-brand-brown/10 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm transition-all"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["ALL", ...ALL_ROLES] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                roleFilter === r
                  ? "bg-brand-brown text-white shadow-sm"
                  : "bg-brand-light text-brand-text-secondary hover:bg-brand-gold/15"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {store.isLoadingCustomers && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-gradient-to-r from-brand-light to-brand-gold/10 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!store.isLoadingCustomers && displayedCustomers.length === 0 && !store.customersError && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-12 text-center">
          <UserIcon className="w-12 h-12 text-brand-gold/40 mx-auto mb-4" />
          <p className="text-brand-text-secondary text-lg font-semibold">No customers found</p>
          <p className="text-brand-text-secondary text-sm mt-1">
            {searchQuery ? "Try a different search term" : "No customer accounts exist yet"}
          </p>
        </div>
      )}

      {/* Customer Table */}
      {!store.isLoadingCustomers && displayedCustomers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-light border-b border-brand-brown/10">
                  <th className="p-4 font-semibold text-brand-brown text-sm">Customer</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Phone</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Role</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Status</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Orders</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Total Spent</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-brand-brown/5 hover:bg-brand-light/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-gold/15 text-brand-gold font-bold flex items-center justify-center text-sm border border-brand-gold/10 flex-shrink-0">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-brand-text-primary text-sm block">{customer.name}</span>
                          <span className="text-xs text-brand-text-secondary">{customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-brand-text-secondary">
                      {customer.phone || "N/A"}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getRoleBadge(customer.role)}`}>
                        {customer.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${getStatusBadge(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-brand-text-secondary">
                      {customer.ordersCount ?? "—"}
                    </td>
                    <td className="p-4 font-bold text-brand-text-primary text-sm">
                      {formatRupees(customer.totalSpent)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewProfile(customer)}
                        disabled={store.isLoadingCustomer}
                        className="text-brand-gold hover:text-brand-brown p-2 hover:bg-brand-gold/10 rounded-lg transition-colors disabled:opacity-50"
                        title="View Profile"
                      >
                        {store.isLoadingCustomer ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!store.isLoadingCustomers && store.pagination && store.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          <button
            disabled={store.currentPage <= 1}
            onClick={() => fetchPage(store.currentPage - 1)}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          {Array.from({ length: store.pagination.totalPages }, (_, i) => i + 1)
            .filter(p => Math.abs(p - store.currentPage) <= 2 || p === 1 || p === store.pagination!.totalPages)
            .map((page, idx, arr) => (
              <>
                {idx > 0 && arr[idx - 1] !== page - 1 && (
                  <span key={`e-${page}`} className="px-2 py-2 text-brand-text-secondary text-sm">…</span>
                )}
                <button
                  key={page}
                  onClick={() => fetchPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    store.currentPage === page
                      ? "bg-brand-brown text-white"
                      : "bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20"
                  }`}
                >
                  {page}
                </button>
              </>
            ))}
          <button
            disabled={store.currentPage >= store.pagination.totalPages}
            onClick={() => fetchPage(store.currentPage + 1)}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Customer Profile Modal ──────────────────────────────────────── */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-light rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-brand-brown/10 animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="p-6 border-b border-brand-brown/10 flex items-center justify-between bg-white rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-gold text-brand-brown font-bold flex items-center justify-center text-lg">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl text-brand-brown">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadge(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                    {selectedUser.isVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-brand-light rounded-full transition-colors text-brand-text-secondary hover:text-brand-brown"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">

              {/* Contact Info */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 shadow-sm space-y-3">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-brand-gold" /> Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-text-secondary/60 flex-shrink-0" />
                    <span className="font-medium break-all">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-text-secondary/60 flex-shrink-0" />
                    <span className="font-medium">{selectedUser.phone || "No phone provided"}</span>
                  </div>
                </div>
                <div className="text-xs text-brand-text-secondary pt-1">
                  Member since {formatDate(selectedUser.createdAt)}
                </div>
              </div>

              {/* Loyalty Points */}
              {selectedUser.loyaltyPoints && (
                <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 shadow-sm space-y-2">
                  <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider">Loyalty Points</h4>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-xs text-brand-text-secondary block">Current</span>
                      <span className="font-bold text-lg text-brand-gold">{selectedUser.loyaltyPoints.currentPoints}</span>
                    </div>
                    <div>
                      <span className="text-xs text-brand-text-secondary block">Total Earned</span>
                      <span className="font-bold text-lg text-brand-brown">{selectedUser.loyaltyPoints.totalEarned}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 shadow-sm space-y-3">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-gold" /> Saved Addresses
                </h4>
                {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.addresses.map((addr) => (
                      <div key={addr.id} className="p-3 bg-brand-light rounded-xl border border-brand-brown/5 text-xs flex justify-between items-start">
                        <div>
                          <span className="font-bold text-brand-brown uppercase tracking-wider block mb-1">
                            {addr.label}
                            {addr.isDefault && (
                              <span className="ml-2 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold normal-case">Default</span>
                            )}
                          </span>
                          <span className="text-brand-text-secondary font-medium">
                            {addr.recipientName && `${addr.recipientName} · `}
                            {addr.street}, {addr.city} — {addr.postalCode}
                          </span>
                          {addr.phone && <span className="text-brand-text-secondary block mt-0.5">{addr.phone}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-brand-text-secondary text-center py-2">No addresses saved.</p>
                )}
              </div>

              {/* Order History */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 shadow-sm space-y-3">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brand-gold" /> Recent Orders
                </h4>
                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.orders.slice(0, 5).map((ord) => (
                      <div key={ord.id} className="p-3 bg-brand-light rounded-xl border border-brand-brown/5 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <span className="font-mono font-bold text-brand-brown text-sm block">{ord.receiptNumber || ord.id.slice(0, 8).toUpperCase()}</span>
                          <span className="text-brand-text-secondary">{formatDate(ord.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm">{formatRupees(ord.totalAmount)}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            ord.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            ord.status === "CANCELLED" ? "bg-rose-50 text-rose-700 border-rose-200" :
                            "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-brand-text-secondary text-center py-2">No orders yet.</p>
                )}
              </div>

              {/* Admin Controls */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 shadow-sm space-y-4">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-gold" /> Admin Controls
                </h4>

                {/* Role update */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="text-sm font-semibold text-brand-text-primary w-24 flex-shrink-0">Role</label>
                  <div className="flex gap-2 flex-1">
                    <select
                      value={pendingRole}
                      onChange={(e) => setPendingRole(e.target.value as UserRole)}
                      className="flex-1 px-3 py-2 border border-brand-brown/20 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-gold outline-none"
                    >
                      {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button
                      onClick={handleRoleUpdate}
                      disabled={store.isUpdatingRole || pendingRole === selectedUser.role}
                      className="px-4 py-2 bg-brand-brown text-white rounded-xl text-sm font-semibold hover:bg-brand-gold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {store.isUpdatingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Save
                    </button>
                  </div>
                </div>

                {/* Status update */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="text-sm font-semibold text-brand-text-primary w-24 flex-shrink-0">Status</label>
                  <div className="flex gap-2 flex-1">
                    <select
                      value={pendingStatus}
                      onChange={(e) => setPendingStatus(e.target.value as "ACTIVE" | "SUSPENDED")}
                      className="flex-1 px-3 py-2 border border-brand-brown/20 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-gold outline-none"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={store.isUpdatingStatus || pendingStatus === selectedUser.status}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5 ${
                        pendingStatus === "SUSPENDED"
                          ? "bg-rose-600 text-white hover:bg-rose-700"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {store.isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        pendingStatus === "SUSPENDED"
                          ? <Ban className="w-4 h-4" />
                          : <CheckCircle2 className="w-4 h-4" />
                      )}
                      {pendingStatus === "SUSPENDED" ? "Suspend" : "Activate"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-brand-brown/10 bg-white flex justify-end rounded-b-3xl">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2.5 bg-brand-brown text-white hover:bg-brand-gold transition-colors font-semibold rounded-xl text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
