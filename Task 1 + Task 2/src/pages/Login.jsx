// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* helpers */
const isEmail = (v = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const getUsers = () => {
  try { return JSON.parse(localStorage.getItem("eco_users") || "[]"); }
  catch { return []; }
};
const saveAuth = (user) => localStorage.setItem("eco_auth_user", JSON.stringify(user));

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");         // email OR username
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!id.trim()) return setError("Enter your email or username.");
    if (pwd.length < 6) return setError("Password must be at least 6 characters.");

    // 1) Admin shortcut
    if (id.trim().toLowerCase() === "admin" && pwd === "admin123") {
      const adminUser = {
        role: "admin",
        username: "admin",
        name: "Admin",
        email: "admin@ecoventure.local",
      };
      saveAuth(adminUser);
      if (remember) localStorage.setItem("eco_last_id", id);
      else localStorage.removeItem("eco_last_id");
      // Trigger auth change event to update navbar
      window.dispatchEvent(new Event("auth-change"));
      return navigate("/admin"); // make sure you have an /admin route
    }

    // 2) Regular users (stored in localStorage by Register.jsx)
    try {
      setBusy(true);
      await new Promise((r) => setTimeout(r, 500));
      const users = getUsers();
      const found = users.find((u) => {
        if (isEmail(id)) return u.email?.toLowerCase() === id.trim().toLowerCase();
        return u.username?.toLowerCase() === id.trim().toLowerCase();
      });
      if (!found || found.password !== pwd) {
        throw new Error("Invalid credentials. Check your details and try again.");
      }
      // save logged-in
      const { password, ...safe } = found;
      saveAuth(safe);
      if (remember) localStorage.setItem("eco_last_id", id);
      else localStorage.removeItem("eco_last_id");
      // Trigger auth change event to update navbar
      window.dispatchEvent(new Event("auth-change"));
      navigate("/"); // home
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-64px)] flex items-center justify-center bg-gradient-to-b from-customTeal/10 to-customTeal/20 px-4">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl shadow-2xl border border-customTeal/10 bg-white dark:bg-gray-900 backdrop-blur p-6 sm:p-8 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-merri leading-tight tracking-tight mb-2"
                style={{ color: '#2c7a7b', fontFamily: 'Merriweather, serif' }}>
              Your next green escape awaits
            </h1>
            <div className="flex items-center gap-3">
              <img src="/pics/logo.jpeg" alt="EcoVenture Logo"
                   className="w-10 h-10 rounded-full ring-2 ring-customTeal/40 object-contain" />
              <span className="text-2xl font-extrabold font-merri tracking-wide"
                    style={{ color: '#2c7a7b', fontFamily: 'Merriweather, serif' }}>
                EcoVenture
              </span>
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold text-customTeal dark:text-emerald-400">Sign in</h2>
          <p className="text-center text-sm text-slate-600 mt-1 dark:text-slate-300">Use your email or username.</p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 text-red-700 px-4 py-2 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email or Username
              </label>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="you@example.com or yourusername"
                className="w-full rounded-xl border border-slate-300 bg-white dark:bg-gray-800 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link to="/forgot" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="Your password"
                  className="w-full rounded-xl border border-slate-300 bg-white dark:bg-gray-800 pr-12 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg text-sm text-slate-600 hover:text-emerald-600"
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/register" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                Create account
              </Link>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-semibold py-3 transition transform active:scale-[0.99] shadow-lg shadow-emerald-600/20"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs mt-4 text-slate-600 dark:text-slate-300">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Terms
            </Link>{" "}
            &{" "}
            <Link to="/privacy" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Privacy
            </Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
