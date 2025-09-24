
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import tours from "../data/tours.json";

// ---- external API base (set VITE_API_BASE in the frontend .env) ----
const API = import.meta.env.VITE_API_BASE;

// Coordinates for some UK tour locations
const TOUR_COORDS = {
  "Snowdonia Adventure": { lat: 53.0685, lon: -4.0760 },
  "Lake District Peaks": { lat: 54.4609, lon: -3.0886 },
  "Ben Nevis Trek": { lat: 56.7969, lon: -5.0036 },
  "Yorkshire Dales Explorer": { lat: 54.3080, lon: -2.1990 },
  "Peak District Trails": { lat: 53.2280, lon: -1.7746 },
  "Cotswolds Countryside Ride": { lat: 51.8330, lon: -1.8433 },
  "Hadrian’s Wall Challenge": { lat: 55.0058, lon: -2.2923 },
  "Isle of Wight Coastal Loop": { lat: 50.6938, lon: -1.3047 },
  "Scottish Highlands Ride": { lat: 57.1200, lon: -4.7100 },
  "Cambridge to Ely Path": { lat: 52.2053, lon: 0.1218 },
  "Sherwood Forest Walk": { lat: 53.2065, lon: -1.0630 },
  "Richmond Park Wildlife Tour": { lat: 51.4424, lon: -0.2730 },
  "New Forest Discovery": { lat: 50.8750, lon: -1.6000 },
  "Pembrokeshire Coastal Path": { lat: 51.6736, lon: -5.0933 },
  "Kew Gardens Botanical Tour": { lat: 51.4780, lon: -0.2956 },
};

// Default fallback → London
const FALLBACK = { lat: 51.5072, lon: -0.1276 };

export default function TourDetails() {
  const { id } = useParams();

  // find from internal JSON immediately (fast render)
  const tour = useMemo(
    () => tours.find((t) => String(t.id) === String(id)),
    [id]
  );

  // ---- WEATHER STATE ----
  const [weather, setWeather] = useState(null);
  const [wxError, setWxError] = useState("");

  // ---- AVAILABILITY STATE ----
  // {capacity, booked, available} from /api/availability/:id
  const [availability, setAvailability] = useState(null);
  const [availError, setAvailError] = useState("");

  // Fetch weather (Open-Meteo, no key)
  const fetchWeather = async (lat, lon) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setWeather(data.current_weather);
    } catch (err) {
      console.error("Weather API error:", err);
      setWxError("Couldn’t load weather right now.");
    }
  };

  // Fetch live availability from your backend
  const fetchAvailability = async () => {
    try {
      if (!API) throw new Error("VITE_API_BASE is not set");
      const res = await fetch(`${API}/availability/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); // {tourId, capacity, booked, available}
      setAvailability(data);
      setAvailError("");
    } catch (err) {
      console.error("Availability API error:", err);
      setAvailability(null); // fall back to static slots
      setAvailError("Live availability unavailable; showing capacity only.");
    }
  };

  // WEATHER effect
  useEffect(() => {
    if (!tour) return;
    const preset = TOUR_COORDS[tour.name];
    if (preset) {
      fetchWeather(preset.lat, preset.lon);
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(FALLBACK.lat, FALLBACK.lon),
        { timeout: 8000 }
      );
    } else {
      fetchWeather(FALLBACK.lat, FALLBACK.lon);
    }
  }, [tour]);

  // AVAILABILITY effect
  useEffect(() => {
    if (!tour) return;
    fetchAvailability();
    // optional: refresh every 30s
    const t = setInterval(fetchAvailability, 30000);
    return () => clearInterval(t);
  }, [id, tour]);

  if (!tour) {
    return (
      <p className="text-center mt-10" style={{ color: "var(--text)" }}>
        Tour not found
      </p>
    );
  }

  return (
    <div
      className="max-w-2xl mx-auto p-4 rounded-lg shadow border"
      style={{
        background: "var(--card)",
        color: "var(--text)",
        borderColor: "var(--border)",
      }}
    >
      <img
        src={tour.image}
        alt={tour.name}
        className="w-full h-64 object-cover rounded mb-4"
      />

      <h2 className="text-3xl font-bold mb-2">{tour.name}</h2>
      <p className="mb-4">{tour.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
        <p>
          <span className="font-medium">Category:</span> {tour.category}
        </p>

        {/* Capacity + live availability */}
        <p>
          <span className="font-medium">Capacity:</span> {tour.slots}
          {availability ? (
            <>
              {" "}
              · <span className="font-medium">Available:</span>{" "}
              {availability.available}/{availability.capacity}
            </>
          ) : (
            <span className="opacity-70"> · checking…</span>
          )}
        </p>

        {/* Weather */}
        {weather ? (
          <p>
            <span className="font-medium">Weather:</span>{" "}
            {Math.round(weather.temperature)}°C · wind{" "}
            {Math.round(weather.windspeed)} km/h
          </p>
        ) : (
          <p className="text-gray-500">{wxError || "Loading weather…"}</p>
        )}
      </div>

      {/* Small note if we fell back */}
      {availError && (
        <p className="mt-2 text-xs text-amber-600">{availError}</p>
      )}
    </div>
  );
}
