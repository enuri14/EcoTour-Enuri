import express from "express";
import cors from "cors";
import { z } from "zod";
import { tours, bookings, nextTourId, nextBookingId } from "./memory-db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cors({ 
  origin: [
    "http://localhost:5173", 
    "https://eco-venture-8d4b1.web.app",
    "https://eco-venture-8d4b1.firebaseapp.com"
  ] 
}));

// Simple admin auth middleware
function requireAdmin(req, res, next) {
  const secret = req.headers["x-admin-secret"];
  if (secret !== "admin123") return res.status(403).json({ error: "Admin only" });
  next();
}

// Validation schemas
const TourSchema = z.object({
  category: z.string().min(1).max(50),
  name: z.string().min(1).max(150),
  description: z.string().min(1),
  slots: z.number().int().positive(),
  image: z.string().optional()
});

const BookingSchema = z.object({
  tourId: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  participants: z.number().int().positive()
});

// Routes

// GET /api/tours
app.get("/api/tours", (req, res) => {
  res.json(tours);
});

// GET /api/tours/:id
app.get("/api/tours/:id", (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find(t => t.id === id);
  if (!tour) return res.status(404).json({ error: "Tour not found" });
  res.json(tour);
});

// POST /api/tours (admin only)
app.post("/api/tours", requireAdmin, (req, res) => {
  try {
    const parsed = TourSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    
    const newTour = {
      id: nextTourId++,
      ...parsed.data
    };
    tours.push(newTour);
    res.status(201).json(newTour);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/tours/:id (admin only)
app.put("/api/tours/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const tourIndex = tours.findIndex(t => t.id === id);
  if (tourIndex === -1) return res.status(404).json({ error: "Tour not found" });
  
  const parsed = TourSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  
  tours[tourIndex] = { id, ...parsed.data };
  res.json(tours[tourIndex]);
});

// DELETE /api/tours/:id (admin only)
app.delete("/api/tours/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const tourIndex = tours.findIndex(t => t.id === id);
  if (tourIndex === -1) return res.status(404).json({ error: "Tour not found" });
  
  tours.splice(tourIndex, 1);
  res.json({ ok: true });
});

// GET /api/bookings (admin only)
app.get("/api/bookings", requireAdmin, (req, res) => {
  res.json(bookings);
});

// POST /api/bookings
app.post("/api/bookings", (req, res) => {
  try {
    const parsed = BookingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    
    const tour = tours.find(t => t.id === parsed.data.tourId);
    if (!tour) return res.status(404).json({ error: "Tour not found" });
    
    const newBooking = {
      id: nextBookingId++,
      ...parsed.data,
      tourName: tour.name,
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "EcoVenture API is running!",
    endpoints: {
      tours: "/api/tours",
      bookings: "/api/bookings"
    }
  });
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`🌿 EcoVenture API running on port ${PORT}`);
});