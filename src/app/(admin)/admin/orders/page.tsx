"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import { OrderListDTO, OrderStatus, ShipmentStatus } from "@/types/admin";
import {
  Search, Eye, X, Calendar, User, MapPin, CreditCard,
  ShoppingBag, AlertCircle, Loader2, Truck, RefreshCw, Gift
} from "lucide-react";
import Image from "next/image";

// ── Helpers ────────────────────────────────────────────────────────────────

const ALL_ORDER_STATUSES: OrderStatus[] = [
  "PENDING", "PAID", "PROCESSING", "PACKED",
  "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED",
];

const SHIPMENT_STATUSES: ShipmentStatus[] = [
  "PENDING", "IN_TRANSIT", "DELIVERED", "FAILED", "RETURNED",
];

const COURIER_OPTIONS = [
  "FedEx", "UPS", "DHL", "Delhivery", "BlueDart", "DTDC", "Xpressbees",
];

function getStatusColor(status: string) {
  switch (status) {
    case "DELIVERED": return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "SHIPPED": return "text-blue-700 bg-blue-50 border-blue-200";
    case "PROCESSING":
    case "PACKED":
    case "PAID": return "text-amber-700 bg-amber-50 border-amber-200";
    case "CANCELLED":
    case "RETURNED":
    case "REFUNDED": return "text-rose-700 bg-rose-50 border-rose-200";
    case "PENDING": return "text-slate-600 bg-slate-50 border-slate-200";
    default: return "text-gray-700 bg-gray-50 border-gray-200";
  }
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function formatRupees(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const store = useAdminOrderStore();

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderListDTO | null>(null);

  // Status update modal
  const [statusModal, setStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | "">("");

  // Shipment tracking modal
  const [trackingModal, setTrackingModal] = useState(false);
  const [trackingData, setTrackingData] = useState({
    trackingNumber: "",
    courierPartner: "",
    status: "IN_TRANSIT" as ShipmentStatus,
  });

  // ── Fetch on mount ─────────────────────────────────────────────────────
  const fetchPage = useCallback(
    (page: number) => store.fetchOrders(page, store.pageSize),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.pageSize]
  );

  useEffect(() => {
    store.fetchOrders(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filtered view (client-side search over loaded page) ────────────────
  const orders = Array.isArray(store.orders) ? store.orders : [];
  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.receiptNumber.toLowerCase().includes(q) ||
      order.customer?.name.toLowerCase().includes(q) ||
      order.customer?.email.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Handlers ───────────────────────────────────────────────────────────
  const openStatusModal = (order: OrderListDTO) => {
    setSelectedOrder(order);
    setPendingStatus(order.status);
    setStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !pendingStatus) return;
    try {
      await store.updateOrderStatus(selectedOrder.id, pendingStatus as OrderStatus);
      setStatusModal(false);
      setPendingStatus("");
      setSelectedOrder(prev =>
        prev ? { ...prev, status: pendingStatus as OrderStatus } : null
      );
    } catch {
      // Error already shown via toast in store
    }
  };

  const openTrackingModal = (order: OrderListDTO) => {
    setSelectedOrder(order);
    setTrackingData({
      trackingNumber: order.shipment?.trackingNumber ?? "",
      courierPartner: order.shipment?.courierPartner ?? "",
      status: (order.shipment?.status as ShipmentStatus) ?? "IN_TRANSIT",
    });
    setTrackingModal(true);
  };

  const handleTrackingUpdate = async () => {
    if (!selectedOrder) return;
    try {
      await store.updateShipmentTracking(selectedOrder.id, trackingData);
      setTrackingModal(false);
    } catch {
      // Error already shown via toast in store
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Orders</h1>
          <p className="text-brand-text-secondary mt-1">
            {store.pagination
              ? `${store.pagination.total.toLocaleString()} total orders`
              : "Manage and track customer orders"}
          </p>
        </div>
        <button
          onClick={() => store.fetchOrders(store.currentPage, store.pageSize)}
          disabled={store.isLoadingOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-brown/10 rounded-xl text-sm font-semibold text-brand-brown hover:bg-brand-light transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${store.isLoadingOrders ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {store.ordersError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Error loading orders</p>
            <p className="text-red-700 text-sm">{store.ordersError}</p>
            <button
              onClick={() => store.fetchOrders(store.currentPage, store.pageSize)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-2xl border border-brand-brown/5 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by ID, receipt, customer..."
            className="w-full pl-10 pr-4 py-2 border border-brand-brown/10 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["ALL", ...ALL_ORDER_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === s
                  ? "bg-brand-brown text-white shadow-sm"
                  : "bg-brand-light text-brand-text-secondary hover:bg-brand-gold/15 hover:text-brand-brown"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {store.isLoadingOrders && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gradient-to-r from-brand-light to-brand-gold/10 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!store.isLoadingOrders && filteredOrders.length === 0 && !store.ordersError && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-brand-gold/40 mx-auto mb-4" />
          <p className="text-brand-text-secondary text-lg font-semibold">No orders found</p>
          <p className="text-brand-text-secondary text-sm mt-1">
            {searchQuery || statusFilter !== "ALL"
              ? "Try adjusting your search or status filter"
              : "No orders have been placed yet"}
          </p>
        </div>
      )}

      {/* Orders Table */}
      {!store.isLoadingOrders && filteredOrders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-light border-b border-brand-brown/10">
                  <th className="p-4 font-semibold text-brand-brown text-sm">Receipt</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Date</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Customer</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Items</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Total</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Status</th>
                  <th className="p-4 font-semibold text-brand-brown text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-brand-brown/5 hover:bg-brand-light/40 transition-colors"
                  >
                    <td className="p-4 font-mono text-xs text-brand-brown font-semibold">
                      {order.receiptNumber || order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-4 text-xs text-brand-text-secondary">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-brand-text-primary text-sm">
                          {order.customer?.name || "—"}
                        </span>
                        <span className="text-xs text-brand-text-secondary">
                          {order.customer?.email || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-brand-text-secondary">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                    </td>
                    <td className="p-4 font-bold text-brand-text-primary text-sm">
                      {formatRupees(order.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-brand-gold hover:text-brand-brown p-1.5 hover:bg-brand-gold/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openStatusModal(order)}
                          disabled={store.isUpdatingStatus}
                          className="px-2.5 py-1 bg-brand-light text-brand-brown hover:bg-brand-gold/20 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                          title="Update Status"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => openTrackingModal(order)}
                          disabled={store.isUpdatingShipment}
                          className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Shipment Tracking"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!store.isLoadingOrders && store.pagination && store.pagination.totalPages > 1 && (
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
                  <span key={`ellipsis-${page}`} className="px-2 py-2 text-brand-text-secondary text-sm">…</span>
                )}
                <button
                  key={page}
                  onClick={() => fetchPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${store.currentPage === page
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

      {/* ── Order Details Modal ──────────────────────────────────────────── */}
      {selectedOrder && !statusModal && !trackingModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-light rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-brand-brown/10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-brand-brown/10 flex items-center justify-between bg-white rounded-t-3xl">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-serif font-bold text-2xl text-brand-brown">Order Details</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-brand-text-secondary mt-1 font-mono">
                  {selectedOrder.receiptNumber || selectedOrder.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-brand-light rounded-full transition-colors text-brand-text-secondary hover:text-brand-brown cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-brand-text-primary">
              {/* Customer */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 space-y-3 shadow-sm">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center">
                  <User className="w-4 h-4 mr-2 text-brand-gold" /> Customer Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-brand-text-secondary block">Full Name</span>
                    <span className="font-medium">{selectedOrder.customer?.name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-brand-text-secondary block">Email Address</span>
                    <span className="font-medium">{selectedOrder.customer?.email || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Hand-Written Gift Note */}
              {selectedOrder.customGiftNote && (
                <div className="bg-amber-50/60 p-5 rounded-2xl border border-brand-gold/25 space-y-3 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center">
                    <Gift className="w-4 h-4 mr-2 text-brand-gold animate-bounce" /> Hand-Written Gift Note
                  </h4>
                  <div className="bg-white p-4 rounded-xl border border-brand-brown/5 italic text-brand-brown font-serif text-base shadow-inner leading-relaxed">
                    "{selectedOrder.customGiftNote}"
                  </div>
                </div>
              )}

              {/* Shipment */}
              {selectedOrder.shipment && (
                <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 space-y-3 shadow-sm">
                  <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-brand-gold" /> Shipment Info
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-xs text-brand-text-secondary block">Status</span>
                      <span className="font-medium">{selectedOrder.shipment.status}</span>
                    </div>
                    <div>
                      <span className="text-xs text-brand-text-secondary block">Courier</span>
                      <span className="font-medium">{selectedOrder.shipment.courierPartner || "—"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-brand-text-secondary block">Tracking #</span>
                      <span className="font-medium font-mono">{selectedOrder.shipment.trackingNumber || "—"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 space-y-4 shadow-sm">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-2 text-brand-gold" /> Items Purchased
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-brand-brown/5 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-lg bg-brand-light overflow-hidden flex-shrink-0">
                          <Image
                            src={item.productImage || "/premium_cookie.png"}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{item.productName}</p>
                          <p className="text-xs text-brand-text-secondary">
                            {item.variantName} · {formatRupees(item.unitPrice)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold">{formatRupees(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-brand-brown/10 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                    <Calendar className="w-4 h-4 text-brand-gold" />
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-brand-text-secondary block">Grand Total</span>
                    <span className="text-2xl font-bold text-brand-brown font-serif">
                      {formatRupees(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-gold" />
                  <span className="font-semibold text-sm">Quick Actions</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openStatusModal(selectedOrder)}
                    className="px-4 py-2 bg-brand-brown text-white rounded-xl text-sm font-semibold hover:bg-brand-gold transition-colors"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => openTrackingModal(selectedOrder)}
                    className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                  >
                    <Truck className="w-4 h-4" />
                    Tracking
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-brand-brown/10 bg-white flex justify-end rounded-b-3xl">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-brand-brown text-white hover:bg-brand-gold transition-colors font-semibold rounded-xl text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Status Update Modal ──────────────────────────────────────────── */}
      {statusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-brand-brown/10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-brand-brown/10 flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-brand-brown">Update Order Status</h3>
              <button onClick={() => setStatusModal(false)} className="p-2 hover:bg-brand-light rounded-full transition-colors">
                <X className="w-5 h-5 text-brand-text-secondary" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-brand-text-secondary">
                Order: <span className="font-mono font-bold text-brand-brown">{selectedOrder.receiptNumber || selectedOrder.id.slice(0, 8)}</span>
              </p>
              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-2">New Status</label>
                <select
                  value={pendingStatus}
                  onChange={(e) => setPendingStatus(e.target.value as OrderStatus)}
                  className="w-full px-4 py-2.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm font-semibold bg-white"
                >
                  {ALL_ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-brand-brown/10 flex justify-end gap-3">
              <button
                onClick={() => setStatusModal(false)}
                className="px-5 py-2.5 border border-brand-brown/10 rounded-xl text-brand-brown font-semibold text-sm hover:bg-brand-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={store.isUpdatingStatus || !pendingStatus}
                className="px-5 py-2.5 bg-brand-brown text-white rounded-xl font-semibold text-sm hover:bg-brand-gold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {store.isUpdatingStatus && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Shipment Tracking Modal ──────────────────────────────────────── */}
      {trackingModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-brand-brown/10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-brand-brown/10 flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-brand-brown">Update Shipment Tracking</h3>
              <button onClick={() => setTrackingModal(false)} className="p-2 hover:bg-brand-light rounded-full transition-colors">
                <X className="w-5 h-5 text-brand-text-secondary" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-brand-text-secondary">
                Order: <span className="font-mono font-bold text-brand-brown">{selectedOrder.receiptNumber || selectedOrder.id.slice(0, 8)}</span>
              </p>
              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1">Courier Partner</label>
                <select
                  value={trackingData.courierPartner}
                  onChange={(e) => setTrackingData({ ...trackingData, courierPartner: e.target.value })}
                  className="w-full px-4 py-2.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm bg-white"
                >
                  <option value="">Select courier...</option>
                  {COURIER_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={trackingData.trackingNumber}
                  onChange={(e) => setTrackingData({ ...trackingData, trackingNumber: e.target.value })}
                  placeholder="e.g. DL1234567890IN"
                  className="w-full px-4 py-2.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1">Shipment Status</label>
                <select
                  value={trackingData.status}
                  onChange={(e) => setTrackingData({ ...trackingData, status: e.target.value as ShipmentStatus })}
                  className="w-full px-4 py-2.5 border border-brand-brown/20 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm bg-white"
                >
                  {SHIPMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-brand-brown/10 flex justify-end gap-3">
              <button
                onClick={() => setTrackingModal(false)}
                className="px-5 py-2.5 border border-brand-brown/10 rounded-xl text-brand-brown font-semibold text-sm hover:bg-brand-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTrackingUpdate}
                disabled={store.isUpdatingShipment}
                className="px-5 py-2.5 bg-brand-brown text-white rounded-xl font-semibold text-sm hover:bg-brand-gold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {store.isUpdatingShipment && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
