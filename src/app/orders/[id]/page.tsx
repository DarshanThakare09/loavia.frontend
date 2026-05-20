"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle, Package, Truck, Home } from "lucide-react";

export default function OrderConfirmationPage() {
  const { id } = useParams();

  return (
    <div className="bg-brand-light min-h-screen pt-12 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-brown/5 text-center p-12">
          
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-4xl font-serif font-bold text-brand-brown mb-2">Order Confirmed!</h1>
          <p className="text-brand-text-secondary text-lg mb-8">
            Thank you for your purchase. Your order <span className="font-bold text-brand-gold">{id}</span> has been received.
          </p>

          <div className="bg-brand-cream rounded-2xl p-6 mb-12">
            <h3 className="font-bold text-brand-brown mb-6 text-left">Order Status</h3>
            
            <div className="flex justify-between items-start relative z-0">
              <div className="absolute left-[1.5rem] right-[1.5rem] top-[1.5rem] h-1 bg-brand-brown/10 -z-10 transform -translate-y-1/2"></div>
              <div className="absolute left-[1.5rem] right-[1.5rem] top-[1.5rem] h-1 -z-10 transform -translate-y-1/2">
                <div className="h-full bg-brand-gold transition-all duration-500 w-0"></div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-brown text-white flex items-center justify-center border-4 border-white"><Package className="w-5 h-5" /></div>
                <span className="text-xs font-bold mt-2 text-brand-brown">Processing</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-cream text-brand-text-secondary flex items-center justify-center border-4 border-white shadow-sm"><Truck className="w-5 h-5" /></div>
                <span className="text-xs font-bold mt-2 text-brand-text-secondary">Shipped</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-cream text-brand-text-secondary flex items-center justify-center border-4 border-white shadow-sm"><Home className="w-5 h-5" /></div>
                <span className="text-xs font-bold mt-2 text-brand-text-secondary">Delivered</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/profile" 
              className="px-8 py-4 font-bold text-brand-brown border-2 border-brand-brown/20 rounded-full hover:bg-brand-brown/5 transition-colors"
            >
              View Order Details
            </Link>
            <Link 
              href="/shop" 
              className="px-8 py-4 font-bold text-white bg-brand-brown rounded-full hover:bg-brand-gold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
