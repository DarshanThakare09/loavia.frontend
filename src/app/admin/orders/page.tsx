"use client";

import { useState } from "react";
import { useAuthStore, Order } from "@/store/authStore";
import { Search, Eye, Trash2, X, Calendar, User, MapPin, CreditCard, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function AdminOrdersPage() {
  const { allOrders, updateOrderStatus, deleteOrder } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus);
    // Sync the details modal if it's currently showing the edited order
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleDelete = (orderId: string) => {
    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
      deleteOrder(orderId);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  // Filter orders
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerEmail || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "Shipped":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "Processing":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "Cancelled":
        return "text-rose-700 bg-rose-50 border-rose-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateStr;
    }
  };

  const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Orders</h1>
          <p className="text-brand-text-secondary mt-1">Monitor customer transactions and fulfill orders</p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-brand-brown/5 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by ID, name or email..."
            className="w-full pl-10 pr-4 py-2 border border-brand-brown/10 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {["All", ...statusOptions].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                selectedStatus === status
                  ? "bg-brand-brown text-white border-brand-brown"
                  : "bg-brand-light text-brand-text-secondary border-brand-brown/5 hover:bg-brand-brown/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-light border-b border-brand-brown/10">
                <th className="p-4 font-semibold text-brand-brown">Order ID</th>
                <th className="p-4 font-semibold text-brand-brown">Date</th>
                <th className="p-4 font-semibold text-brand-brown">Customer</th>
                <th className="p-4 font-semibold text-brand-brown">Items</th>
                <th className="p-4 font-semibold text-brand-brown">Total Amount</th>
                <th className="p-4 font-semibold text-brand-brown">Status</th>
                <th className="p-4 font-semibold text-brand-brown">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-brand-brown/5 hover:bg-brand-light/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-brown text-sm">
                    {order.id}
                  </td>
                  <td className="p-4 text-xs text-brand-text-secondary">
                    {formatDate(order.date)}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-brand-text-primary text-sm">{order.customerName}</span>
                      <span className="text-xs text-brand-text-secondary">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-brand-text-secondary">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
                  </td>
                  <td className="p-4 font-bold text-brand-text-primary text-sm">
                    ₹{order.total.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      {/* View Details */}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-brand-gold hover:text-brand-brown p-2 hover:bg-brand-gold/10 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* Status Selector */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs bg-brand-light border border-brand-brown/10 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Order"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-brand-text-secondary">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-light rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-brand-brown/10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-brand-brown/10 flex items-center justify-between bg-white rounded-t-3xl">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="font-serif font-bold text-2xl text-brand-brown">Order Details</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-brand-text-secondary mt-1 font-mono">ID: {selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-brand-light rounded-full transition-colors text-brand-text-secondary hover:text-brand-brown cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-brand-text-primary">
              {/* Customer Info */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 space-y-3 shadow-sm">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center">
                  <User className="w-4 h-4 mr-2 text-brand-gold" /> Customer Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-brand-text-secondary block">Full Name</span>
                    <span className="font-medium">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-brand-text-secondary block">Email Address</span>
                    <span className="font-medium">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-brand-brown/5">
                    <span className="text-xs text-brand-text-secondary block flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-brand-gold" /> Shipping Address
                    </span>
                    <span className="font-medium text-xs mt-0.5 block">{selectedOrder.shippingAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Info & Summary */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 space-y-4 shadow-sm">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-2 text-brand-gold" /> Items Purchased
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-brand-brown/5 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-lg bg-brand-light overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/premium_cookie.png"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-brand-text-secondary">₹{item.price} &times; {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-brown/10 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-4">
                  <div className="flex items-center space-x-2 text-xs text-brand-text-secondary">
                    <Calendar className="w-4 h-4 text-brand-gold" />
                    <span>Placed on {formatDate(selectedOrder.date)}</span>
                  </div>
                  <div className="w-full sm:w-auto text-right">
                    <span className="text-xs text-brand-text-secondary block">Grand Total</span>
                    <span className="text-2xl font-bold text-brand-brown font-serif">₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action status controller in modal */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-brand-gold" />
                  <span className="font-semibold text-sm">Status Management</span>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="w-full sm:w-auto bg-brand-light border border-brand-brown/10 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm font-semibold cursor-pointer"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
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
    </div>
  );
}
