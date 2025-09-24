// src/pages/Home.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import toursData from "../data/tours.json";

/* ---------- helpers ---------- */
function mapTours(raw = []) {
  return raw.map((t, i) => {
    const id = t.id ?? t.slug ?? String(i + 1);
    return {
      id,
      title: t.title || t.name || "Untitled",
      category: (t.category || t.type || "Other").toString(),
      img: t.image || t.img || "/pics/1.jpg",
      to: `/tour/${id}`,
      summary: t.summary || t.description || "",
      tag: t.tag || "",
      slots: t.slots ?? 0,
      location: t.location || "",
      rating: t.rating ?? 4.8,
    };
  });
}

/* ---------- small UI bits ---------- */
const Badge = ({ children }) => (
  <span className="inline-block rounded-full bg-white/90 text-customTeal text-[11px] font-semibold px-2 py-0.5 shadow">
    {children}
  </span>
);

/* ---------- tiny hook for scroll-reveal ---------- */
function useReveal(selector = "[data-reveal]", rootMargin = "0px 0px -15% 0px") {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(selector));
    if (!("IntersectionObserver" in window) || els.length === 0) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("animate-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin, threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [selector, rootMargin]);
}

export default function Home() {
  const allTours = useMemo(() => mapTours(toursData), []);
  const featured = useMemo(() => allTours.slice(0, 3), [allTours]);

  // Local state for reviews
  const [reviews, setReviews] = useState([
    { id: 1, name: "Amelia", rating: 5, text: "Amazing eco-friendly hike!" },
    { id: 2, name: "Hassan", rating: 4, text: "Great cycling tour, but I wanted longer stops." },
  ]);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, text: "" });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.text.trim()) return;
    setReviews((prev) => [...prev, { id: Date.now(), ...newReview }]);
    setNewReview({ name: "", rating: 5, text: "" });
  };

  // enable scroll reveal
  useReveal();

  return (
    <div className="text-slate-900">
      {/* ===== HERO (split: left text, right image) ===== */}
      <section
        className="
          relative overflow-hidden bg-customTeal flex items-center
          py-4 sm:py-7 lg:py-10
        "
        // ↓ further reduced top/bottom padding for desktop
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 w-full">
          <div className="flex flex-col-reverse md:flex-row items-center gap-4 md:gap-7 lg:gap-8">
            {/* ↓ further reduced gap for desktop */}
            {/* Left: text */}
            <div className="w-full md:w-1/2 text-left opacity-0 translate-y-3 animate-delay-0" data-reveal="fade-up">
              <Badge>EcoVenture</Badge>
              <h1 className="mt-8 sm:mt-16 text-3xl xs:text-4xl sm:text-5xl lg:text-7xl font-extrabold font-merri leading-tight tracking-tight"
                style={{
                  color: '#fff',
                  fontFamily: 'Merriweather, serif',
                  textShadow: '0 2px 16px #2c7a7b55'
                }}>
                Your next green escape awaits
              </h1>
              <p className="mt-4 sm:mt-10 text-white/90 max-w-lg text-xs xs:text-sm sm:text-base md:text-lg">
                Eco-friendly tours and adventures across the UK — hiking, cycling, and guided nature walks.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-md bg-customTeal text-white font-semibold hover:bg-customTeal-dark transition-transform duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  Who are we?
                </Link>
                <Link
                  to="/tours"
                  className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-md border border-white/70 text-white font-semibold hover:bg-white/10 transition-transform duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  Hire us
                </Link>
              </div>
            </div>
            {/* Right: hero image */}
            <div className="w-full md:w-1/2 flex justify-center opacity-0 translate-y-3 animate-delay-100" data-reveal="fade-up">
              <img
                src="/pics/1.jpg"
                alt="Eco-friendly adventure"
                className="w-full max-w-md h-48 xs:h-56 sm:h-72 md:h-72 lg:h-[340px] object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                style={{ display: 'block' }}
              />
            </div>
          </div>
        </div>
        {/* subtle moving glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-float" />
      </section>

      {/* ===== SERVICES ===== */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 text-center grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          <div className="opacity-0 translate-y-3" data-reveal="fade-up">
            <ServiceCard
              icon={<IconGlobe className="w-10 h-10 text-customTeal" />}
              title="Travels & Tours"
              desc="Eco-friendly adventures tailored for you."
            />
          </div>
          <div className="opacity-0 translate-y-3 animate-delay-100" data-reveal="fade-up">
            <ServiceCard
              icon={<IconHotel className="w-10 h-10 text-customTeal" />}
              title="Stay Green"
              desc="Book eco-conscious accommodations."
            />
          </div>
          <div className="opacity-0 translate-y-3 animate-delay-200" data-reveal="fade-up">
            <ServiceCard
              icon={<IconBike className="w-10 h-10 text-customTeal" />}
              title="Adventure Gear"
              desc="Rent bikes, gear, and go explore sustainably."
            />
          </div>
        </div>
      </section>

      {/* ===== PACKAGES ===== */}
      <section className="bg-neutral-50 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-customTeal mb-6 sm:mb-10 text-center opacity-0 translate-y-3" data-reveal="fade-up">
            Our Packages
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
            {featured.map((t, idx) => (
              <div key={t.id} className={`opacity-0 translate-y-3 ${idx === 1 ? "animate-delay-100" : idx === 2 ? "animate-delay-200" : ""}`} data-reveal="fade-up">
                <PackageCard {...t} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RATING & REVIEWS ===== */}
      <section className="py-10 sm:py-16 border-t border-slate-200/60" style={{ background: 'var(--card)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-customTeal text-center mb-6 sm:mb-8 opacity-0 translate-y-3" data-reveal="fade-up">
            Ratings & Reviews
          </h2>
          <div className="space-y-4 mb-8 sm:mb-10 opacity-0 translate-y-3" data-reveal="fade-up">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 shadow-sm p-4 bg-neutral-50 transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-800">{r.name}</strong>
                  <Stars n={r.rating} />
                </div>
                <p className="text-sm text-slate-600 mt-1">{r.text}</p>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSubmitReview}
            className="rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm opacity-0 translate-y-3"
            data-reveal="fade-up"
            style={{ background: 'var(--bg)' }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Write a Review</h3>
            <input
              type="text"
              placeholder="Your name"
              className="w-full mb-3 px-3 py-2 border rounded-lg text-sm"
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              style={{ background: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
            />
            <textarea
              placeholder="Your review..."
              className="w-full mb-3 px-3 py-2 border rounded-lg text-sm"
              rows={3}
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              style={{ background: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
            />
            <div className="flex items-center gap-3 mb-3">
              <label className="text-sm">Rating:</label>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                style={{ background: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} Star{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-customTeal text-white font-semibold hover:bg-customTeal-dark transition-transform duration-200 hover:-translate-y-0.5"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>

      {/* ------ local animation CSS (scoped) ------ */}
      <style>{`
        /* keyframes */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%   { transform: translateY(0) translateX(0); opacity: .6; }
          50%  { transform: translateY(-8px) translateX(4px); opacity: .9; }
          100% { transform: translateY(0) translateX(0); opacity: .6; }
        }
        .animate-in { animation: fadeUp .6s cubic-bezier(.22,.61,.36,1) forwards; }
        .animate-delay-0   { animation-delay: 0ms; }
        .animate-delay-100 { animation-delay: 100ms; }
        .animate-delay-200 { animation-delay: 200ms; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @media (max-width: 640px) {
          .xs\\:text-2xl { font-size: 1.5rem !important; }
          .xs\\:text-4xl { font-size: 2.25rem !important; }
          .xs\\:text-sm { font-size: 0.875rem !important; }
          .xs\\:gap-6 { gap: 1.5rem !important; }
          .xs\\:gap-4 { gap: 1rem !important; }
          .xs\\:p-3 { padding: 0.75rem !important; }
          .xs\\:py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
          .xs\\:px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
          .xs\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
      `}</style>
    </div>
  );
}

/* ---------- reusable components ---------- */
function ServiceCard({ icon, title, desc }) {
  return (
    <div className="rounded-xl p-5 sm:p-6 bg-white shadow border hover:shadow-lg transition text-left hover:-translate-y-0.5 duration-200">
      <div className="mb-3 transition-transform duration-200 group-hover:scale-105">{icon}</div>
  <h4 className="text-base sm:text-lg font-bold text-customTeal">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-600 mt-1">{desc}</p>
    </div>
  );
}

function DestinationCard({ title, img, location }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow group transition-transform duration-200 hover:-translate-y-0.5">
      <img
        src={img}
        alt={title}
        className="h-48 sm:h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4 bg-white">
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-slate-500 text-sm">{location}</p>
      </div>
    </div>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div className="rounded-xl p-5 sm:p-6 bg-neutral-50 shadow border transition-transform duration-200 hover:-translate-y-0.5">
  <div className="text-customTeal text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2">{num}</div>
      <h4 className="text-base sm:text-lg font-bold">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-600 mt-1">{desc}</p>
    </div>
  );
}

function PackageCard({ title, img, summary, rating }) {
  return (
    <div className="rounded-xl overflow-hidden shadow border bg-white group transition-transform duration-200 hover:-translate-y-0.5">
      <img
        src={img}
        alt={title}
        className="h-52 sm:h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4">
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-slate-600 text-sm line-clamp-2">{summary}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-yellow-500">⭐</span>
          <span className="text-sm">{rating}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stars ---------- */
function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="w-4 h-4" fill={i <= n ? "currentColor" : "none"} stroke="currentColor">
          <path d="M10 1l2.6 5.3 5.9.9-4.2 4.2 1 5.8L10 14.8 4.7 17l1-5.8L1.5 7.2l5.9-.9L10 1z" />
        </svg>
      ))}
    </div>
  );
}

/* ---------- SVG Icons (green vector set) ---------- */
function IconGlobe({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
    </svg>
  );
}
function IconHotel({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M7 11h4M7 15h4M15 11h2M15 15h2M3 19h18M12 7V5M8 7V5M16 7V5" />
    </svg>
  );
}
function IconBike({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6.5" cy="16.5" r="3.5" />
      <circle cx="17.5" cy="16.5" r="3.5" />
      <path d="M6.5 16.5l4-7h4l3 7M10.5 9.5l2 4M14.5 9.5l1.5 3.5M12 6.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  );
}
