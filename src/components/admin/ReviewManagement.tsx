"use client";

import { useState, useMemo } from "react";
import { useSiteStore, ReviewItem, ReviewStatus } from "@/store/siteStore";
import {
  Star, CheckCircle, XCircle, EyeOff, Sparkles, Pin, Trash2,
  MessageSquare, Clock, Search, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ReviewStatus, { label: string; color: string }> = {
  pending:  { label: "Pending",  color: "bg-amber-50  text-amber-700  border-amber-200"  },
  approved: { label: "Approved", color: "bg-green-50  text-green-700  border-green-200"  },
  rejected: { label: "Rejected", color: "bg-red-50    text-red-700    border-red-200"    },
  hidden:   { label: "Hidden",   color: "bg-gray-100  text-gray-500   border-gray-200"   },
};

const STARS = Array.from({ length: 5 }, (_, i) => i + 1);

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {STARS.map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </span>
  );
}

function StatusBadge({ status, featured, pinned }: { status: ReviewStatus; featured: boolean; pinned: boolean }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.color}`}>
        {status === "pending"  && <Clock    className="w-3 h-3" />}
        {status === "approved" && <CheckCircle className="w-3 h-3" />}
        {status === "rejected" && <XCircle  className="w-3 h-3" />}
        {status === "hidden"   && <EyeOff   className="w-3 h-3" />}
        {cfg.label}
      </span>
      {featured && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-purple-50 text-purple-700 border-purple-200">
          <Sparkles className="w-3 h-3" /> Featured
        </span>
      )}
      {pinned && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200">
          <Pin className="w-3 h-3" /> Pinned
        </span>
      )}
    </div>
  );
}

// ── Action menu ───────────────────────────────────────────────────────────────
function ActionMenu({ review, onModerate, onFeature, onPin, onDelete }: {
  review: ReviewItem;
  onModerate: (id: string | number, s: ReviewStatus) => void;
  onFeature: (id: string | number) => void;
  onPin: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}) {
  const [open, setOpen] = useState(false);

  const actions = [
    review.status !== "approved" && { label: "Approve",  icon: CheckCircle, cls: "text-green-600", fn: () => onModerate(review.id, "approved") },
    review.status !== "rejected" && { label: "Reject",   icon: XCircle,     cls: "text-red-500",   fn: () => onModerate(review.id, "rejected") },
    review.status !== "hidden"   && { label: "Hide",     icon: EyeOff,      cls: "text-gray-500",  fn: () => onModerate(review.id, "hidden")   },
    review.status !== "pending"  && { label: "Set Pending", icon: Clock,   cls: "text-amber-600", fn: () => onModerate(review.id, "pending")  },
    { label: review.featured ? "Unfeature" : "Mark Featured", icon: Sparkles, cls: "text-purple-600", fn: () => onFeature(review.id) },
    { label: review.pinned   ? "Unpin"     : "Pin to Top",    icon: Pin,      cls: "text-blue-600",   fn: () => onPin(review.id)    },
    { label: "Delete",  icon: Trash2,  cls: "text-red-500 border-t border-brand-brown/8 mt-1 pt-1", fn: () => onDelete(review.id) },
  ].filter(Boolean) as { label: string; icon: React.ElementType; cls: string; fn: () => void }[];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-brown border border-brand-brown/20 rounded-xl hover:bg-brand-light transition-colors cursor-pointer"
      >
        Actions <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-brand-brown/10 bg-white shadow-xl overflow-hidden">
            {actions.map(({ label, icon: Icon, cls, fn }) => (
              <button
                key={label}
                type="button"
                onClick={() => { fn(); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-brand-light transition-colors cursor-pointer ${cls}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: React.ElementType; color: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-3 ${color}`}>
      <div className="rounded-xl p-2 bg-white/60">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs font-medium mt-0.5 opacity-80">{label}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
type FilterTab = ReviewStatus | "all" | "featured";

export default function ReviewManagement() {
  const { testimonialsList: reviews, moderateReview, toggleReviewFeatured, toggleReviewPinned, deleteReview } = useSiteStore();

  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => ({
    total:    reviews.length,
    pending:  reviews.filter(r => r.status === "pending").length,
    approved: reviews.filter(r => r.status === "approved").length,
    featured: reviews.filter(r => r.featured).length,
  }), [reviews]);

  const filtered = useMemo(() => {
    let list = [...reviews];

    // Sort: pinned first, then by date desc
    list.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });

    if (filter === "featured") list = list.filter(r => r.featured);
    else if (filter !== "all")  list = list.filter(r => r.status === filter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        (r.customerName ?? r.name ?? "").toLowerCase().includes(q) ||
        (r.reviewText   ?? r.content ?? "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [reviews, filter, search]);

  const handleModerate = (id: string | number, status: ReviewStatus) => {
    moderateReview(id, status);
    toast.success(`Review marked as ${STATUS_CONFIG[status].label}.`);
  };

  const handleFeature = (id: string | number) => {
    const r = reviews.find(r => r.id === id);
    toggleReviewFeatured(id);
    toast.success(r?.featured ? "Removed from featured." : "Marked as featured.");
  };

  const handlePin = (id: string | number) => {
    const r = reviews.find(r => r.id === id);
    toggleReviewPinned(id);
    toast.success(r?.pinned ? "Review unpinned." : "Review pinned to top.");
  };

  const handleDelete = (id: string | number) => {
    if (!confirm("Permanently delete this review?")) return;
    deleteReview(id);
    toast.success("Review deleted.");
  };

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: "all",      label: `All (${stats.total})`       },
    { key: "pending",  label: `Pending (${stats.pending})`  },
    { key: "approved", label: `Approved (${stats.approved})` },
    { key: "rejected", label: "Rejected"                    },
    { key: "featured", label: `Featured (${stats.featured})` },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="border-b border-brand-brown/10 pb-4">
        <h2 className="text-xl font-bold text-brand-brown font-serif">Review Management</h2>
        <p className="text-xs text-brand-text-secondary mt-0.5">Moderate, approve, and feature customer reviews.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Reviews"    value={stats.total}    icon={MessageSquare} color="border-brand-brown/10 bg-brand-light/60 text-brand-brown" />
        <StatCard label="Pending Reviews"  value={stats.pending}  icon={Clock}         color="border-amber-200 bg-amber-50 text-amber-700"  />
        <StatCard label="Approved Reviews" value={stats.approved} icon={CheckCircle}   color="border-green-200 bg-green-50 text-green-700"  />
        <StatCard label="Featured Reviews" value={stats.featured} icon={Sparkles}      color="border-purple-200 bg-purple-50 text-purple-700" />
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filter === key
                  ? "bg-brand-brown text-white"
                  : "border border-brand-brown/15 text-brand-text-secondary hover:bg-brand-light"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or text…"
            className="w-full pl-8 pr-3 py-2 border border-brand-brown/15 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-gold/40 bg-brand-light"
          />
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-brand-text-secondary border border-brand-brown/8 rounded-2xl bg-brand-light/30">
            No reviews match the current filter.
          </div>
        )}

        {filtered.map(review => {
          const name    = review.customerName ?? review.name ?? "Unknown";
          const email   = review.customerEmail ?? "";
          const text    = review.reviewText    ?? review.content ?? "";
          const date    = review.createdAt
            ? new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "";

          return (
            <div
              key={review.id}
              className={`rounded-2xl border bg-white transition-all ${
                review.pinned ? "border-blue-200 shadow-blue-50 shadow-md" : "border-brand-brown/8 shadow-sm"
              }`}
            >
              <div className="p-4">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-brown font-bold text-sm flex items-center justify-center shrink-0 uppercase">
                      {name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-brand-brown leading-tight">{name}</span>
                        {email && <span className="text-xs text-brand-text-secondary">{email}</span>}
                        {date  && <span className="text-xs text-brand-text-secondary">· {date}</span>}
                      </div>
                      <StarDisplay rating={review.rating} />
                    </div>
                  </div>

                  <ActionMenu
                    review={review}
                    onModerate={handleModerate}
                    onFeature={handleFeature}
                    onPin={handlePin}
                    onDelete={handleDelete}
                  />
                </div>

                {/* Review text */}
                <p className="mt-3 text-sm text-brand-text-secondary leading-relaxed">
                  &ldquo;{text}&rdquo;
                </p>

                {/* Status badges */}
                <div className="mt-3">
                  <StatusBadge status={review.status ?? "approved"} featured={review.featured ?? false} pinned={review.pinned ?? false} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
