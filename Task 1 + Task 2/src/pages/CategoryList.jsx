import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import localTours from "../data/tours.json";

const API = import.meta.env.VITE_API_BASE; // e.g. http://localhost:3001/api

// tiny debounce hook to avoid spamming the API while typing
function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function CategoryList() {
  const { category } = useParams();               // from /category/:category
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(qParam);
  const debouncedQuery = useDebounced(query, 300);

  const [tours, setTours] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");

  // local fallback when API unavailable
  const localFiltered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return localTours
      .filter((t) => t.category === category)
      .filter((t) =>
        q
          ? t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
          : true
      );
  }, [category, debouncedQuery]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setStatus("loading");
      setErrorMsg("");
      try {
        if (!API) throw new Error("VITE_API_BASE not set");
        const url = new URL(`${API}/tours`);
        url.searchParams.set("category", category);
        const q = debouncedQuery.trim();
        if (q) url.searchParams.set("search", q);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;

        // if server doesn't implement ?search=, filter client-side as fallback
        const needle = q.toLowerCase();
        const filtered = needle
          ? data.filter(
              (t) =>
                t.name.toLowerCase().includes(needle) ||
                t.description.toLowerCase().includes(needle)
            )
          : data;

        setTours(filtered);
        setStatus("ready");
      } catch (e) {
        if (!alive) return;
        setTours(localFiltered);               // fallback to bundled JSON
        setStatus("error");
        setErrorMsg("Live API unavailable — showing cached/local data.");
        console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, [category, debouncedQuery, localFiltered]);

  // keep URL in sync with search so it’s shareable/back-button friendly
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (query) next.set("q", query);
    else next.delete("q");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const count =
    status === "loading" ? "…" : tours.length === 0 ? "0" : String(tours.length);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          {category?.[0]?.toUpperCase() + category?.slice(1)} Tours
          <span
            className="ml-2 text-xs align-middle px-2 py-0.5 rounded border"
            style={{ borderColor: "var(--border)", color: "var(--textMute)" }}
            aria-label="result count"
          >
            {count}
          </span>
        </h1>
        <div className="flex-1" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or description…"
          className="w-full sm:w-80 px-3 py-2 rounded border outline-none"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
          aria-label="Search tours"
        />
      </div>

      {/* API fallback note */}
      {status === "error" && (
        <p className="mb-3 text-sm text-amber-600">{errorMsg}</p>
      )}

      {/* Empty state */}
      {status !== "loading" && tours.length === 0 && (
        <div
          className="p-6 border rounded text-center"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        >
          <p className="font-medium mb-1">No tours found</p>
          <p className="text-sm opacity-75">
            Try clearing the search or choosing another category.
          </p>
        </div>
      )}

      {/* Grid of cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(status === "loading" ? localFiltered : tours).map((t) => (
          <Link
            key={t.id}
            to={`/tour/${t.id}`}
            className="block border rounded overflow-hidden hover:shadow"
            style={{
              borderColor: "var(--border)",
              background: "var(--card)",
              color: "var(--text)",
            }}
          >
            <img
              src={t.image}
              alt={t.name}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
            <div className="p-3">
              <p className="text-xs uppercase tracking-wide opacity-70">
                {t.category}
              </p>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm opacity-80 mt-1 line-clamp-3">
                {t.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
