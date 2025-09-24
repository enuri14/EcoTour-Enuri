// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* storage helpers */
const getUsers = () => {
  try { return JSON.parse(localStorage.getItem("eco_users") || "[]"); }
  catch { return []; }
};
const saveUsers = (arr) => localStorage.setItem("eco_users", JSON.stringify(arr));
const saveAuth = (user) => localStorage.setItem("eco_auth_user", JSON.stringify(user));
const validateEmail = (e = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    city: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Please enter your full name.");
    if (!validateEmail(form.email)) return setError("Please enter a valid email.");
    if (!form.username.trim()) return setError("Pick a username.");
    if (form.username.trim().toLowerCase() === "admin")
      return setError("Username 'admin' is reserved.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (!form.terms) return setError("You must accept the Terms & Privacy.");

    // uniqueness
    const users = getUsers();
    if (users.some((u) => u.username?.toLowerCase() === form.username.trim().toLowerCase()))
      return setError("That username is already taken.");
    if (users.some((u) => u.email?.toLowerCase() === form.email.trim().toLowerCase()))
      return setError("An account with this email already exists.");

    try {
      setBusy(true);
      await new Promise((r) => setTimeout(r, 600));

      const user = {
        role: "user",
        name: form.name.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        password: form.password, // demo only (not secure)
      };
      saveUsers([...users, user]);

      // auto-sign-in for convenience
      const { password, ...safe } = user;
      saveAuth(safe);
      // Trigger auth change event to update navbar
      window.dispatchEvent(new Event("auth-change"));
      navigate("/");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-64px)] flex items-center justify-center bg-gradient-to-b from-customTeal/10 to-customTeal/20 px-4 py-8">
      <div className="w-full max-w-3xl lg:max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl border border-customTeal/10 bg-white/95 backdrop-blur dark:border-gray-700">
          {/* Left: form */}
          <section className="p-6 sm:p-10 max-h-[calc(100dvh-120px)] overflow-y-auto bg-white dark:bg-gray-900 dark:border-r dark:border-gray-700">
            <div className="flex flex-col items-center justify-center gap-3 mb-6">
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

            <h2 className="text-center text-3xl font-extrabold text-customTeal dark:text-emerald-400">Create your account</h2>
            <p className="text-center text-sm text-slate-600 mt-2 dark:text-slate-300">
              Full name, email, username, phone and home city — that’s it.
            </p>

            {error && (
              <div role="alert" className="mt-6 rounded-xl border border-red-300/70 bg-red-50 text-red-700 px-4 py-3 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mt-6">
              <Field id="name" label="Full name" placeholder="Jane Doe" value={form.name}
                     onChange={(v) => update("name", v)} />

              <Field
                id="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(v) => update("email", v)}
                className="sm:col-span-2"
                inputClassName="w-full h-12 rounded-xl border border-slate-300 bg-white dark:bg-gray-800 px-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoComplete="email"
              />

              <Field id="username" label="Username" placeholder="janedoe" value={form.username}
                     onChange={(v) => update("username", v)} />

              <Field id="phone" label="Phone (optional)" placeholder="+44 7123 456789" value={form.phone}
                     onChange={(v) => update("phone", v)} />

              <Field id="city" label="Home city" placeholder="Manchester" value={form.city}
                     onChange={(v) => update("city", v)} className="sm:col-span-2" />

              <PasswordField
                id="password"
                label="Password"
                placeholder="Create a password"
                value={form.password}
                onChange={(v) => update("password", v)}
                show={showPwd}
                setShow={setShowPwd}
                className="sm:col-span-2"
                inputClassName="w-full h-12 rounded-xl border border-slate-300 bg-white dark:bg-gray-800 pr-12 px-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <PasswordField
                id="confirm"
                label="Confirm password"
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={(v) => update("confirm", v)}
                show={showConfirm}
                setShow={setShowConfirm}
                className="sm:col-span-2"
                inputClassName="w-full h-12 rounded-xl border border-slate-300 bg-white dark:bg-gray-800 pr-12 px-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="sm:col-span-2 flex flex-col gap-3">
                <label className="inline-flex items-start gap-3 text-sm text-slate-700">
                  <input type="checkbox"
                         className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                         checked={form.terms}
                         onChange={(e) => update("terms", e.target.checked)} />
                  <span className="leading-5">
                    I agree to the{" "}
                    <Link to="/terms" className="font-semibold text-emerald-600 hover:text-emerald-700">Terms</Link>
                    {" "} &amp; {" "}
                    <Link to="/privacy" className="font-semibold text-emerald-600 hover:text-emerald-700">Privacy</Link>.
                  </span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <button type="submit" disabled={busy}
                        className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-semibold transition transform active:scale-[0.99] shadow-lg shadow-emerald-600/20">
                  {busy ? "Creating account…" : "Create account"}
                </button>
              </div>

              <div className="sm:col-span-2 text-center text-sm text-slate-600 pb-1">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Sign in</Link>
              </div>
            </form>
          </section>

          {/* Right panel (kept) */}
          <aside className="relative hidden lg:block bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800">
            <div className="absolute inset-0 opacity-[0.08]" aria-hidden>
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dots-reg" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots-reg)" />
              </svg>
            </div>
            <div className="relative h-full p-10 text-white flex flex-col items-center justify-center text-center">
              <h3 className="text-2xl font-extrabold">Start your eco-journey</h3>
              <p className="mt-2 text-sm text-white/90 max-w-xs">
                Build your profile so we can match you with the best sustainable tours.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* small UI helpers */
function Label(props) {
  return <label {...props} className={["block text-sm font-medium text-slate-700 mb-1", props.className || ""].join(" ")} />;
}
function Field({ id, label, placeholder, value, onChange, className, inputClassName, type = "text", autoComplete }) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClassName || "w-full h-12 rounded-xl border border-slate-300 bg-white px-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"}
      />
    </div>
  );
}
function PasswordField({ id, label, placeholder, value, onChange, show, setShow, className, inputClassName }) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClassName || "w-full h-12 rounded-xl border border-slate-300 bg-white pr-12 px-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"}
        />
        <button type="button" onClick={() => setShow(!show)} className="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-emerald-600">
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
