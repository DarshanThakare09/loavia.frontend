"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle, Package, Truck, Home, XCircle, Clock, AlertCircle,
  MapPin, CreditCard, ShoppingBag, ChevronRight, ArrowLeft, RefreshCw, Gift
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import {
  orderService,
  OrderDetail,
  PublicTrackingResponse,
  ORDER_STATUS_MAP,
  paiseToRupees,
} from "@/services/orderService";

// ─── Status Tracker Steps ─────────────────────────────────────────────────────

const TRACKER_STEPS = [
  { label: "Confirmed",  icon: Package },
  { label: "Preparing",  icon: ShoppingBag },
  { label: "Shipped",    icon: Truck },
  { label: "Delivered",  icon: Home },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function OrderDetailSkeleton() {
  return (
    <div className="bg-brand-light min-h-screen pt-10 pb-24 animate-pulse">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-6 w-32 bg-brand-brown/10 rounded-full mb-8" />
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-brown/5 p-8 space-y-8">
          <div className="h-8 w-64 bg-brand-brown/10 rounded-xl" />
          <div className="h-4 w-48 bg-brand-brown/10 rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            {[0,1,2].map(i => <div key={i} className="h-16 bg-brand-brown/10 rounded-2xl" />)}
          </div>
          <div className="space-y-4">
            {[0,1,2].map(i => <div key={i} className="h-20 bg-brand-brown/10 rounded-2xl" />)}
          </div>
          <div className="h-40 bg-brand-brown/10 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Guest Tracking View ──────────────────────────────────────────────────────

function GuestTrackingView({ tracking, orderId }: { tracking: PublicTrackingResponse; orderId: string }) {
  const statusInfo = ORDER_STATUS_MAP[tracking.orderStatus] || ORDER_STATUS_MAP["PENDING"];
  const currentStep = statusInfo.step;

  return (
    <div className="bg-brand-light min-h-screen pt-10 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/shop" className="inline-flex items-center space-x-2 text-brand-brown/60 hover:text-brand-brown font-semibold text-sm mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Continue Shopping</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-brown/5">
          {/* Header */}
          <div className="bg-brand-brown text-white p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="w-8 h-8 text-brand-gold" />
                <h1 className="text-2xl font-serif font-bold">Order Placed!</h1>
              </div>
              <p className="text-white/70 text-sm font-medium">Receipt: <span className="text-white font-bold">{tracking.receiptNumber}</span></p>
              <div className={`inline-flex items-center mt-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${statusInfo.bgColor} ${statusInfo.color}`}>
                {statusInfo.label}
              </div>
            </div>
          </div>

          {/* Status Tracker */}
          {currentStep >= 0 && (
            <div className="p-8 border-b border-brand-brown/5">
              <h3 className="font-bold text-brand-brown mb-6">Order Status</h3>
              <div className="flex justify-between items-start relative z-0">
                <div className="absolute left-6 right-6 top-6 h-1 bg-brand-brown/10 -z-10" />
                <div className="absolute left-6 right-6 top-6 h-1 -z-10">
                  <div className="h-full bg-brand-gold transition-all duration-700" style={{ width: `${Math.min(100, (currentStep / 3) * 100)}%` }} />
                </div>
                {TRACKER_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= currentStep;
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-300 ${done ? "bg-brand-brown text-white" : "bg-brand-cream text-brand-text-secondary"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold mt-2 ${done ? "text-brand-brown" : "text-brand-text-secondary"}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tracking Events */}
          {tracking.events && tracking.events.length > 0 && (
            <div className="p-8 border-b border-brand-brown/5">
              <h3 className="font-bold text-brand-brown mb-4 flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Tracking Updates</span>
              </h3>
              {tracking.trackingNumber && (
                <p className="text-sm text-brand-text-secondary mb-4">
                  Courier: <span className="font-bold text-brand-brown">{tracking.courierPartner}</span>
                  {" · "}Tracking #: <span className="font-bold text-brand-brown">{tracking.trackingNumber}</span>
                </p>
              )}
              <div className="space-y-4">
                {tracking.events.map((event, i) => (
                  <div key={event.id} className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 ${i === 0 ? "bg-brand-gold border-brand-gold" : "bg-brand-cream border-brand-brown/20"} mt-1`} />
                      {i < tracking.events.length - 1 && <div className="w-px flex-1 bg-brand-brown/10 mt-1 min-h-[1.5rem]" />}
                    </div>
                    <div className="pb-4">
                      <p className="font-semibold text-brand-brown text-sm">{event.description}</p>
                      {event.location && <p className="text-xs text-brand-text-secondary mt-0.5">{event.location}</p>}
                      <p className="text-xs text-brand-text-secondary/70 mt-1">
                        {new Date(event.timestamp).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Login nudge */}
          <div className="p-8 bg-brand-cream/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-brand-brown">Want full order details?</p>
                <p className="text-sm text-brand-text-secondary">Log in to see items, pricing, and manage your order.</p>
              </div>
              <Link href={`/auth?redirect=/orders/${orderId}`} className="px-6 py-3 bg-brand-brown text-white font-bold rounded-full hover:bg-brand-gold transition-colors shadow-md text-sm whitespace-nowrap">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, isHydrating } = useAuthStore();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [publicTracking, setPublicTracking] = useState<PublicTrackingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    if (isAuthenticated) {
      try {
        const data = await orderService.getOrderById(id as string);
        setOrder(data);
      } catch (err: any) {
        const status = err.response?.status;
        if (status === 404) {
          toast.error("Order not found");
          router.push("/profile");
        } else if (status === 403) {
          toast.error("You do not have access to this order");
          router.push("/profile");
        } else {
          setError("Failed to load order details. Please try again.");
        }
      }
    } else {
      // Guest: attempt public tracking
      try {
        const tracking = await orderService.getPublicTracking(id as string);
        setPublicTracking(tracking);
      } catch {
        setError("guest-no-tracking");
      }
    }
    setIsLoading(false);
  }, [id, isAuthenticated, router]);

  useEffect(() => {
    if (!isHydrating) {
      loadOrder();
    }
  }, [isHydrating, loadOrder]);

  const handleCancel = async () => {
    if (!order) return;
    setIsCancelling(true);
    try {
      await orderService.cancelOrder(order.id);
      toast.success("Order cancelled successfully");
      loadOrder();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  // Loading state
  if (isLoading || isHydrating) return <OrderDetailSkeleton />;

  // Guest with no tracking
  if (!isAuthenticated && !publicTracking) {
    return (
      <div className="bg-brand-light min-h-screen pt-10 pb-24 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full mx-4 text-center border border-brand-brown/5">
          <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-brand-brown/50" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-brand-brown mb-3">Order Confirmed</h1>
          <p className="text-brand-text-secondary mb-8 text-sm">Your order is being processed. Log in to view full details and track your order.</p>
          <div className="flex flex-col gap-3">
            <Link href={`/auth?redirect=/orders/${id}`} className="px-6 py-3 bg-brand-brown text-white font-bold rounded-full hover:bg-brand-gold transition-colors shadow-md">
              Log In to Track Order
            </Link>
            <Link href="/shop" className="px-6 py-3 font-bold text-brand-brown border-2 border-brand-brown/20 rounded-full hover:bg-brand-brown/5 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Guest with tracking data
  if (!isAuthenticated && publicTracking) {
    return <GuestTrackingView tracking={publicTracking} orderId={id as string} />;
  }

  // Error state (authenticated)
  if (error) {
    return (
      <div className="bg-brand-light min-h-screen pt-10 pb-24 flex items-center justify-center">
        <div className="text-center p-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-brand-brown font-bold text-lg mb-2">Something went wrong</p>
          <p className="text-brand-text-secondary text-sm mb-6">{error}</p>
          <button onClick={loadOrder} className="px-6 py-3 bg-brand-brown text-white font-bold rounded-full hover:bg-brand-gold transition-colors flex items-center space-x-2 mx-auto cursor-pointer">
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusInfo = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP["PENDING"];
  const currentStep = statusInfo.step;
  const canCancel = order.status === "PENDING";

  return (
    <div className="bg-brand-light min-h-screen pt-10 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <Link href="/profile" className="inline-flex items-center space-x-2 text-brand-brown/60 hover:text-brand-brown font-semibold text-sm mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-brown/5">

          {/* ── Header ── */}
          <div className="bg-brand-brown text-white p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="w-7 h-7 text-brand-gold flex-shrink-0" />
                    <h1 className="text-2xl font-serif font-bold">Order Details</h1>
                  </div>
                  <p className="text-white/70 text-sm">Receipt: <span className="text-white font-bold">{order.receiptNumber}</span></p>
                  <p className="text-white/50 text-xs mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className={`self-start sm:self-auto inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${statusInfo.bgColor} ${statusInfo.color}`}>
                  {statusInfo.label}
                </div>
              </div>
            </div>
          </div>

          {/* ── Status Tracker ── */}
          {currentStep >= 0 && (
            <div className="p-8 border-b border-brand-brown/5">
              <h3 className="font-bold text-brand-brown mb-6 text-sm uppercase tracking-wider">Order Progress</h3>
              <div className="flex justify-between items-start relative">
                <div className="absolute left-6 right-6 top-6 h-1 bg-brand-brown/10" />
                <div className="absolute left-6 right-6 top-6 h-1">
                  <div className="h-full bg-gradient-to-r from-brand-brown to-brand-gold transition-all duration-700 rounded-full" style={{ width: `${Math.min(100, (currentStep / 3) * 100)}%` }} />
                </div>
                {TRACKER_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= currentStep;
                  return (
                    <div key={i} className="flex flex-col items-center relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-300 ${done ? "bg-brand-brown text-white scale-110" : "bg-brand-cream text-brand-text-secondary"}`}>
                        {done && i === currentStep ? <Icon className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs font-bold mt-2 text-center ${done ? "text-brand-brown" : "text-brand-text-secondary"}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cancelled/Refunded Banner */}
          {(order.status === "CANCELLED" || order.status === "REFUNDED") && (
            <div className="mx-8 mt-6 flex items-center space-x-3 bg-red-50 border border-red-100 rounded-2xl p-4">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-semibold text-sm">
                This order was {order.status.toLowerCase()}.{order.status === "REFUNDED" ? " Your refund has been processed." : ""}
              </p>
            </div>
          )}

          {/* ── Order Items ── */}
          <div className="p-8 border-b border-brand-brown/5">
            <h3 className="font-bold text-brand-brown mb-5 flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Items Ordered ({order.items.length})</span>
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-brand-cream/30 rounded-2xl border border-brand-brown/5">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-brand-light border border-brand-brown/10">
                    <Image
                      src={item.productImage || "/premium_cookie.png"}
                      fill
                      alt={item.productName}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-brown text-sm line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-brand-text-secondary">{item.variantName} · Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-brand-brown text-sm">₹{paiseToRupees(item.totalPrice)}</p>
                    <p className="text-xs text-brand-text-secondary">₹{paiseToRupees(item.unitPrice)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Pricing Breakdown ── */}
          <div className="p-8 border-b border-brand-brown/5">
            <h3 className="font-bold text-brand-brown mb-5 flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Pricing Summary</span>
            </h3>
            <div className="bg-brand-cream/30 rounded-2xl p-6 border border-brand-brown/5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary font-medium">Subtotal</span>
                <span className="font-bold text-brand-brown">₹{paiseToRupees(order.subtotalAmount)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">
                    Discount {order.couponCode && <span className="text-[10px] bg-green-100 px-2 py-0.5 rounded-full font-black uppercase ml-1">{order.couponCode}</span>}
                  </span>
                  <span className="font-bold text-green-600">− ₹{paiseToRupees(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary font-medium">GST (18%)</span>
                <span className="font-bold text-brand-brown">₹{paiseToRupees(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary font-medium">Shipping</span>
                <span className="font-bold text-brand-brown">
                  {order.shippingFee === 0 ? <span className="text-green-600">Free</span> : `₹${paiseToRupees(order.shippingFee)}`}
                </span>
              </div>
              <div className="border-t border-brand-brown/10 pt-3 flex justify-between">
                <span className="font-black text-brand-brown text-base">Total</span>
                <span className="font-black text-brand-brown text-lg">₹{paiseToRupees(order.totalAmount)}</span>
              </div>
            </div>

            {/* Payment Info */}
            {order.payment && (
              <div className="mt-4 flex items-center justify-between text-xs text-brand-text-secondary bg-brand-cream/20 rounded-xl px-4 py-3 border border-brand-brown/5">
                <span>
                  Payment: <span className="font-bold text-brand-brown capitalize">{order.payment.method || "Online"}</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full font-black uppercase text-[10px] ${
                  order.payment.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                  order.payment.status === "REFUNDED" ? "bg-gray-100 text-gray-600" :
                  order.payment.status === "FAILED" ? "bg-red-100 text-red-600" :
                  "bg-amber-100 text-amber-700"
                }`}>{order.payment.status}</span>
              </div>
            )}
          </div>

          {/* ── Shipping Address ── */}
          <div className="p-8 border-b border-brand-brown/5">
            <h3 className="font-bold text-brand-brown mb-4 flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Delivery Address</span>
            </h3>
            <div className="bg-brand-cream/30 rounded-2xl p-5 border border-brand-brown/5">
              {order.shippingAddress.recipientName && (
                <p className="font-bold text-brand-brown text-sm mb-1">{order.shippingAddress.recipientName}</p>
              )}
              <p className="text-brand-text-secondary text-sm leading-relaxed">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}<br />
                {order.shippingAddress.postalCode}
              </p>
              {order.shippingAddress.phone && (
                <p className="text-brand-text-secondary text-sm mt-2">📞 {order.shippingAddress.phone}</p>
              )}
            </div>
          </div>

          {/* ── Gift Note (If present) ── */}
          {order.customGiftNote && (
            <div className="p-8 border-b border-brand-brown/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="font-bold text-brand-brown mb-4 flex items-center space-x-2">
                <Gift className="w-4 h-4 text-brand-gold animate-pulse" />
                <span>Hand-Written Gift Note</span>
              </h3>
              <div className="bg-brand-cream/30 rounded-2xl p-5 border border-brand-brown/5">
                <p className="italic text-brand-brown font-serif text-base leading-relaxed">
                  "{order.customGiftNote}"
                </p>
              </div>
            </div>
          )}

          {/* ── Shipment Tracking ── */}
          {order.shipment && (
            <div className="p-8 border-b border-brand-brown/5">
              <h3 className="font-bold text-brand-brown mb-4 flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Shipment Tracking</span>
              </h3>

              {order.shipment.trackingNumber ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 bg-brand-cream/30 rounded-2xl p-4 border border-brand-brown/5">
                    <div className="flex-1">
                      <p className="text-xs text-brand-text-secondary font-medium uppercase tracking-wider mb-1">Courier Partner</p>
                      <p className="font-bold text-brand-brown">{order.shipment.courierPartner || "—"}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-brand-text-secondary font-medium uppercase tracking-wider mb-1">Tracking Number</p>
                      <p className="font-bold text-brand-brown font-mono text-sm">{order.shipment.trackingNumber}</p>
                    </div>
                  </div>

                  {order.shipment.events.length > 0 && (
                    <div className="space-y-0">
                      {order.shipment.events.map((event, i) => (
                        <div key={event.id} className="flex space-x-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full border-2 mt-1.5 flex-shrink-0 ${i === 0 ? "bg-brand-gold border-brand-gold" : "bg-white border-brand-brown/20"}`} />
                            {i < order.shipment!.events.length - 1 && <div className="w-px flex-1 bg-brand-brown/10 mt-1 min-h-[1.5rem]" />}
                          </div>
                          <div className="pb-5">
                            <p className="font-semibold text-brand-brown text-sm">{event.description}</p>
                            {event.location && <p className="text-xs text-brand-text-secondary mt-0.5">📍 {event.location}</p>}
                            <p className="text-xs text-brand-text-secondary/70 mt-1">
                              {new Date(event.timestamp).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-3 text-brand-text-secondary bg-brand-cream/30 rounded-2xl p-4 border border-brand-brown/5">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">Your order is being prepared. Tracking details will appear here once dispatched.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Actions ── */}
          <div className="p-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link
              href="/shop"
              className="w-full sm:w-auto text-center px-8 py-3.5 font-bold text-brand-brown border-2 border-brand-brown/20 rounded-full hover:bg-brand-brown/5 transition-colors text-sm"
            >
              Continue Shopping
            </Link>
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 font-bold text-red-600 border-2 border-red-200 rounded-full hover:bg-red-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Order</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
