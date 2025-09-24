// src/pages/Tour.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
      // We treat `slots` as "remaining seats"
      slots: t.slots ?? 0,
      location: t.location || "",
      rating: Number.isFinite(t.rating) ? Number(t.rating) : 4.8,
      price: t.price ?? null,
      days: t.days ?? t.duration ?? null,
      difficulty: t.difficulty || t.level || "",
      regFee: t.regFee ?? 10, // optional registration fee per person
    };
  });
}

const Badge = ({ children, className = "" }) => (
  <span className={`inline-block rounded-full bg-customTeal/10 text-customTeal text-[11px] font-semibold px-2 py-0.5 ring-1 ring-customTeal/20 ${className}`}>
    {children}
  </span>
);

/* ===================================================== */

export default function Tour() {
  const [allTours, setAllTours] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  // auth gate states
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [isAuthed, setIsAuthed] = useState(() => !!localStorage.getItem("eco_auth_user"));

  useEffect(() => {
    const onStorage = () => setIsAuthed(!!localStorage.getItem("eco_auth_user"));
    const onFocus = () => setIsAuthed(!!localStorage.getItem("eco_auth_user"));
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  async function fetchTours() {
    try {
      const res = await fetch("http://localhost:3001/api/tours");
      if (!res.ok) throw new Error("Failed to fetch tours");
      const tours = await res.json();
      setAllTours(mapTours(tours));
    } catch {
      setAllTours([]);
    }
  }

  useEffect(() => {
    fetchTours();
  }, []);

  const categories = useMemo(() => {
    const s = new Set(allTours.map((t) => t.category || "Other"));
    return ["All", ...Array.from(s).sort((a, b) => a.localeCompare(b))];
  }, [allTours]);

  /* ---------- filters ---------- */
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortKey, setSortKey] = useState("featured"); // featured | rating | az | za

  const filtered = useMemo(() => {
    let list = [...allTours];

    const term = q.trim().toLowerCase();
    if (term) {
      list = list.filter((t) =>
        [t.title, t.summary, t.location, t.tag].join(" ").toLowerCase().includes(term)
      );
    }
    if (category !== "All") {
      list = list.filter((t) => (t.category || "Other") === category);
    }
    if (minRating > 0) {
      list = list.filter((t) => (t.rating ?? 0) >= minRating);
    }
    if (onlyAvailable) {
      list = list.filter((t) => (t.slots ?? 0) > 0);
    }
    switch (sortKey) {
      case "rating":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "az":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    return list;
  }, [allTours, q, category, minRating, onlyAvailable, sortKey]);

  return (
    <main className="text-slate-900">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-customTeal to-customTeal-dark">
        <div className="absolute inset-0 opacity-[0.08]" aria-hidden>
          <HeroDots />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/30">
                <Pin className="w-4 h-4" /> United Kingdom
              </span>
              <h1 className="mt-3 text-5xl sm:text-6xl lg:text-7xl font-extrabold font-merri leading-tight tracking-tight" style={{ color: '#2c7a7b', fontFamily: 'Merriweather, serif' }}>
                Your next green escape awaits
              </h1>
              <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold font-merri leading-tight tracking-tight" style={{ color: '#2c7a7b', fontFamily: 'Merriweather, serif' }}>
                Find your next eco-adventure
              </h2>
              <p className="mt-2 text-white/90 max-w-lg">
                Hike wild ridgelines, cycle coastal paths, and join guided nature walks—picked for scenery and sustainability.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                <img src="/pics/3.jpg" alt="" className="w-full h-60 md:h-72 object-cover opacity-95" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <section className="bg-white border-b border-emerald-900/10 sticky top-[64px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search */}
            <div className="md:col-span-5">
              <label className="sr-only">Search</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <SearchIcon className="w-5 h-5" />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name, location, or keyword…"
                  className="w-full h-11 rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Category */}
            <div className="md:col-span-3">
              <label className="sr-only">Category</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <CategoryIcon className="w-5 h-5" />
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 appearance-none rounded-xl border border-slate-300 bg-white pl-11 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={`cat-${c}`}>{c}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 inset-y-0 my-auto text-slate-400">▾</span>
              </div>
            </div>

            {/* Availability toggle */}
            <div className="md:col-span-12">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                Show only tours with open slots
              </label>
              {(q || category !== "All" || minRating > 0 || onlyAvailable) && (
                <button
                  onClick={() => {
                    setQ("");
                    setCategory("All");
                    setMinRating(0);
                    setOnlyAvailable(false);
                    setSortKey("featured");
                  }}
                  className="ml-3 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== RESULTS ===== */}
      <section className="bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-emerald-700">
              {filtered.length} tour{filtered.length === 1 ? "" : "s"} found
            </h2>
            <p className="text-sm text-slate-600">
              Showing curated eco-friendly options across the UK.
            </p>
          </div>

          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t) => (
                <TourCard
                  key={t.id}
                  {...t}
                  onBook={() => {
                    if (!isAuthed) {
                      setShowAuthGate(true);
                      return;
                    }
                    setSelectedTour(t);
                    setShowBooking(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Auth Gate */}
      <AuthGateModal open={showAuthGate} onClose={() => setShowAuthGate(false)} />

      {/* Booking Modal */}
      <BookingModal
        open={showBooking}
        onClose={() => setShowBooking(false)}
        tour={selectedTour}
        onBooked={fetchTours}
      />
    </main>
  );
}

/* =================== UI Pieces =================== */

function TourCard({ title, img, to, summary, rating, location, tag, category, price, days, slots, difficulty, onBook }) {
  const remaining = Math.max(0, Number(slots ?? 0));
  const isFull = remaining <= 0;

  return (
    <div className="rounded-2xl overflow-hidden border border-emerald-900/10 bg-white shadow group hover:shadow-lg transition">
      <div className="relative">
        <img src={img} alt={title} className="h-48 w-full object-cover group-hover:scale-[1.02] transition" />
        {!isFull ? (
          <Badge className="absolute left-3 top-3 bg-emerald-600 text-white ring-white/20">Remaining: {remaining}</Badge>
        ) : (
          <Badge className="absolute left-3 top-3 bg-rose-600 text-white ring-white/20">Full / Waitlist</Badge>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          {category && <Badge>{category}</Badge>}
          {difficulty && <Badge className="bg-emerald-50">{difficulty}</Badge>}
          {tag && <Badge className="bg-emerald-50">{tag}</Badge>}
        </div>

        <h3 className="font-bold text-slate-900 line-clamp-1">{title}</h3>
        <p className="text-sm text-slate-600 line-clamp-2 mt-0.5">{summary}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center text-emerald-600">
              <MapPin className="w-4 h-4" />
            </span>
            <span className="text-sm text-slate-700 line-clamp-1">{location || "UK"}</span>
          </div>
          <div className="flex items-center gap-1">
            <StarDisplay value={rating} />
            <span className="text-sm text-slate-700">{rating?.toFixed ? rating.toFixed(1) : rating}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-slate-700">
            {days ? <span>{days} day{days > 1 ? "s" : ""}</span> : <span>Flexible</span>}
            {price != null && <span className="ml-2 font-semibold text-emerald-700">£{price}</span>}
          </div>
          <div>
            <Link
              to={to}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white text-sm font-semibold px-3 py-2 hover:bg-emerald-700 transition"
            >
              View <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              className="ml-2 inline-flex items-center gap-1 rounded-lg bg-indigo-600 text-white text-sm font-semibold px-3 py-2 hover:bg-indigo-700 transition"
              disabled={isFull}
              onClick={onBook}
              title={isFull ? "Tour is full" : "Book the Tour"}
            >
              Book the Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== Booking Modal — Bank Transfer only =================== */

function BookingModal({ open, onClose, tour, onBooked }) {
  // hooks at the top (no conditional hooks errors)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    seats: 1,
    amount: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Get logged-in user email
  const authUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("eco_auth_user") || "null");
    } catch {
      return null;
    }
  })();
  const loggedInEmail = authUser?.email?.toLowerCase() || "";

  const remaining = Math.max(0, Number(tour?.slots ?? 0));
  const available = remaining > 0;
  const regFee = Number(tour?.regFee ?? 10);

  // Calculate total fee based on seats and regFee
  const totalCalc = regFee * Number(form.seats || 0);

  useEffect(() => {
    if (open && tour) {
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        seats: available ? 1 : 0,
        amount: regFee * (available ? 1 : 0), // set initial amount
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
      });
      setToast(null);
    }
  }, [open, tour, available, regFee]);

  // Update amount when seats change
  useEffect(() => {
    setForm((f) => ({
      ...f,
      amount: regFee * Number(f.seats || 0),
    }));
  }, [form.seats, regFee]);

  if (!open || !tour) return null;

  const remainingAfter = Math.max(0, remaining - Number(form.seats || 0));

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function showDeviceNotification(title, body) {
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg) {
        if (Notification.permission !== "granted") {
          await Notification.requestPermission();
        }
        if (Notification.permission === "granted") {
          reg.showNotification(title, {
            body,
            icon: "/icons/icon-192x192.png",
            badge: "/icons/icon-192x192.png",
          });
          return;
        }
      }
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body });
      }
    } catch {}
  }

  // Only allow booking if all required fields are entered
  const isEmailEntered = form.email.trim().length > 0;
  const isCardEntered = form.cardNumber.trim().length > 0;
  const isExpiryEntered = form.cardExpiry.trim().length > 0;
  const isCvvEntered = form.cardCvv.trim().length > 0;
  const disabled =
    !available ||
    !form.name ||
    !form.email ||
    !form.phone ||
    !form.address ||
    !form.seats ||
    Number(form.seats) < 1 ||
    Number(form.seats) > remaining ||
    !isEmailEntered ||
    !isCardEntered ||
    !isExpiryEntered ||
    !isCvvEntered;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isEmailEntered) {
      setToast({ type: "error", text: "Please enter your email to book a tour." });
      await showDeviceNotification(
        "Booking failed",
        "Please enter your email and try again. Thank you."
      );
      return;
    }
    if (!isCardEntered || !isExpiryEntered || !isCvvEntered) {
      setToast({ type: "error", text: "Please enter all payment details." });
      return;
    }
    if (disabled) return;

    setLoading(true);
    setToast(null);

    const seats = Number(form.seats);
    if (!Number.isFinite(seats) || seats < 1) {
      setToast({ type: "error", text: "Please enter a valid number of people." });
      setLoading(false);
      return;
    }
    if (seats > remaining) {
      setToast({ type: "error", text: `Only ${remaining} seat${remaining === 1 ? "" : "s"} left.` });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: Number(tour.id),
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          customerAddress: form.address,
          seats,
          paymentMethod: "bank-transfer",
          paidAmount: Number(form.amount) || 0,
          cardLast4: String(form.cardNumber || "").replace(/\s+/g, "").slice(-4) || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.[0]?.message || data?.error || "Booking failed.");

      setToast({ type: "success", text: "Booking successful! We’ve sent a notification." });
      await showDeviceNotification(
        "EcoVenture — Booking confirmed",
        remainingAfter === 0
          ? `You're in for "${tour.title}". The tour is now fully booked.`
          : `You're in for "${tour.title}". ${remainingAfter} seat(s) remain.`
      );

      onBooked?.(); // refresh seats
    } catch (err) {
      setToast({ type: "error", text: String(err.message || err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* header */}
        <div className="p-5 border-b">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Book: <span className="text-indigo-600">{tour.title}</span>
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 ring-1 ring-indigo-200">
                  Availability: {available ? "Available" : "Full"}
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 ring-1 ring-emerald-200">
                  Remaining seats: {remaining}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-50 text-slate-700 text-xs font-semibold px-2 py-1 ring-1 ring-slate-200">
                  After this booking: {remainingAfter}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg px-3 py-1 hover:bg-slate-100 text-slate-600">✕</button>
          </div>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={onChange}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              name="seats"
              type="number"
              min={1}
              max={remaining}
              placeholder="How many people?"
              value={form.seats}
              onChange={onChange}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={onChange}
            required
            rows={2}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Payment — Bank transfer + simple card fields (demo) */}
          <div className="rounded-xl border p-4">
            <p className="text-sm font-semibold text-slate-800">Payment (Bank transfer)</p>
            <p className="text-xs text-slate-600 mt-1">
              Transfer to: <b>EcoVenture Ltd</b>, Sort: <b>04-00-04</b>, Acc: <b>12345678</b>.<br />
              Use your full name as the reference.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <input
                name="amount"
                type="number"
                min="0"
                placeholder={`Registration fee (£${regFee} x people)`}
                value={totalCalc}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
              <input
                name="cardNumber"
                inputMode="numeric"
                placeholder="Card number (demo)"
                value={form.cardNumber}
                onChange={onChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={form.cardExpiry}
                  onChange={onChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  name="cardCvv"
                  inputMode="numeric"
                  placeholder="CVV"
                  value={form.cardCvv}
                  onChange={onChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Note: Demo only — no real payment is processed.<br />
              <b>Total to transfer: £{totalCalc || 0}</b>
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || !available || disabled}
            className="w-full rounded-xl bg-indigo-600 text-white font-semibold py-2.5 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Booking…" : "Confirm Booking"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-sm text-slate-500 underline mt-1"
          >
            Cancel
          </button>
        </form>

        {/* toast */}
        {toast && (
          <div className={`mx-5 mb-5 rounded-lg px-3 py-2 text-sm font-medium ${
            toast.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
          }`}>
            {toast.text}
          </div>
        )}
      </div>
    </div>
  );
}

/* =================== Auth Gate Modal =================== */

function AuthGateModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
        <h3 className="text-xl font-bold text-slate-900">Please register first</h3>
        <p className="mt-2 text-sm text-slate-600">
          You need an account to book a tour. Please make an account and come back.
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/register" className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5">
            Create account
          </Link>
          <Link to="/login" className="w-full rounded-xl ring-1 ring-slate-200 font-semibold py-2.5">
            Sign in
          </Link>
        </div>
        <button onClick={onClose} className="mt-4 text-sm text-slate-500 underline">Close</button>
      </div>
    </div>
  );
}

/* =================== Tiny SVGs =================== */

function SearchIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
      <path d="M20 20l-3.5-3.5" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function CategoryIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="8" height="8" rx="2" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="8" rx="2" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="2" strokeWidth="1.8" />
      <rect x="13" y="13" width="8" height="8" rx="2" strokeWidth="1.8" />
    </svg>
  );
}
function StarIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 1l2.6 5.3 5.9.9-4.2 4.2 1 5.8L10 14.8 4.7 17l1-5.8L1.5 7.2l5.9-.9L10 1z" />
    </svg>
  );
}
function MapPin({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 22s7-5.2 7-12a7 7 0 10-14 0c0 6.8 7 12 7 12z" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.5" strokeWidth="1.8" />
    </svg>
  );
}
function Pin({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 22s6-4.5 6-10.5A6 6 0 006 11.5C6 17.5 12 22 12 22z" strokeWidth="1.8" />
      <circle cx="12" cy="11.5" r="2.3" strokeWidth="1.8" />
    </svg>
  );
}
function ArrowRight({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M5 12h14M13 5l7 7-7 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function HeroDots() {
  return (
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots-tours" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots-tours)" />
    </svg>
  );
}
function StarDisplay({ value = 0 }) {
  const n = Math.round(value);
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="w-4 h-4" fill={i <= n ? "currentColor" : "none"} stroke="currentColor">
          <path d="M10 1l2.6 5.3 5.9.9-4.2 4.2 1 5.8L10 14.8 4.7 17l1-5.8L1.5 7.2l5.9-.9L10 1z" />
        </svg>
      ))}
    </div>
  );
}
function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-emerald-300 bg-white p-10 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 grid place-items-center ring-1 ring-emerald-600/20">
        <SearchIcon className="w-6 h-6 text-emerald-600" />
      </div>
      <h3 className="mt-3 text-lg font-bold text-emerald-700">No tours match your filters</h3>
      <p className="text-sm text-slate-600 mt-1">
        Try clearing filters or searching with a different keyword.
      </p>
    </div>
  );
}
