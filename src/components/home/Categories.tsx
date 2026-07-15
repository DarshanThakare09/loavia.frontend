"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Cookie, Leaf, Sparkles, Heart, Tag,
  ChevronLeft, ChevronRight, LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSiteStore } from "@/store/siteStore";

gsap.registerPlugin(ScrollTrigger);

/* ─── Icon map ───────────────────────────────────────────────────────────── */
const getCategoryIcon = (name: string): LucideIcon => {
  const l = name.toLowerCase();
  if (l.includes("vegan"))                                       return Leaf;
  if (l.includes("diet") || l.includes("oat") || l.includes("health")) return Heart;
  if (l.includes("classic") || l.includes("millet"))            return Cookie;
  if (l.includes("gluten"))                                      return Sparkles;
  return Tag;
};

/* ─── Floating decorative particles ─────────────────────────────────────── */
const FloatingParticles = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <style>{`
      @keyframes catFloat {
        0%,100% { transform:translateY(0);   opacity:.15; }
        50%      { transform:translateY(-12px); opacity:.35; }
      }
      .cat-particle { position:absolute; animation:catFloat ease-in-out infinite; }
    `}</style>
    <div className="cat-particle" style={{ top:"10%",left:"80%",width:12,height:12,border:"1px solid #A0772A",borderRadius:"50%",animationDuration:"4s" }}/>
    <div className="cat-particle" style={{ top:"70%",left:"5%", width:16,height:16,backgroundColor:"#A0772A",clipPath:"polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",animationDuration:"5.5s",animationDelay:"1.5s" }}/>
    <div className="cat-particle" style={{ top:"30%",left:"90%",width:8, height:8, backgroundColor:"#5C3317",borderRadius:"50%",animationDuration:"3.5s",animationDelay:".5s" }}/>
    <div className="cat-particle" style={{ top:"80%",left:"80%",width:10,height:10,border:"1px solid #5C3317",animationDuration:"6s",animationDelay:"2s" }}/>
  </div>
);

/* ─── Individual card ────────────────────────────────────────────────────── */
interface Cat { name: string; image?: string; link: string }
interface CardProps {
  cat: Cat; uid: string; hovered: string | null;
  onEnter: () => void; onLeave: () => void; onClick: () => void;
}
function CategoryCard({ cat, uid, hovered, onEnter, onLeave, onClick }: CardProps) {
  const Icon = getCategoryIcon(cat.name);
  const isHov = hovered === uid;
  return (
    <button
      className="group text-left block w-full h-full focus:outline-none transition-all duration-[400ms] ease-out will-change-transform"
      onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick}
      aria-label={`Shop category ${cat.name}`}
    >
      <div className="cat-glass-card rounded-[2.5rem] h-full flex flex-col justify-end p-3 sm:p-4 relative overflow-hidden">
        {/* background image */}
        <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-110">
          <Image src={cat.image || "/premium_cookie.png"} alt={cat.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        </div>
        {/* sheen sweep */}
        <div className="cat-sheen-sweep z-10" />
        {/* icon badge */}
        <div className="absolute top-4 right-4 z-10 bg-white/90 p-2.5 rounded-full border border-brand-gold/20 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white">
          <Icon className="w-4 h-4 text-brand-gold transition-colors duration-300 group-hover:text-inherit" />
        </div>
        {/* text overlay */}
        <div className="relative z-10 w-full bg-white/90 backdrop-blur-md border border-[#5C3317]/10 p-4 rounded-2xl shadow-lg transition-all duration-300 group-hover:bg-white group-hover:border-brand-gold/40 transform group-hover:translate-y-[-4px]">
          <h3 className={`text-sm sm:text-base font-bold transition-colors duration-[250ms] ${isHov ? "text-brand-gold" : "text-brand-brown"}`}>
            {cat.name}
          </h3>
          <div className="mt-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#A0772A]/70 flex items-center justify-between">
            <span>Shop Now</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
const GAP         = 20;   // px — gap between cards
const CARDS_SHOWN = 3;    // always 3 cards visible on desktop
const SPEED_PX    = 0.55; // px per 16 ms tick (≈ 34 px/s)

export function Categories() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);   // clipping viewport
  const trackRef   = useRef<HTMLDivElement>(null);   // scrollable track

  const router = useRouter();
  const [hoveredUid,          setHoveredUid]          = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPaused,            setIsPaused]            = useState(false);
  const [isDragging,          setIsDragging]          = useState(false);
  const [cardWidth,           setCardWidth]           = useState(340);

  const dragStartX   = useRef(0);
  const scrollAtDrag = useRef(0);
  const rafId        = useRef<number | null>(null);
  const scrollPos    = useRef(0); // we drive scrollLeft manually via RAF

  const { categoriesList } = useSiteStore();
  const base = categoriesList ?? [];

  // We need enough clones so a seamless loop works: triplicate the set
  // [ clone-set | real-set | clone-set ]
  const slides: (Cat & { uid: string })[] = [
    ...base.map((c, i) => ({ ...c, uid: `a-${i}` })),
    ...base.map((c, i) => ({ ...c, uid: `b-${i}` })),
    ...base.map((c, i) => ({ ...c, uid: `c-${i}` })),
  ];
  const setWidth = () => base.length * (cardWidth + GAP); // width of one "set"

  /* ── Reduced-motion preference ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* ── GSAP entrance animation ── */
  useGSAP(() => {
    if (prefersReducedMotion) {
      gsap.set(".cat-heading-word, .cat-subtitle, .cat-carousel-shell", { opacity: 1, y: 0 });
      return;
    }
    const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true } });
    tl.fromTo(".cat-heading-word",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }
    )
    .fromTo(".cat-subtitle",
      { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.6"
    )
    .fromTo(".cat-carousel-shell",
      { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4"
    );
  }, { scope: sectionRef, dependencies: [prefersReducedMotion, base.length] });

  /* ── Compute card width from container so exactly 3 fit ── */
  const computeCardWidth = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap || base.length === 0) return;
    const available = wrap.clientWidth;
    // on small screens, show 1.2 cards; on tablet show 2; desktop show 3
    let shown = CARDS_SHOWN;
    if (available < 500) shown = 1.2;
    else if (available < 780) shown = 2;
    const cw = Math.floor((available - GAP * (Math.floor(shown) - 1)) / shown);
    setCardWidth(cw);
  }, [base.length]);

  useEffect(() => {
    computeCardWidth();
    const ro = new ResizeObserver(computeCardWidth);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [computeCardWidth]);

  /* ── Seed initial scroll position to the middle set ── */
  useEffect(() => {
    if (base.length === 0 || cardWidth === 340) return; // wait for real cardWidth
    const sw = setWidth();
    scrollPos.current = sw; // start at second set
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base.length, cardWidth]);

  /* ── RAF-driven continuous scroll ── */
  useEffect(() => {
    if (prefersReducedMotion || base.length === 0) return;

    const tick = () => {
      if (!isPaused && !isDragging) {
        scrollPos.current += SPEED_PX;
        // seamless wrap: if we've scrolled past the second set, jump back one set
        const sw = base.length * (cardWidth + GAP);
        if (scrollPos.current >= sw * 2) scrollPos.current -= sw;
        if (scrollPos.current < sw)     scrollPos.current += sw; // shouldn't happen but safety net
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [isPaused, isDragging, prefersReducedMotion, base.length, cardWidth]);

  /* ── Arrow navigation: smooth scroll by exactly 1 card ── */
  const scrollByCard = (dir: 1 | -1) => {
    const step     = cardWidth + GAP;
    const target   = scrollPos.current + dir * step;
    const start    = scrollPos.current;
    const duration = 380; // ms
    const startTime = performance.now();
    const sw = base.length * (cardWidth + GAP);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - t, 3);
      scrollPos.current = start + (target - start) * eased;
      // wrap
      if (scrollPos.current >= sw * 2) scrollPos.current -= sw;
      if (scrollPos.current < sw)     scrollPos.current += sw;
      if (trackRef.current) trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  /* ── Mouse drag ── */
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current   = e.clientX;
    scrollAtDrag.current = scrollPos.current;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = dragStartX.current - e.clientX;
    const sw    = base.length * (cardWidth + GAP);
    let next    = scrollAtDrag.current + delta;
    if (next >= sw * 2) next -= sw;
    if (next < sw)      next += sw;
    scrollPos.current = next;
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${next}px)`;
  };
  const stopDrag = () => setIsDragging(false);

  /* ── Touch drag ── */
  const onTouchStart = (e: React.TouchEvent) => {
    dragStartX.current   = e.touches[0].clientX;
    scrollAtDrag.current = scrollPos.current;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const delta = dragStartX.current - e.touches[0].clientX;
    const sw    = base.length * (cardWidth + GAP);
    let next    = scrollAtDrag.current + delta;
    if (next >= sw * 2) next -= sw;
    if (next < sw)      next += sw;
    scrollPos.current = next;
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${next}px)`;
  };

  return (
    <section ref={sectionRef} id="category-section" className="py-24 relative overflow-hidden">
      <style>{`
        .category-bg-layer {
          background-image: url('/cookie-parallax-bg.png');
          background-size: cover; background-position: center; background-repeat: no-repeat;
        }
        @media (min-width: 1024px) { .category-bg-layer { background-attachment: fixed; } }

        .cat-glass-card {
          position: relative; overflow: hidden; background-size: cover; background-position: center;
          border: none; transition: all .5s cubic-bezier(.16,1,.3,1);
          display: flex; flex-direction: column; justify-content: flex-end;
        }
        .cat-glass-card::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(to top, rgba(0,0,0,.4), rgba(0,0,0,.1) 40%, transparent);
          pointer-events:none; z-index:1;
        }
        .cat-sheen-sweep {
          position:absolute; top:0; left:-150%; width:50%; height:100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0) 30%,rgba(160,119,42,.25) 70%,transparent);
          transform:skewX(-25deg); pointer-events:none; z-index:2;
        }
        .group:hover .cat-sheen-sweep { left:150%; transition: left .8s cubic-bezier(.16,1,.3,1); }
        .group:hover .cat-glass-card  { transform:translateY(-8px) scale(1.02); box-shadow:0 30px 60px rgba(92,51,23,.2); }

        /* Carousel wrapper clips overflow */
        .cat-viewport { overflow: hidden; position: relative; }

        /* The moving track — we drive it via JS transform, NO scroll */
        .cat-track {
          display: flex;
          will-change: transform;
          cursor: grab;
          user-select: none;
        }
        .cat-track.dragging { cursor: grabbing; }

        /* Arrow buttons */
        .cat-arrow {
          position:absolute; top:50%; transform:translateY(-50%); z-index:20;
          width:46px; height:46px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,.93); border:1.5px solid rgba(160,119,42,.3);
          box-shadow:0 4px 20px rgba(92,51,23,.15); backdrop-filter:blur(8px);
          color:#5C3317; cursor:pointer; transition:all .25s ease;
        }
        .cat-arrow:hover {
          background:#5C3317; border-color:#5C3317; color:white;
          box-shadow:0 6px 28px rgba(92,51,23,.35);
          transform:translateY(-50%) scale(1.1);
        }
        .cat-arrow-left  { left:-23px; }
        .cat-arrow-right { right:-23px; }
        @media (max-width:480px) {
          .cat-arrow { width:36px; height:36px; }
          .cat-arrow-left  { left:6px; }
          .cat-arrow-right { right:6px; }
        }
      `}</style>

      <div className="category-bg-layer absolute inset-[-8%] z-0" />
      <div className="absolute inset-0 z-0 opacity-[.03] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />
      <FloatingParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Heading ── */}
        <div className="text-center mb-16">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[.28em] text-brand-gold">Freshly Curated</p>
          <h2
            style={{ fontFamily:"'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-center sm:flex-wrap gap-x-4 gap-y-2 text-center"
          >
            {"Shop by Category".split(" ").map((word, idx, arr) => (
              <span
                key={idx}
                className={`cat-heading-word opacity-0 inline-block ${
                  idx === arr.length - 1
                    ? "text-brand-brown text-5xl sm:text-7xl md:text-8xl lg:text-[8rem]"
                    : "text-brand-gold text-2xl md:text-3xl lg:text-[3rem]"
                }`}
              >{word}</span>
            ))}
          </h2>
          <p className="cat-subtitle opacity-0 font-sans text-brand-text-secondary max-w-2xl mx-auto text-sm md:text-base lg:text-lg font-light leading-relaxed">
            Explore our carefully curated collections, each designed to delight your taste buds and satisfy your cravings.
          </p>
        </div>

        {/* ── Carousel ── */}
        <div
          className="cat-carousel-shell opacity-0 relative px-8 sm:px-10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => { setIsPaused(false); setIsDragging(false); }}
        >
          {/* Left arrow */}
          <button className="cat-arrow cat-arrow-left" onClick={() => scrollByCard(-1)} aria-label="Previous category">
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>

          {/* Clipping viewport */}
          <div ref={wrapRef} className="cat-viewport">
            {/* Moving track */}
            <div
              ref={trackRef}
              className={`cat-track${isDragging ? " dragging" : ""}`}
              style={{ gap: `${GAP}px` }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={stopDrag}
            >
              {slides.map(({ uid, ...cat }) => (
                <div
                  key={uid}
                  style={{ width: `${cardWidth}px`, flexShrink: 0, height: "22rem" }}
                >
                  <CategoryCard
                    cat={cat} uid={uid}
                    hovered={hoveredUid}
                    onEnter={() => setHoveredUid(uid)}
                    onLeave={() => setHoveredUid(null)}
                    onClick={() => router.push(cat.link)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right arrow */}
          <button className="cat-arrow cat-arrow-right" onClick={() => scrollByCard(1)} aria-label="Next category">
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </section>
  );
}
