// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
  <footer className="relative mt-10 border-t border-customTeal/10" style={{ background: 'var(--card)', color: 'var(--text)' }}>
      {/* top wave accent */}
      <div aria-hidden className="pointer-events-none absolute -top-4 left-0 right-0 h-4 bg-[radial-gradient(60%_8px_at_50%_100%,rgba(16,185,129,0.18),transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          {/* Brand + blurb */}
          <div className="flex-1 min-w-[250px]">
            <div className="flex items-center gap-3">
              <img
                src="/pics/logo.jpeg"
                alt="EcoVenture logo"
                className="w-10 h-10 rounded-full ring-2 ring-customTeal/30 object-cover"
                loading="lazy"
                decoding="async"
              />
              <span className="text-xl font-extrabold bg-gradient-to-r from-customTeal to-customTeal-dark bg-clip-text text-transparent">
                EcoVenture
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Eco-friendly adventures across the UK—hiking, cycling, and guided
              nature walks that tread lightly and explore deeply.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Social href="https://twitter.com" label="X/Twitter">
                <IconX className="w-5 h-5" />
              </Social>
              <Social href="https://instagram.com" label="Instagram">
                <IconInstagram className="w-5 h-5" />
              </Social>
              <Social href="https://facebook.com" label="Facebook">
                <IconFacebook className="w-5 h-5" />
              </Social>
              <Social href="mailto:hello@example.com" label="Email">
                <IconMail className="w-5 h-5" />
              </Social>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex-1 min-w-[250px]">
            <h4 className="text-sm font-semibold text-customTeal">
              Subscribe for eco-tips
            </h4>
            <p className="mt-3 text-sm text-slate-600">
              Occasional updates—no spam, just green goodness.
            </p>
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks for subscribing! 🌿");
              }}
            >
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <div className="flex rounded-xl ring-1 ring-customTeal/20 bg-white shadow-sm focus-within:ring-customTeal">
                <span className="pl-3 flex items-center text-slate-400">
                  <IconMail className="w-5 h-5" />
                </span>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-l-xl bg-transparent outline-none text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-r-xl bg-customTeal hover:bg-customTeal-dark text-white text-sm font-semibold transition"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>

        {/* bottom bar */}
  <div className="mt-6 border-t border-customTeal/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} EcoVenture. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/terms"
              className="text-customTeal hover:text-customTeal-dark font-medium"
            >
              Terms
            </Link>
            <span className="text-slate-400">•</span>
            <Link
              to="/privacy"
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              Privacy
            </Link>
            <span className="text-slate-400">•</span>
            <Link
              to="/accessibility"
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              Accessibility
            </Link>
          </div>
      </div>
    </footer>
  );
}

/* ---------- small parts ---------- */
function Li({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="hover:text-emerald-700 transition"
        style={{ color: 'var(--text)' }}
      >
        {children}
      </Link>
    </li>
  );
}

function Social({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-full w-9 h-9 ring-1 ring-emerald-600/20 text-emerald-700 hover:bg-emerald-50 transition"
      title={label}
      style={{ background: 'var(--card)' }}
    >
      {children}
    </a>
  );
}

/* ---------- icons (inline SVG) ---------- */
function IconMail({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.8" />
      <path d="M3 7l9 6 9-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconFacebook({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 10h3V7h-3c-1.7 0-3 1.3-3 3v2H8v3h2v6h3v-6h2.4l.6-3H13v-2c0-.6.4-1 1-1z" />
    </svg>
  );
}
function IconInstagram({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM18 6.3a1 1 0 110 2 1 1 0 010-2z" />
    </svg>
  );
}
function IconX({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3l7.7 9.1L3.6 21h2.4l6.1-6.9 4.9 6.9H21l-8-11L20.4 3H18l-5.7 6.5L8 3H3z" />
    </svg>
  );
}
