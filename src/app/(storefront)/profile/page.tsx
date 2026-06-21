"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, Heart, Star, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders");
  const router = useRouter();
  
  const { user, isAuthenticated, logout, updateUser, addAddress, updateAddress, deleteAddress, toggleWishlist } = useAuthStore();
  const { addItem } = useCartStore();

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState({ label: "Home", street: "", city: "", postalCode: "", isDefault: false });

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone || "");
    }
  }, [user]);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-8 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-brand-brown text-white rounded-[2.5rem] p-8 mb-8 flex flex-col sm:flex-row items-center justify-between shadow-[0_20px_50px_rgba(46,25,14,0.1)] border border-brand-brown/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full mix-blend-multiply filter blur-3xl opacity-35"></div>
          
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6 relative z-10 font-sans">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 text-2xl font-black uppercase tracking-wide">
              {user.name.substring(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">{user.name}</h1>
              <p className="text-white/70 text-sm font-medium">{user.email}</p>
              <div className="mt-3 flex items-center space-x-2 bg-brand-gold/25 w-max px-3.5 py-1 rounded-full border border-brand-gold/30 mx-auto sm:mx-0">
                <Star className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                <span className="text-xs font-black uppercase tracking-wider text-brand-gold">Gold Member (2,450 pts)</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout} 
            className="mt-6 sm:mt-0 flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white text-white hover:text-brand-brown font-bold text-sm transition-all duration-300 rounded-full backdrop-blur-md border border-white/20 relative z-10 cursor-pointer shadow-md hover:shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgba(92,51,23,0.02)] border border-brand-brown/5 overflow-hidden sticky top-24 p-3">
              <nav className="flex flex-col gap-1 font-sans">
                {[
                  { id: "orders", label: "My Orders", icon: Package },
                  { id: "info", label: "Personal Info", icon: User },
                  { id: "addresses", label: "Saved Addresses", icon: MapPin },
                  { id: "wishlist", label: "Wishlist", icon: Heart },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center space-x-3 px-5 py-3.5 transition-all duration-300 font-bold text-sm text-left rounded-[1.25rem] cursor-pointer ${
                        isActive 
                          ? "bg-brand-brown text-white shadow-md" 
                          : "text-brand-text-secondary hover:bg-brand-brown/5 hover:text-brand-brown"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgba(92,51,23,0.02)] border border-brand-brown/5 min-h-[500px]">
              
              {activeTab === "orders" && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-brand-brown mb-6 tracking-tight">Recent Orders</h2>
                  
                  {user.orders.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-brand-brown/10 rounded-[2rem] bg-[#FDFBF7]/30">
                      <Package className="w-12 h-12 text-brand-brown/30 mx-auto mb-4" />
                      <p className="text-brand-text-secondary font-medium">You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {user.orders.map((order) => (
                        <div 
                          key={order.id} 
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="border border-brand-brown/15 rounded-[2rem] overflow-hidden cursor-pointer hover:shadow-lg hover:border-brand-gold/30 transition-all duration-300 group bg-[#FDFBF7]/40"
                        >
                          <div className="bg-brand-brown/5 p-4 flex justify-between items-center border-b border-brand-brown/10">
                            <div>
                              <p className="text-sm text-brand-text-secondary">Order <span className="font-bold text-brand-brown">#{order.id}</span></p>
                              <p className="text-sm text-brand-text-secondary">Placed on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="px-3.5 py-1 bg-green-100 text-green-800 font-black text-[10px] rounded-full uppercase tracking-wider">
                              {order.status}
                            </div>
                          </div>
                          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex space-x-4">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="relative w-16 h-16 bg-brand-light rounded-xl overflow-hidden border border-brand-brown/10">
                                  <Image src={item.image || "/premium_cookie.png"} fill alt={item.name} className="object-cover" />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-16 h-16 bg-brand-cream rounded-lg flex items-center justify-center font-bold text-brand-brown text-sm border border-brand-brown/10">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="font-bold text-xl text-brand-brown mb-2">₹{order.total.toFixed(2)}</p>
                              <span className="text-brand-gold group-hover:text-brand-brown font-bold text-sm transition-colors">Track Order →</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "info" && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-brown tracking-tight">Personal Information</h2>
                    {!isEditingInfo && (
                      <button onClick={() => setIsEditingInfo(true)} className="text-brand-gold hover:text-brand-brown flex items-center text-sm font-bold transition-colors cursor-pointer">
                        <Settings className="w-4 h-4 mr-1.5" /> Edit
                      </button>
                    )}
                  </div>
                  
                  {isEditingInfo ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateUser({ name: editName, phone: editPhone });
                        setIsEditingInfo(false);
                        toast.success("Profile updated successfully!");
                      }} 
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] uppercase tracking-widest font-black text-brand-text-secondary mb-2">Full Name</label>
                          <input 
                            type="text" 
                            required 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-[#FDFBF7] border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-widest font-black text-brand-text-secondary mb-2">Phone Number</label>
                          <input 
                            type="text" 
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full bg-[#FDFBF7] border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button type="button" onClick={() => setIsEditingInfo(false)} className="px-6 py-3 font-bold text-brand-brown bg-brand-brown/5 rounded-xl hover:bg-brand-brown/10 transition-colors cursor-pointer">
                          Cancel
                        </button>
                        <button type="submit" className="px-6 py-3 font-bold text-white bg-brand-brown rounded-xl hover:bg-brand-gold transition-colors shadow-md cursor-pointer">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-brand-text-secondary mb-1">Full Name</p>
                        <p className="font-extrabold text-brand-brown text-lg">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-brand-text-secondary mb-1">Email Address</p>
                        <p className="font-extrabold text-brand-brown text-lg">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-brand-text-secondary mb-1">Phone Number</p>
                        <p className="font-extrabold text-brand-brown text-lg">{user.phone || "Not Provided"}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-brand-brown mb-6 tracking-tight">Saved Addresses</h2>
                  
                  {isEditingAddress ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (editingAddressId) {
                          updateAddress(editingAddressId, addrForm);
                        } else {
                          addAddress(addrForm);
                        }
                        setIsEditingAddress(false);
                        toast.success("Address saved successfully!");
                      }} 
                      className="bg-[#FDFBF7] p-6 rounded-[2rem] border border-brand-brown/10 space-y-4 shadow-inner"
                    >
                      <h3 className="font-bold text-brand-brown text-lg mb-4">{editingAddressId ? "Edit Address" : "Add New Address"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-black text-brand-text-secondary mb-1">Label (e.g. Home, Work)</label>
                          <input type="text" required value={addrForm.label} onChange={e => setAddrForm({...addrForm, label: e.target.value})} className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-2 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-black text-brand-text-secondary mb-1">Street Address</label>
                          <input type="text" required value={addrForm.street} onChange={e => setAddrForm({...addrForm, street: e.target.value})} className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-2 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-black text-brand-text-secondary mb-1">City</label>
                          <input type="text" required value={addrForm.city} onChange={e => setAddrForm({...addrForm, city: e.target.value})} className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-2 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-black text-brand-text-secondary mb-1">Postal Code</label>
                          <input type="text" required value={addrForm.postalCode} onChange={e => setAddrForm({...addrForm, postalCode: e.target.value})} className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-2 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <input type="checkbox" id="isDefault" checked={addrForm.isDefault} onChange={e => setAddrForm({...addrForm, isDefault: e.target.checked})} className="w-4 h-4 text-brand-gold focus:ring-brand-gold rounded border-gray-300" />
                        <label htmlFor="isDefault" className="text-sm font-semibold text-brand-text-secondary">Set as default address</label>
                      </div>
                      <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => setIsEditingAddress(false)} className="px-5 py-2 font-bold text-brand-brown bg-white border border-brand-brown/10 rounded-xl hover:bg-brand-brown/5 transition-colors cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 font-bold text-white bg-brand-brown rounded-xl hover:bg-brand-gold transition-colors cursor-pointer">Save Address</button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.addresses?.map(addr => (
                        <div key={addr.id} className={`border-2 rounded-[2rem] p-6 relative bg-[#FDFBF7]/40 transition-all duration-300 ${addr.isDefault ? 'border-brand-brown shadow-sm' : 'border-brand-brown/10 hover:border-brand-gold/30 hover:shadow-sm'}`}>
                          {addr.isDefault && <div className="absolute top-4 right-4 px-2 py-0.5 bg-brand-brown text-white text-[10px] font-black rounded uppercase tracking-wider">Default</div>}
                          <h3 className="font-extrabold text-brand-brown mb-2 text-lg">{addr.label}</h3>
                          <p className="text-brand-text-secondary mb-6 text-sm leading-relaxed">{addr.street}<br />{addr.city}<br />{addr.postalCode}</p>
                          <div className="flex space-x-4 text-xs font-black uppercase tracking-wider">
                            <button onClick={() => { setAddrForm({ label: addr.label, street: addr.street, city: addr.city, postalCode: addr.postalCode, isDefault: addr.isDefault }); setEditingAddressId(addr.id); setIsEditingAddress(true); }} className="text-brand-gold hover:text-brand-brown transition-colors cursor-pointer">Edit</button>
                            <button onClick={() => { deleteAddress(addr.id); toast.success("Address deleted"); }} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">Delete</button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => { setAddrForm({ label: "", street: "", city: "", postalCode: "", isDefault: user.addresses?.length === 0 }); setEditingAddressId(null); setIsEditingAddress(true); }} className="border-2 border-dashed border-brand-brown/20 rounded-[2rem] p-6 flex flex-col items-center justify-center text-brand-text-secondary hover:text-brand-brown hover:bg-[#FDFBF7] transition-all duration-300 group min-h-[200px] cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-brand-brown/5 flex items-center justify-center mb-3 group-hover:bg-brand-gold/15 group-hover:text-brand-gold transition-all duration-300">
                          <span className="text-2xl leading-none font-bold">+</span>
                        </div>
                        <span className="font-bold text-sm">Add New Address</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "wishlist" && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-brand-brown mb-6 tracking-tight">My Wishlist</h2>
                  {(!user.wishlist || user.wishlist.length === 0) ? (
                    <div className="text-center py-16 border-2 border-dashed border-brand-brown/10 rounded-[2rem] bg-[#FDFBF7]/30">
                      <Heart className="w-12 h-12 text-brand-brown/30 mx-auto mb-4" />
                      <p className="text-brand-text-secondary font-medium">Your wishlist is empty.</p>
                      <button onClick={() => router.push("/shop")} className="mt-6 px-6 py-3 bg-brand-brown text-white font-bold rounded-full hover:bg-brand-gold transition-colors cursor-pointer shadow-md">Browse Shop</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {user.wishlist.map(item => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-brand-brown/15 rounded-[2rem] hover:shadow-lg hover:border-brand-gold/30 transition-all duration-300 relative bg-[#FDFBF7]/40">
                          <button onClick={() => { toggleWishlist(item); toast.success("Removed from wishlist"); }} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-brand-text-secondary hover:text-red-500 bg-white rounded-full shadow-sm hover:shadow transition-all duration-200 z-10 cursor-pointer">
                            <span className="text-xs font-bold leading-none block">✕</span>
                          </button>
                          <div className="relative w-20 h-20 bg-brand-light rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => router.push(`/product/${item.id}`)}>
                            <Image src={item.image || "/premium_cookie.png"} fill alt={item.name} className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-extrabold text-brand-brown line-clamp-1 cursor-pointer hover:text-brand-gold transition-colors pr-6 text-sm" onClick={() => router.push(`/product/${item.id}`)}>{item.name}</h4>
                            <p className="text-brand-gold font-bold mb-2 text-sm">₹{item.price.toFixed(2)}</p>
                            <button onClick={() => { addItem({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 }); toast.success("Moved to cart!"); }} className="text-[10px] font-black px-3.5 py-2 bg-brand-brown text-white rounded-full hover:bg-brand-gold transition-colors uppercase tracking-wider cursor-pointer">
                              Move to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
