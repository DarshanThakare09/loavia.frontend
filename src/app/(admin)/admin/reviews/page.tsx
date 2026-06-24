"use client";

import { useState, useEffect } from "react";
import { useAdminReviewStore } from "@/store/adminReviewStore";
import { ReviewStatus } from "@/types/admin";
import {
  Star, CheckCircle2, XCircle, EyeOff, AlertCircle,
  Loader2, RefreshCw, MessageSquare,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "text-brand-gold fill-brand-gold" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}

function getStatusBadge(status: ReviewStatus) {
  switch (status) {
    case "APPROVED": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED": return "bg-rose-50 text-rose-700 border-rose-200";
    case "HIDDEN":   return "bg-gray-100 text-gray-600 border-gray-200";
    case "PENDING":  return "bg-amber-50 text-amber-700 border-amber-200";
    default:         return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

const STATUS_TABS: { label: string; value: ReviewStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Hidden", value: "HIDDEN" },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminReviewsPage() {
  const store = useAdminReviewStore();

  const [activeStatus, setActiveStatus] = useState<ReviewStatus | "ALL">("PENDING");
  const [expandedId, setExpandedId]     = useState<string | null>(null);

  // ── Fetch on mount / when tab changes ───────────────────────────────
  useEffect(() => {
    const status = activeStatus === "ALL" ? undefined : activeStatus;
    store.fetchReviews(1, 15, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatus]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleModerate = async (id: string, status: ReviewStatus) => {
    await store.updateReviewStatus(id, status);
    // Remove from current list if status doesn't match active filter
    if (activeStatus !== "ALL" && status !== activeStatus) {
      // the store updateReviewStatus optimistically removes it; no extra action needed
    }
  };

  const fetchPage = (page: number) => {
    const status = activeStatus === "ALL" ? undefined : activeStatus;
    store.fetchReviews(page, 15, status);
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown font-serif">Reviews</h1>
          <p className="text-brand-text-secondary mt-1">
            {store.pagination
              ? `${store.pagination.total.toLocaleString()} reviews`
              : "Moderate customer product reviews"}
          </p>
        </div>
        <button
          onClick={() => fetchPage(store.currentPage)}
          disabled={store.isLoadingReviews}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-brown/10 rounded-xl text-sm font-semibold text-brand-brown hover:bg-brand-light transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${store.isLoadingReviews ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap bg-white p-4 rounded-2xl border border-brand-brown/5 shadow-sm">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveStatus(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeStatus === tab.value
                ? "bg-brand-brown text-white shadow-sm"
                : "bg-brand-light text-brand-text-secondary hover:bg-brand-gold/15 hover:text-brand-brown"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {store.reviewsError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Error loading reviews</p>
            <p className="text-red-700 text-sm">{store.reviewsError}</p>
            <button onClick={() => fetchPage(1)} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {store.isLoadingReviews && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-8">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gradient-to-r from-brand-light to-brand-gold/10 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!store.isLoadingReviews && store.reviews.length === 0 && !store.reviewsError && (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-brand-gold/40 mx-auto mb-4" />
          <p className="text-brand-text-secondary text-lg font-semibold">No reviews found</p>
          <p className="text-brand-text-secondary text-sm mt-1">
            {activeStatus !== "ALL"
              ? `No ${activeStatus.toLowerCase()} reviews at this time.`
              : "No customer reviews yet."}
          </p>
        </div>
      )}

      {/* Review Cards */}
      {!store.isLoadingReviews && store.reviews.length > 0 && (
        <div className="space-y-4">
          {store.reviews.map(review => {
            const isExpanded = expandedId === review.id;
            return (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-sm border border-brand-brown/10 p-5 space-y-4"
              >
                {/* Row 1: Product + Rating + Status */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-brand-brown text-base">{review.productName}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-brand-text-secondary font-semibold">{review.rating}/5</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(review.status)}`}>
                    {review.status}
                  </span>
                </div>

                {/* Row 2: Reviewer + Date */}
                <div className="flex items-center gap-3 text-sm text-brand-text-secondary">
                  <div className="w-7 h-7 rounded-full bg-brand-gold/15 text-brand-gold font-bold flex items-center justify-center text-xs border border-brand-gold/10 flex-shrink-0">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-brand-text-primary">{review.userName}</span>
                  <span className="text-brand-text-secondary/60">·</span>
                  <span>{review.userEmail}</span>
                  <span className="text-brand-text-secondary/60">·</span>
                  <span>{formatDate(review.createdAt)}</span>
                </div>

                {/* Review content */}
                <div className="bg-brand-light/40 rounded-xl p-4 border border-brand-brown/5">
                  {review.title && (
                    <p className="font-bold text-brand-text-primary text-sm mb-1">"{review.title}"</p>
                  )}
                  <p className={`text-sm text-brand-text-secondary leading-relaxed ${!isExpanded && review.content.length > 200 ? "line-clamp-3" : ""}`}>
                    {review.content}
                  </p>
                  {review.content.length > 200 && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : review.id)}
                      className="text-xs text-brand-gold font-semibold hover:text-brand-brown mt-1 transition-colors"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>

                {/* Moderation actions */}
                <div className="flex flex-wrap gap-2 justify-end pt-1 border-t border-brand-brown/5">
                  {review.status !== "APPROVED" && (
                    <button
                      onClick={() => handleModerate(review.id, "APPROVED")}
                      disabled={store.isUpdatingStatus}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {store.isUpdatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Approve
                    </button>
                  )}
                  {review.status !== "REJECTED" && (
                    <button
                      onClick={() => handleModerate(review.id, "REJECTED")}
                      disabled={store.isUpdatingStatus}
                      className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {store.isUpdatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                      Reject
                    </button>
                  )}
                  {review.status !== "HIDDEN" && (
                    <button
                      onClick={() => handleModerate(review.id, "HIDDEN")}
                      disabled={store.isUpdatingStatus}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {store.isUpdatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <EyeOff className="w-3.5 h-3.5" />}
                      Hide
                    </button>
                  )}
                  {review.moderatedBy && (
                    <span className="text-[10px] text-brand-text-secondary self-center ml-2">
                      Moderated {review.moderatedAt ? formatDate(review.moderatedAt) : ""}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!store.isLoadingReviews && store.pagination && store.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          <button disabled={store.currentPage <= 1} onClick={() => fetchPage(store.currentPage - 1)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20 disabled:opacity-40 disabled:cursor-not-allowed">
            ← Prev
          </button>
          {Array.from({ length: store.pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => fetchPage(page)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${store.currentPage === page ? "bg-brand-brown text-white" : "bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20"}`}>
              {page}
            </button>
          ))}
          <button disabled={store.currentPage >= store.pagination.totalPages} onClick={() => fetchPage(store.currentPage + 1)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-brand-light text-brand-text-secondary hover:bg-brand-gold/20 disabled:opacity-40 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
