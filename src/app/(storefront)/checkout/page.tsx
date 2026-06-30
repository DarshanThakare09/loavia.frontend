"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, CreditCard, Truck, MapPin, Tag, ArrowLeft, Gift } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { checkoutService, CheckoutValidateResponse, CheckoutValidatePayload, PlaceOrderPayload } from "@/services/checkoutService";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { items, clearCart, appliedPromoCode, setAppliedPromoCode, clearAppliedPromoCode } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  
  const [promoInput, setPromoInput] = useState("");
  const [mounted, setMounted] = useState(false);

  // Address form fields state
  const [addressForm, setAddressForm] = useState({
    recipientName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  const [customGiftNote, setCustomGiftNote] = useState("");
  const hasCustomBox = items.some(item => item.isCustomBox);

  // Backend calculations state
  const [calculations, setCalculations] = useState<CheckoutValidateResponse | null>(null);
  const [isLoadingValidate, setIsLoadingValidate] = useState(false);

  // Order Placement & Razorpay processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setPromoInput(appliedPromoCode || "");
  }, [appliedPromoCode]);

  // Sync address form with user details on mount/auth change
  useEffect(() => {
    if (mounted && isAuthenticated && user) {
      const defaultAddr = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
      setAddressForm({
        recipientName: user.name || "",
        street: defaultAddr?.street || "",
        city: defaultAddr?.city || "",
        state: defaultAddr?.state || "",
        postalCode: defaultAddr?.postalCode || "",
        phone: user.phone || defaultAddr?.phone || "",
        email: user.email || "",
      });
    }
  }, [mounted, isAuthenticated, user]);

  // Load calculations from backend API
  const loadCalculations = async (coupon?: string) => {
    if (items.length === 0) return;
    setIsLoadingValidate(true);
    try {
      const payload: CheckoutValidatePayload = {};
      if (coupon) {
        payload.couponCode = coupon;
      }
      if (!isAuthenticated) {
        payload.items = items.map(item => ({
          variantId: item.variantId || item.id,
          quantity: item.quantity,
          isCustomBox: item.isCustomBox,
          customBoxSelections: item.customBoxSelections
        }));
      }
      const data = await checkoutService.validateCheckout(payload);
      setCalculations(data);
    } catch (err: any) {
      console.error("Failed to load calculations", err);
      // If coupon validation failed, reset to base calculations
      if (coupon) {
        clearAppliedPromoCode();
        setPromoInput("");
        toast.error(err.response?.data?.message || err.message || "Failed to validate coupon");
        loadCalculations();
      }
    } finally {
      setIsLoadingValidate(false);
    }
  };

  useEffect(() => {
    if (mounted && items.length > 0) {
      loadCalculations(appliedPromoCode || undefined);
    }
  }, [mounted, items, isAuthenticated]);

  const handleSelectSavedAddress = (addrId: string) => {
    const addr = user?.addresses?.find(a => a.id === addrId);
    if (addr) {
      setAddressForm({
        ...addressForm,
        recipientName: addr.recipientName || user?.name || "",
        street: addr.street || "",
        city: addr.city || "",
        state: addr.state || "",
        postalCode: addr.postalCode || "",
        phone: addr.phone || user?.phone || "",
      });
      toast.info(`Loaded address: "${addr.label}"`);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    
    setIsLoadingValidate(true);
    try {
      const payload: CheckoutValidatePayload = {
        couponCode: promoInput.trim().toUpperCase(),
      };
      if (!isAuthenticated) {
        payload.items = items.map(item => ({
          variantId: item.variantId || item.id,
          quantity: item.quantity,
          isCustomBox: item.isCustomBox,
          customBoxSelections: item.customBoxSelections
        }));
      }
      const data = await checkoutService.validateCheckout(payload);
      setCalculations(data);
      setAppliedPromoCode(promoInput.trim().toUpperCase());
      toast.success(`Coupon "${promoInput.trim().toUpperCase()}" applied successfully.`);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to validate coupon";
      toast.error(msg);
      loadCalculations();
    } finally {
      setIsLoadingValidate(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setPromoInput("");
    clearAppliedPromoCode();
    await loadCalculations();
    toast.success("Coupon removed.");
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!addressForm.recipientName.trim()) {
        toast.error("Recipient Name is required");
        return;
      }
      if (!addressForm.street.trim()) {
        toast.error("Street Address is required");
        return;
      }
      if (!addressForm.city.trim()) {
        toast.error("City is required");
        return;
      }
      if (!addressForm.state.trim()) {
        toast.error("State is required");
        return;
      }
      if (!addressForm.postalCode.trim()) {
        toast.error("Postal Code is required");
        return;
      }
      if (!addressForm.phone.trim()) {
        toast.error("Phone Number is required");
        return;
      }
      if (!isAuthenticated && !addressForm.email.trim()) {
        toast.error("Email is required for guest checkout");
        return;
      }
    }
    setStep(step + 1);
  };

  // Helper to load Razorpay SDK dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setLoaderMessage("Reserving items and generating secure payment token...");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your network connection.");
        setIsProcessing(false);
        return;
      }

      const orderPayload: PlaceOrderPayload = {
        shippingAddress: {
          recipientName: addressForm.recipientName.trim(),
          street: addressForm.street.trim(),
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          postalCode: addressForm.postalCode.trim(),
          country: "India",
          phone: addressForm.phone.trim(),
          email: isAuthenticated ? user?.email : addressForm.email.trim(),
        },
        couponCode: appliedPromoCode || undefined,
        customGiftNote: hasCustomBox && customGiftNote.trim() ? customGiftNote.trim() : undefined,
      };

      if (!isAuthenticated) {
        orderPayload.items = items.map(item => ({
          variantId: item.variantId || item.id,
          quantity: item.quantity,
          isCustomBox: item.isCustomBox,
          customBoxSelections: item.customBoxSelections
        }));
      }

      const orderData = await checkoutService.placeOrder(orderPayload);
      
      setLoaderMessage("Redirecting to payment gateway...");

      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.totalAmount,
        currency: "INR",
        name: "LOAVIA Premium Cookies",
        description: `Payment for Order ${orderData.receiptNumber}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          setIsProcessing(true);
          setLoaderMessage("Verifying signature and confirming order...");
          try {
            await checkoutService.verifyPayment({
              orderId: orderData.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              method: response.method || "CARD",
            });

            await clearCart();
            clearAppliedPromoCode();
            toast.success("Order placed and payment verified successfully!");
            router.push(`/orders/${orderData.id}`);
          } catch (verifyErr: any) {
            const errMsg = verifyErr.response?.data?.message || verifyErr.message || "Payment verification failed";
            toast.error(errMsg);
            router.push(`/orders/${orderData.id}`);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: addressForm.recipientName,
          email: isAuthenticated ? user?.email : addressForm.email,
          contact: addressForm.phone,
        },
        theme: {
          color: "#5C3317",
        },
        modal: {
          ondismiss: function () {
            toast.warning("Payment checkout closed. Order saved as PENDING.");
            router.push(`/orders/${orderData.id}`);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to place order";
      toast.error(errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-brand-cream min-h-screen pt-24 pb-24 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-serif font-bold text-brand-brown mb-4">Your cart is empty</h2>
        <p className="text-brand-text-secondary mb-8">Add some premium cookies to your cart to begin checkout.</p>
        <button onClick={() => router.push("/shop")} className="px-8 py-4 font-bold text-white bg-brand-brown rounded-full hover:bg-brand-gold transition-colors shadow-md">
          Shop Our Collection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen pt-8 pb-24">
      {/* Dynamic backdrop loader during Razorpay/API calls */}
      {isProcessing && (
        <div className="fixed inset-0 bg-brand-brown/70 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 border-4 border-brand-cream border-t-brand-gold rounded-full animate-spin mb-6"></div>
          <p className="text-xl font-serif font-bold text-brand-cream tracking-wide">{loaderMessage}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Checkout Flow */}
          <div className="w-full lg:w-2/3">
            
            {/* Steps Progress */}
            <div className="flex items-center justify-between mb-8 relative z-0">
              <div className="absolute left-[1.25rem] right-[1.25rem] top-[1.25rem] h-1 bg-brand-brown/20 -z-10 transform -translate-y-1/2"></div>
              <div className="absolute left-[1.25rem] right-[1.25rem] top-[1.25rem] h-1 -z-10 transform -translate-y-1/2">
                <div className="h-full bg-brand-brown transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
              </div>
              
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-300 ${step >= 1 ? "bg-brand-brown" : "bg-brand-brown/20 text-brand-brown"}`}>1</div>
                <span className="text-xs font-bold mt-2 text-brand-brown">Address</span>
              </div>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${step >= 2 ? "bg-brand-brown text-white" : "bg-white border-2 border-brand-brown/20 text-brand-brown"}`}>2</div>
                <span className="text-xs font-bold mt-2 text-brand-text-secondary">Delivery</span>
              </div>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${step >= 3 ? "bg-brand-brown text-white" : "bg-white border-2 border-brand-brown/20 text-brand-brown"}`}>3</div>
                <span className="text-xs font-bold mt-2 text-brand-text-secondary">Payment</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-brown/5">
              
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-bold text-brand-brown mb-6 flex items-center"><MapPin className="w-6 h-6 mr-2 text-brand-gold" /> Shipping Address</h2>
                  
                  {/* Option to load saved address for authenticated users */}
                  {isAuthenticated && user?.addresses && user.addresses.length > 0 && (
                    <div className="mb-8 p-4 bg-brand-light/40 border border-brand-brown/10 rounded-2xl">
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Select a Saved Address</label>
                      <select 
                        onChange={(e) => handleSelectSavedAddress(e.target.value)}
                        className="w-full bg-white border border-brand-brown/10 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown focus:border-brand-gold shadow-sm transition-all duration-300"
                        defaultValue=""
                      >
                        <option value="" disabled>-- Use a saved address --</option>
                        {user.addresses.map((addr) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.label} ({addr.recipientName || user.name} - {addr.street}, {addr.city})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Recipient Name</label>
                      <input 
                        type="text" 
                        value={addressForm.recipientName} 
                        onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                        placeholder="Full Name" 
                        className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Street Address</label>
                      <input 
                        type="text" 
                        value={addressForm.street} 
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        placeholder="House / Flat No., Apartment, Area" 
                        className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">City</label>
                      <input 
                        type="text" 
                        value={addressForm.city} 
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        placeholder="City" 
                        className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">State</label>
                      <input 
                        type="text" 
                        value={addressForm.state} 
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        placeholder="State" 
                        className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Postal Code</label>
                      <input 
                        type="text" 
                        value={addressForm.postalCode} 
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        placeholder="PIN Code" 
                        className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={addressForm.phone} 
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        placeholder="10-digit Phone" 
                        className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" 
                      />
                    </div>
                    
                    {!isAuthenticated && (
                      <div className="md:col-span-2">
                        <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Email Address (Required for Guest Checkout)</label>
                        <input 
                          type="email" 
                          value={addressForm.email} 
                          onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                          placeholder="your-email@example.com" 
                          className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" 
                        />
                      </div>
                    )}
                  </div>
                  
                  {!isAuthenticated && (
                    <p className="text-xs text-brand-text-secondary mb-4 flex items-center justify-between border-t border-brand-brown/5 pt-4">
                      <span>Already have an account?</span>
                      <button onClick={() => router.push("/auth?redirect=/checkout")} className="text-brand-gold font-bold hover:underline">
                        Log In
                      </button>
                    </p>
                  )}

                  <button onClick={handleNextStep} className="w-full flex items-center justify-center space-x-2 px-8 py-4 font-bold text-white bg-brand-brown rounded-xl hover:bg-brand-gold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-8 cursor-pointer">
                    <span>Continue to Delivery</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-bold text-brand-brown mb-6 flex items-center"><Truck className="w-6 h-6 mr-2 text-brand-gold" /> Delivery Method</h2>
                  <div className="space-y-4 mb-8">
                    
                    <label className="flex items-center p-4 border-2 border-brand-gold bg-brand-gold/5 rounded-2xl shadow-sm transition-all duration-300">
                      <input type="radio" name="delivery" defaultChecked className="w-5 h-5 text-brand-gold focus:ring-brand-gold" />
                      <div className="ml-4 flex-1">
                        <span className="block font-bold text-brand-brown text-lg">Standard Delivery</span>
                        <span className="block text-sm text-brand-text-secondary">3-5 Business Days</span>
                      </div>
                      <span className="font-bold text-brand-brown">
                        {calculations && calculations.shippingFee === 0 ? "Free" : `₹${calculations ? (calculations.shippingFee / 100).toFixed(2) : "100.00"}`}
                      </span>
                    </label>

                    {calculations && calculations.shippingFee > 0 && (
                      <p className="text-xs text-brand-text-secondary italic">
                        Tip: Add products worth more than ₹999.00 to unlock Free Shipping!
                      </p>
                    )}

                  </div>

                  {hasCustomBox && (
                    <div className="mb-8 p-6 bg-brand-light/30 border border-brand-gold/15 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <h3 className="text-sm font-bold text-brand-brown mb-2 flex items-center">
                        <Gift className="w-4 h-4 mr-2 text-brand-gold" /> Add a Hand-Written Note
                      </h3>
                      <p className="text-xs text-brand-text-secondary mb-4 leading-relaxed font-light">
                        Since your order contains a customized gift box, you can request a complimentary hand-written message to be included in the box.
                      </p>
                      <textarea
                        value={customGiftNote}
                        onChange={(e) => setCustomGiftNote(e.target.value)}
                        placeholder="Write your personal message here (e.g. 'Dear Mom, Happy Birthday! Love, Rahul.')"
                        rows={3}
                        maxLength={250}
                        className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300 placeholder:text-brand-text-secondary/40 text-sm resize-none"
                      />
                      <div className="text-right text-[10px] text-brand-text-secondary/70 mt-1">
                        {customGiftNote.length}/250 characters
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="w-1/3 px-8 py-4 font-bold text-brand-brown bg-brand-light rounded-xl hover:bg-brand-brown/10 transition-colors cursor-pointer">Back</button>
                    <button onClick={handleNextStep} className="w-2/3 flex items-center justify-center space-x-2 px-8 py-4 font-bold text-white bg-brand-brown rounded-xl hover:bg-brand-gold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
                      <span>Continue to Payment</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center py-6">
                  <h2 className="text-2xl font-bold text-brand-brown mb-6 flex items-center justify-center"><CreditCard className="w-6 h-6 mr-2 text-brand-gold" /> Secure Payment Gateway</h2>
                  
                  <p className="text-brand-text-secondary max-w-md mx-auto mb-8 font-light">
                    LOAVIA processes payments securely via **Razorpay**. Once you proceed, a payment checkout interface will load where you can pay using UPI, NetBanking, Card, or Wallet.
                  </p>

                  <div className="p-6 bg-brand-light/40 border border-brand-brown/10 rounded-2xl text-left max-w-md mx-auto mb-10 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-text-secondary">Recipient:</span>
                      <span className="font-bold text-brand-brown">{addressForm.recipientName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-text-secondary">Phone:</span>
                      <span className="font-bold text-brand-brown">{addressForm.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-text-secondary">Shipping Address:</span>
                      <span className="font-bold text-brand-brown text-right max-w-[200px] line-clamp-2">{addressForm.street}, {addressForm.city}</span>
                    </div>
                    {hasCustomBox && customGiftNote.trim() && (
                      <div className="flex justify-between text-sm border-t border-brand-brown/5 pt-2">
                        <span className="text-brand-text-secondary">Gift Note:</span>
                        <span className="font-bold text-brand-brown italic max-w-[200px] line-clamp-2 text-right">"{customGiftNote.trim()}"</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 max-w-md mx-auto">
                    <button onClick={() => setStep(2)} className="w-1/3 px-8 py-4 font-bold text-brand-brown bg-brand-light rounded-xl hover:bg-brand-brown/10 transition-colors cursor-pointer">Back</button>
                    <button onClick={handlePlaceOrder} className="w-2/3 flex items-center justify-center space-x-2 px-8 py-4 font-bold text-white bg-brand-gold rounded-xl hover:bg-brand-brown transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Pay ₹{calculations ? (calculations.totalAmount / 100).toFixed(2) : "0.00"}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5 sticky top-24">
              <h3 className="font-serif font-bold text-xl text-brand-brown mb-4 border-b border-brand-brown/10 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-brand-light flex-shrink-0">
                      <Image src={item.image || "/premium_cookie.png"} alt={item.name} fill className="object-cover" sizes="64px" />
                      <span className="absolute -top-2 -right-2 bg-brand-brown text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-brand-brown line-clamp-1">{item.name}</h4>
                      <span className="text-brand-text-secondary text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code input block */}
              <div className="mb-6 pt-4 border-t border-brand-brown/10">
                {appliedPromoCode ? (
                  <div className="flex items-center justify-between p-3 bg-brand-light rounded-xl border border-brand-gold/20">
                    <span className="text-xs font-bold text-brand-gold flex items-center">
                      <Tag className="w-3.5 h-3.5 mr-1" />
                      {appliedPromoCode} APPLIED
                    </span>
                    <button onClick={handleRemoveCoupon} className="text-xs text-brand-error font-extrabold hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Promo Code" 
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-brand-light border border-brand-brown/10 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none text-brand-brown focus:border-brand-gold transition-all"
                    />
                    <button type="submit" disabled={isLoadingValidate} className="px-4 py-2 bg-brand-brown text-white rounded-xl hover:bg-brand-gold text-xs font-black uppercase transition-colors cursor-pointer">
                      Apply
                    </button>
                  </form>
                )}
              </div>

              <div className="border-t border-brand-brown/10 pt-4 space-y-2.5 text-sm text-brand-text-primary">
                
                {isLoadingValidate ? (
                  <div className="space-y-2 py-4">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Subtotal</span>
                      <span className="font-bold text-brand-brown">
                        ₹{calculations ? (calculations.subtotal / 100).toFixed(2) : "0.00"}
                      </span>
                    </div>

                    {calculations && calculations.discountAmount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span className="flex items-center text-xs font-bold">
                          <Tag className="w-3.5 h-3.5 mr-1" /> Discount ({calculations.appliedCoupon?.code})
                        </span>
                        <span className="font-bold">-₹{(calculations.discountAmount / 100).toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">GST (18%)</span>
                      <span className="font-bold text-brand-brown">
                        ₹{calculations ? (calculations.taxAmount / 100).toFixed(2) : "0.00"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-brand-text-secondary">Shipping</span>
                      <span className="font-bold text-brand-brown">
                        {calculations && calculations.shippingFee === 0 ? "Free" : `₹${calculations ? (calculations.shippingFee / 100).toFixed(2) : "0.00"}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-brand-brown/10 mt-2">
                      <span className="font-bold text-lg text-brand-brown">Total</span>
                      <span className="font-black text-2xl text-brand-brown">
                        ₹{calculations ? (calculations.totalAmount / 100).toFixed(2) : "0.00"}
                      </span>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
