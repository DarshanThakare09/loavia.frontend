"use client";

import { useState, useEffect } from "react";
import { useAdminUserStore } from "@/store/adminUserStore";
import { ContactMessageDTO } from "@/types/admin";
import { Mail, Phone, RefreshCw, AlertCircle, Inbox, ChevronDown, ChevronUp } from "lucide-react";

const ENQUIRY_TYPE_LABELS: Record<string, string> = {
  GENERAL: "General",
  BULK_ORDER: "Bulk Order",
  CORPORATE_GIFTING: "Corporate Gifting",
  SUPPORT: "Support",
};

function formatDateTime(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return dateStr; }
}

function EnquiryTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    BULK_ORDER: "bg-blue-50 text-blue-700 border-blue-200",
    CORPORATE_GIFTING: "bg-purple-50 text-purple-700 border-purple-200",
    SUPPORT: "bg-orange-50 text-orange-700 border-orange-200",
    GENERAL: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colors[type] ?? colors.GENERAL}`}>
      {ENQUIRY_TYPE_LABELS[type] ?? type}
    </span>
  );
}

export default function AdminEnquiriesPage() {
  const store = useAdminUserStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    store.fetchContactMessages(1, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messages: ContactMessageDTO[] = store.contactMessages;
  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Contact Enquiries</h1>
          <p className="text-brand-text-secondary mt-1">
            {store.isLoadingMessages
              ? "Loading..."
              : `${messages.length} total enquiries${unreadCount > 0 ? ` · ${unreadCount} unread` : ""}`}
          </p>
        </div>
        <button
          onClick={() => store.fetchContactMessages(1, 100)}
          disabled={store.isLoadingMessages}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-brown/10 rounded-xl text-sm font-semibold text-brand-brown hover:bg-brand-light transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${store.isLoadingMessages ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {store.messagesError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900">Error loading enquiries</p>
            <p className="text-red-700 text-sm">{store.messagesError}</p>
            <button onClick={() => store.fetchContactMessages(1, 100)} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {store.isLoadingMessages && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gradient-to-r from-brand-light to-brand-gold/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!store.isLoadingMessages && messages.length === 0 && !store.messagesError && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-12 text-center">
          <Inbox className="w-12 h-12 text-brand-gold/40 mx-auto mb-4" />
          <p className="text-brand-text-secondary text-lg font-semibold">No enquiries yet</p>
          <p className="text-brand-text-secondary text-sm mt-1">Contact form submissions will appear here.</p>
        </div>
      )}

      {/* Enquiry cards */}
      {!store.isLoadingMessages && messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((msg) => {
            const isExpanded = expandedId === msg.id;
            return (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl border shadow-sm transition-all duration-200 ${
                  !msg.isRead ? "border-brand-gold/40 shadow-brand-gold/10" : "border-brand-brown/10"
                }`}
              >
                {/* Card header — always visible */}
                <button
                  className="w-full text-left p-5"
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Unread dot */}
                      <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!msg.isRead ? "bg-brand-gold" : "bg-transparent"}`} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-bold text-brand-brown">{msg.name}</span>
                          <EnquiryTypeBadge type={msg.enquiryType} />
                          {msg.isResponded && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                              Responded
                            </span>
                          )}
                          {!msg.isRead && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200">
                              Unread
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-brand-text-primary truncate">{msg.subject}</p>
                        <p className="text-xs text-brand-text-secondary mt-0.5">{formatDateTime(msg.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-brand-text-secondary">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-brand-brown/5 pt-4 space-y-4">
                    {/* Contact info row */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 text-brand-gold hover:underline font-medium">
                        <Mail className="w-4 h-4" />
                        {msg.email}
                      </a>
                      {msg.phone && (
                        <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 text-brand-text-secondary hover:text-brand-brown font-medium">
                          <Phone className="w-4 h-4" />
                          {msg.phone}
                        </a>
                      )}
                    </div>

                    {/* Message */}
                    <div className="bg-brand-light/50 rounded-xl p-4 border border-brand-brown/5">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary mb-2">Message</p>
                      <p className="text-sm text-brand-text-primary leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>

                    {/* Response (if any) */}
                    {msg.isResponded && msg.responseText && (
                      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
                          Response sent {msg.respondedAt ? formatDateTime(msg.respondedAt) : ""}
                        </p>
                        <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">{msg.responseText}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
