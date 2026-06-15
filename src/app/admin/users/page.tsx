"use client";

import { useState } from "react";
import { useAuthStore, User } from "@/store/authStore";
import { Search, Eye, Trash2, X, User as UserIcon, MapPin, Heart, ShoppingBag, Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function AdminUsersPage() {
  const { allUsers, deleteUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDelete = (userId: string, name: string) => {
    if (confirm(`Are you sure you want to delete customer "${name}"? This will also delete all associated orders.`)) {
      deleteUser(userId);
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
      }
    }
  };

  // Calculate stats for a user
  const getUserStats = (user: User) => {
    const ordersCount = user.orders.length;
    // Only sum non-cancelled orders for spend
    const nonCancelledOrders = user.orders.filter(o => o.status !== "Cancelled");
    const totalSpent = nonCancelledOrders.reduce((sum, order) => sum + order.total, 0);
    return { ordersCount, totalSpent };
  };

  // Filter users
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone || "").includes(searchQuery);
    return matchesSearch;
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
        year: "numeric"
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Customers</h1>
          <p className="text-brand-text-secondary mt-1">Manage customer profiles and review accounts</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-brown/5 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-4 py-2 border border-brand-brown/10 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none text-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-light border-b border-brand-brown/10">
                <th className="p-4 font-semibold text-brand-brown">Customer</th>
                <th className="p-4 font-semibold text-brand-brown">Phone</th>
                <th className="p-4 font-semibold text-brand-brown">Orders Placed</th>
                <th className="p-4 font-semibold text-brand-brown">Total Spent</th>
                <th className="p-4 font-semibold text-brand-brown">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const { ordersCount, totalSpent } = getUserStats(user);
                return (
                  <tr key={user.id} className="border-b border-brand-brown/5 hover:bg-brand-light/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-brand-gold/15 text-brand-gold font-bold flex items-center justify-center text-sm border border-brand-gold/10">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-brand-text-primary text-sm">{user.name}</span>
                          <span className="text-xs text-brand-text-secondary">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-brand-text-secondary">
                      {user.phone || "N/A"}
                    </td>
                    <td className="p-4 text-sm text-brand-text-secondary">
                      {ordersCount} {ordersCount === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="p-4 font-bold text-brand-text-primary text-sm">
                      ₹{totalSpent.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-brand-gold hover:text-brand-brown p-2 hover:bg-brand-gold/10 rounded-lg transition-colors cursor-pointer"
                          title="View Profile Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Customer Account"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-brand-text-secondary">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-light rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-brand-brown/10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-brand-brown/10 flex items-center justify-between bg-white rounded-t-3xl bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-brand-gold text-brand-brown font-bold flex items-center justify-center text-lg shadow-inner">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl text-brand-brown">{selectedUser.name}</h3>
                  <p className="text-xs text-brand-text-secondary">Customer ID: {selectedUser.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-brand-light rounded-full transition-colors text-brand-text-secondary hover:text-brand-brown cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-brand-text-primary">
              
              {/* Contact Info */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 space-y-3 shadow-sm">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-brand-gold" /> Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-brand-text-secondary/60" />
                    <span className="font-medium">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-brand-text-secondary/60" />
                    <span className="font-medium">{selectedUser.phone || "No phone provided"}</span>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 space-y-3 shadow-sm">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-brand-gold" /> Saved Addresses
                </h4>
                <div className="space-y-3">
                  {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                    selectedUser.addresses.map((addr) => (
                      <div key={addr.id} className="p-3 bg-brand-light rounded-xl border border-brand-brown/5 text-xs flex justify-between items-start">
                        <div>
                          <span className="font-bold text-brand-brown uppercase tracking-wider block mb-1">
                            {addr.label} {addr.isDefault && <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 ml-1.5 font-bold uppercase">Default</span>}
                          </span>
                          <span className="text-brand-text-secondary block font-medium mt-1">
                            {addr.street}, {addr.city} - {addr.postalCode}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-brand-text-secondary text-center py-2">No addresses saved.</p>
                  )}
                </div>
              </div>

              {/* Orders History */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 space-y-3 shadow-sm">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-2 text-brand-gold" /> Order History
                </h4>
                <div className="space-y-3">
                  {selectedUser.orders && selectedUser.orders.length > 0 ? (
                    selectedUser.orders.map((ord) => (
                      <div key={ord.id} className="p-3 bg-brand-light rounded-xl border border-brand-brown/5 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-brand-brown text-sm block">{ord.id}</span>
                          <span className="text-brand-text-secondary font-medium block">Placed on {formatDate(ord.date)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-sm">₹{ord.total.toLocaleString()}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(ord.status)}`}>
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-brand-text-secondary text-center py-2">No orders placed yet.</p>
                  )}
                </div>
              </div>

              {/* Wishlist */}
              <div className="bg-white p-5 rounded-2xl border border-brand-brown/5 space-y-3 shadow-sm">
                <h4 className="font-bold text-brand-brown text-sm uppercase tracking-wider flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-brand-gold" /> Wishlist Items
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedUser.wishlist && selectedUser.wishlist.length > 0 ? (
                    selectedUser.wishlist.map((item) => (
                      <div key={item.id} className="p-3 bg-brand-light rounded-xl border border-brand-brown/5 flex items-center space-x-3 text-xs">
                        <div className="relative w-10 h-10 rounded bg-white overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/premium_cookie.png"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-brand-brown truncate">{item.name}</p>
                          <p className="text-brand-text-secondary font-medium mt-0.5">₹{item.price}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-brand-text-secondary text-center py-2 col-span-2">Wishlist is empty.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-brand-brown/10 bg-white flex justify-end rounded-b-3xl bg-white">
              <button
                onClick={() => setSelectedUser(null)}
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
