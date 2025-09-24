      {/* ===== IMPACT SO FAR ===== */}
      <section className="bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-customTeal text-center">The Impact So Far</h2>
          <p className="mt-2 text-center text-slate-600 max-w-2xl mx-auto">
            Adventures that give back—measured not just in miles, but in moments.
          </p>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5">
            <Stat kpi="12k+" label="Happy travellers" />
            <Stat kpi="350+" label="Guided trips run" />
            <Stat kpi="92%" label="Local partners" />
            <Stat kpi="24t" label="CO₂ offset (2024)" />
          </div>
        </div>
      </section>
      {/* ===== TEAM ===== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-customTeal text-center">Meet the Team</h2>
          <p className="mt-2 text-center text-slate-600 max-w-2xl mx-auto">
            Local expertise with a global perspective.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TeamCard name="Amelia Hart" role="Head Guide" img="/pics/2.jpg" />
            <TeamCard name="Hassan Syed" role="Sustainability Lead" img="/pics/3.jpg" />
            <TeamCard name="Maya Green" role="Community Partnerships" img="/pics/4.jpg" />
          </div>
        </div>
      </section>
// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="text-slate-900">
      {/* ===== HERO (split) ===== */}
  <section className="relative overflow-hidden bg-gradient-to-br from-customTeal to-customTeal-dark">
        <div className="absolute inset-0 opacity-[0.08]" aria-hidden>
          <SvgDots />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 grid gap-10 md:gap-12 md:grid-cols-2 items-center">
          {/* Left: Text */}
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/30">
              <LeafIcon className="w-4 h-4" /> Since 2018
            </span>
            <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-extrabold font-merri leading-tight tracking-tight" style={{ color: '#2c7a7b', fontFamily: 'Merriweather, serif' }}>
              About EcoVenture
            </h1>
            <p className="mt-3 text-white/90 text-sm sm:text-base md:text-lg">
              We design low-impact, high-delight outdoor experiences—hiking, cycling, and guided nature walks—across the UK.
              Our mission is simple: help you explore more while leaving less trace.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-customTeal font-semibold px-5 py-3 hover:bg-customTeal/10 transition shadow"
              >
                Browse Tours <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/70 text-white font-semibold px-5 py-3 hover:bg-white/10 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right: Image panel */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
              <img
                src="/pics/2.jpg"
                alt="Eco-friendly trekking"
                className="w-full h-72 object-cover md:h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      {/* ...existing code... */}

      {/* ===== VALUES ===== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid gap-6 md:grid-cols-2">
            <ValueCard
              title="Leave No Trace"
              text="We follow and teach best practices: stick to paths, pack out waste, and respect wildlife."
              bullets={["Small group sizes", "Route rotation", "Habitat-first planning"]}
            />
            <ValueCard
              title="Community First"
              text="We partner with local guides, accommodations, and family-run cafés to keep value in-region."
              bullets={["Fair pay standards", "Local sourcing", "Continuous feedback loops"]}
            />
          </div>
        </div>
      </section>

      {/* ...existing code... */}

      {/* ...existing code... */}

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-gradient-to-r from-emerald-600 to-emerald-700" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 text-center text-white">
          <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to travel lighter?</h3>
          <p className="mt-2 text-white/90 max-w-2xl mx-auto">
            Discover routes, dates, and spaces available this season.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-emerald-700 font-semibold px-5 py-3 hover:bg-emerald-50 transition shadow"
            >
              Explore Tours <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-white/70 text-white font-semibold px-5 py-3 hover:bg-white/10 transition"
            >
              Our Principles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= Small UI blocks ================= */

function Card({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow hover:shadow-lg transition">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 ring-1 ring-emerald-600/20">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-emerald-700">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-700">{children}</p>
    </div>
  );
}

function Stat({ kpi, label }) {
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-5 text-center shadow-sm">
      <div className="text-3xl font-extrabold text-emerald-700">{kpi}</div>
      <div className="mt-1 text-sm text-slate-600">{label}</div>
    </div>
  );
}

function ValueCard({ title, text, bullets = [] }) {
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow">
      <h3 className="text-lg font-bold text-emerald-700">{title}</h3>
      <p className="mt-2 text-sm text-slate-700">{text}</p>
      {!!bullets.length && (
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TimelineItem({ year, title, text }) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
      <div className="absolute left-2 top-6 bottom-[-24px] w-[2px] bg-emerald-100" aria-hidden />
      <div className="text-xs font-semibold text-emerald-700">{year}</div>
      <h4 className="text-base font-bold mt-0.5">{title}</h4>
      <p className="text-sm text-slate-600 mt-1">{text}</p>
    </div>
  );
}

function TeamCard({ name, role, img }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-emerald-900/10 bg-white shadow group">
      <img src={img} alt={name} className="h-48 w-full object-cover group-hover:scale-[1.02] transition" />
      <div className="p-4">
        <h5 className="font-bold">{name}</h5>
        <p className="text-sm text-slate-600">{role}</p>
        <div className="mt-3 flex items-center gap-3">
          <a href="#" className="text-emerald-700 hover:text-emerald-800 text-sm font-medium">LinkedIn</a>
          <a href="#" className="text-emerald-700 hover:text-emerald-800 text-sm font-medium">Email</a>
        </div>
      </div>
    </div>
  );
}

/* ================= Tiny SVGs ================= */

function SvgDots() {
  return (
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots-about" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots-about)" />
    </svg>
  );
}

function LeafIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M3 21s8-1 13.5-6.5S23 3 23 3 11 5 6.5 10.5 3 21 3 21z" strokeWidth="1.8" />
      <path d="M3 21c7-7 10-10 10-10" strokeWidth="1.8" />
    </svg>
  );
}
function ArrowRight({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M5 12h14M13 5l7 7-7 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TargetIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function CompassIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      <path d="M8 16l3-7 5-1-3 7-5 1z" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function ShieldIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 3l8 3v6c0 5-3.5 9-8 9s-8-4-8-9V6l8-3z" strokeWidth="1.8" />
      <path d="M9 12l2 2 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Check({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
