// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);



  // Detect authentication from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!window.localStorage.getItem("eco_auth_user");
  });

  // Listen for login/logout changes (including same-tab changes)
  useEffect(() => {
    function syncAuth() {
      setIsAuthenticated(!!window.localStorage.getItem("eco_auth_user"));
    }
    
    // Listen for storage events (cross-tab)
    window.addEventListener("storage", syncAuth);
    
    // Listen for custom auth events (same-tab)
    window.addEventListener("auth-change", syncAuth);
    
    // Check periodically as a fallback
    const interval = setInterval(syncAuth, 1000);
    
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-change", syncAuth);
      clearInterval(interval);
    };
  }, []);

  // Logout handler
  const handleLogout = () => {
    window.localStorage.removeItem("eco_auth_user");
    setIsAuthenticated(false);
    // Trigger custom event to notify other components
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/"; // redirect to home
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [profileOpen]);

  // Dark mode toggle state
  const [darkMode, setDarkMode] = useState(() => {
    return window.localStorage.getItem("theme") === "dark";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    window.localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);



  return (
    <header
      className={[
        "sticky top-0 z-50 backdrop-blur transition-all duration-300",
        scrolled ? "shadow-md" : "shadow-none",
      ].join(" ")}
      style={{ background: '#2c7a7b' }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/pics/logo.jpeg"
              alt="EcoVenture Logo"
              className="w-10 h-10 object-cover rounded-full ring-2 ring-white/20 transition-transform duration-300 hover:scale-105"
            />
            <Link
              to="/"
              className="text-2xl font-extrabold font-merri tracking-wide text-white transition-opacity hover:opacity-90"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              EcoVenture
            </Link>
          </div>

          {/* Center: Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <NavItem to="/" label="Home" activePath={location.pathname} />
            <NavItem to="/tours" label="Tours" activePath={location.pathname} />
            <NavItem to="/about" label="About" activePath={location.pathname} />
          </div>

          {/* Right: Nav actions */}
          <div className="flex items-center gap-2 sm:gap-3" ref={profileRef}>
            {/* Dark/Light mode toggle */}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition ring-0 hover:ring-2 hover:ring-customTeal/60 focus:outline-none focus:ring-2 focus:ring-customTeal/80"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
              onClick={() => setDarkMode((d) => !d)}
            >
              {darkMode ? (
                <span role="img" aria-label="Dark mode">🌙</span>
              ) : (
                <span role="img" aria-label="Light mode">☀️</span>
              )}
            </button>



            {/* Profile button — link to login if not authenticated, dropdown if authenticated */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                aria-label="Login"
                className="w-10 h-10 flex items-center justify-center rounded-full 
                           bg-white/10 hover:bg-white/20 transition 
                           ring-0 hover:ring-2 hover:ring-customTeal/60 focus:outline-none focus:ring-2 focus:ring-customTeal/80"
                title="Login"
              >
                <UserIcon className="w-6 h-6 text-white" />
              </Link>
            ) : (
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center 
                             transition ring-0 hover:ring-2 hover:ring-customTeal/60 focus:outline-none focus:ring-2 focus:ring-customTeal/80"
                  aria-label="Open profile menu"
                  onClick={() => setProfileOpen((s) => !s)}
                >
                  <UserIcon className="w-6 h-6 text-white" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-lg bg-white text-gray-800 shadow-lg overflow-hidden transform origin-top-right transition-all duration-150">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Desktop Auth buttons */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center gap-2 pl-1">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 font-medium transition
                             hover:text-white ring-0 hover:ring-2 hover:ring-customTeal/60"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg bg-white text-customTeal font-semibold hover:opacity-90 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button (animated X) */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              <div
                className={`w-5 h-0.5 bg-white mb-1 transition-transform duration-300 ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <div
                className={`w-5 h-0.5 bg-white mb-1 transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <div
                className={`w-5 h-0.5 bg-white transition-transform duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 transition-all duration-200 ease-out">
            <MobileLink to="/" onClick={() => setMenuOpen(false)}>
              Home
            </MobileLink>
            <MobileLink to="/tours" onClick={() => setMenuOpen(false)}>
              Tours
            </MobileLink>
            <MobileLink to="/about" onClick={() => setMenuOpen(false)}>
              About
            </MobileLink>

            {/* Mobile row: profile/login quick actions */}
            <div className="flex items-center gap-2 px-4 pt-1">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="flex-1 px-4 py-2 rounded bg-white/10 text-white text-center font-medium hover:bg-white/20 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile / Login
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="flex-1 px-4 py-2 rounded bg-white/10 text-white text-center font-medium hover:bg-white/20 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
            </div>

            {!isAuthenticated ? (
              <div className="pt-2 flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex-1 px-4 py-2 rounded bg-white/10 text-white text-center font-medium hover:bg-white/20 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 px-4 py-2 rounded bg-white text-customTeal text-center font-semibold hover:opacity-90 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <MobileLink to="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </MobileLink>
                <MobileLink to="/bookings" onClick={() => setMenuOpen(false)}>
                  My Bookings
                </MobileLink>
                <button
                  className="block w-full text-left px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20 transition"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

/* ---------- Subcomponents ---------- */
function NavItem({ to, label, activePath }) {
  const isActive =
    (to === "/" && activePath === "/") ||
    (to !== "/" && activePath.startsWith(to));

  return (
    <Link
      to={to}
      aria-current={isActive ? "page" : undefined}
      className={[
  "group relative font-medium focus:outline-none focus:ring-2 focus:ring-customTeal/80 rounded",
        isActive ? "text-white" : "text-white/90 hover:text-white",
        "transition-colors",
      ].join(" ")}
    >
      <span className="inline-block px-1">{label}</span>
      {/* Underline animation w/ green hover accent */}
      <span
        className={[
          "pointer-events-none absolute left-0 -bottom-1 h-[2px] w-full origin-left scale-x-0 bg-white/90 transition-transform duration-300",
          "group-hover:scale-x-100 group-hover:bg-customTeal",
          isActive ? "scale-x-100" : "",
        ].join(" ")}
      />
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20 transition"
    >
      {children}
    </Link>
  );
}

/* ---------- Small SVG icons ---------- */
function UserIcon({ className = "" }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 12c2.761 0 5-2.91 5-6.5S14.761 0 12 0 7 2.91 7 5.5 9.239 12 12 12zm0 2c-4.418 0-8 3.134-8 7v1h16v-1c0-3.866-3.582-7-8-7z" />
    </svg>
  );
}

export default Navbar;
