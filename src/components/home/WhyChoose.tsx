"use client";

import { useEffect, useState, useRef } from "react";
import { useSiteStore } from "@/store/siteStore";
import { Wheat, ShieldCheck, Sprout, Dumbbell, Flame, Sparkles, X, Star } from "lucide-react";
import { toast } from "sonner";

const getFeatureIcon = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("maida")) return <Wheat className="w-5 h-5 transition-all duration-300" />;
  if (lower.includes("preservative")) return <ShieldCheck className="w-5 h-5 transition-all duration-300" />;
  if (lower.includes("millet") || lower.includes("natural")) return <Sprout className="w-5 h-5 transition-all duration-300" />;
  if (lower.includes("fiber")) return <Dumbbell className="w-5 h-5 transition-all duration-300" />;
  if (lower.includes("fresh") || lower.includes("baked")) return <Flame className="w-5 h-5 transition-all duration-300" />;
  if (lower.includes("premium") || lower.includes("ingredient")) return <Sparkles className="w-5 h-5 transition-all duration-300" />;
  return (
    <svg className="w-5 h-5 stroke-[2.5] transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
};

export default function WhyChoose() {
  const { whyChooseTitle, whyChooseDescription, whyChooseFeatures } = useSiteStore();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const titleText = whyChooseTitle || "Why Choose Loavia™";
  const loaviaIndex = titleText.toLowerCase().indexOf("loavia");
  let part1 = "Why Choose";
  let part2 = "Loavia™";
  if (loaviaIndex !== -1) {
    part1 = titleText.substring(0, loaviaIndex).trim();
    const loaviaPart = titleText.substring(loaviaIndex);
    if (loaviaPart.endsWith("™")) {
      part2 = loaviaPart.charAt(0).toUpperCase() + loaviaPart.slice(1, -1).toLowerCase() + "™";
    } else {
      part2 = loaviaPart.charAt(0).toUpperCase() + loaviaPart.slice(1).toLowerCase();
    }
  }

  const descriptionText = whyChooseDescription || "At Loavia, we believe healthy snacking should be an indulgent pleasure. Our premium millet cookies are thoughtfully baked using natural grains, rich flavours, and wholesome ingredients to create pure, guilt-free joy in every bite.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !comment.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (comment.trim().length < 5) {
      toast.error("Review must be at least 5 characters.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            guestName: name.trim(),
            guestEmail: email.trim(),
            rating,
            comment: comment.trim(),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || "Failed to submit review.");
      }

      toast.success("Thank you! Your review has been submitted and is pending approval.");
      
      // Reset form
      setName("");
      setEmail("");
      setRating(5);
      setComment("");
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section
      ref={sectionRef}
      className="w-full relative lg:aspect-[1672/941] flex items-center py-20 lg:py-0 overflow-hidden parallax-bg"
    >
      <style>{`
        .parallax-bg {
          background-image: url('/whychooseloavia.png');
          background-size: cover;
          background-position: right center;
          background-repeat: no-repeat;
        }
        @media (min-width: 1024px) {
          .parallax-bg {
            background-attachment: fixed;
          }
        }
        .why-choose-card {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(92, 51, 23, 0.1);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .why-choose-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(92, 51, 23, 0.15) 30%,
            rgba(160, 119, 42, 0.3) 70%,
            transparent 100%
          );
          transform: skewX(-25deg);
        }
        .why-choose-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 20px 40px rgba(92, 51, 23, 0.12);
          border-color: rgba(160, 119, 42, 0.4);
        }
        .why-choose-card:hover::after {
          left: 150%;
          transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center">
        <div className={`w-full lg:w-[52%] xl:w-[48%] flex flex-col justify-center text-left py-6 lg:py-12 transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98] pointer-events-none"
          }`}>
          <h2
            style={{ fontFamily: "'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2"
          >
            <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">{part1}</span>
            <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">{part2}</span>
          </h2>

          <p className="font-sans text-brand-text-secondary text-sm md:text-base lg:text-lg mb-8 leading-relaxed max-w-2xl font-light">
            {descriptionText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {whyChooseFeatures?.map((feature) => (
              <div
                key={feature}
                className="group why-choose-card rounded-2xl p-5 flex items-center space-x-4 cursor-pointer"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                  {getFeatureIcon(feature)}
                </div>
                <span className="font-sans font-semibold text-brand-brown text-sm md:text-base transition-colors duration-300 group-hover:text-brand-gold">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Add Review Button */}
          <div className="mt-8 animate-in fade-in duration-300 delay-150">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold text-white bg-brand-brown rounded-full hover:bg-brand-gold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider border border-transparent"
            >
              Write a Review
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[#FDFBF7] border border-[#5C3317]/10 w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-brown hover:bg-brand-gold hover:text-white transition-all cursor-pointer border border-[#5C3317]/5"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-6 text-left">
              <h3 
                style={{ fontFamily: "'Amsterdam Signature', serif" }}
                className="text-brand-brown text-4xl leading-none pt-2 pb-2 font-normal"
              >
                Share your Experience
              </h3>
              <p className="font-sans text-brand-text-secondary text-xs font-light mt-1">
                Your feedback helps us make healthy snacking even more magical.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-left text-[10px] font-bold text-brand-brown uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pranita Patil"
                  className="w-full px-4 py-3 bg-brand-light border border-brand-brown/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 text-brand-brown font-sans font-light"
                />
              </div>

              <div>
                <label className="block text-left text-[10px] font-bold text-brand-brown uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. pranita@loavia.com"
                  className="w-full px-4 py-3 bg-brand-light border border-brand-brown/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 text-brand-brown font-sans font-light"
                />
              </div>

              {/* Rating Star Selection */}
              <div>
                <label className="block text-left text-[10px] font-bold text-brand-brown uppercase tracking-wider mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = hoverRating !== null ? star <= hoverRating : star <= rating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-2xl transition-all hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <Star 
                          className={`w-7 h-7 ${isFilled ? "fill-brand-gold text-brand-gold" : "text-brand-brown/25"}`} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-left text-[10px] font-bold text-brand-brown uppercase tracking-wider mb-2">
                  Review Text
                </label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you loved about our millet cookies..."
                  rows={4}
                  className="w-full px-4 py-3 bg-brand-light border border-brand-brown/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 text-brand-brown font-sans font-light resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-brown text-white hover:bg-brand-gold rounded-full font-bold uppercase tracking-wider text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}