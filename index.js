import "dotenv/config";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { getPool, sql } from "./db.js";

const app = express();
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



// DELETE /api/tours/:id (admin only)
app.delete("/api/tours/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Bad id" });
  const pool = await getPool();
  const r = await pool.request().input("id", sql.Int, id)
    .query("DELETE FROM dbo.Tours WHERE id = @id");
  if (r.rowsAffected[0] === 0) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

// PUT /api/tours/:id (admin only)
app.put("/api/tours/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Bad id" });
  const parsed = TourSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { category, name, description, slots, image } = parsed.data;
  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("category", sql.NVarChar(50), category)
    .input("name", sql.NVarChar(150), name)
    .input("description", sql.NVarChar(sql.MAX), description)
    .input("slots", sql.Int, slots)
  .input("image", sql.NVarChar(sql.MAX), image ?? null)
    .query(`UPDATE dbo.Tours SET category=@category, name=@name, description=@description, slots=@slots, image=@image WHERE id=@id; SELECT * FROM dbo.Tours WHERE id=@id`);
  if (!r.recordset.length) return res.status(404).json({ error: "Not found" });
  res.json(r.recordset[0]);
});
// Duplicate imports removed. Only keep the first block at the top.

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// GET /api/tours?category=hiking&search=lake
app.get("/api/tours", async (req, res) => {
  const category = req.query.category || null;
  const search = (req.query.search || "").trim();

  const pool = await getPool();
  const r = await pool.request()
    .input("category", sql.NVarChar(50), category)
    .input("search", sql.NVarChar(200), `%${search}%`)
    .query(`
      SELECT id, category, name, description, slots, image
      FROM dbo.Tours
      WHERE (@category IS NULL OR category = @category)
        AND (@search = '%%' OR name LIKE @search OR description LIKE @search)
      ORDER BY id
    `);

  res.json(r.recordset);
});

// GET /api/tours/:id
app.get("/api/tours/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Bad id" });
  const pool = await getPool();
  const r = await pool.request().input("id", sql.Int, id)
    .query(`SELECT id, category, name, description, slots, image FROM dbo.Tours WHERE id = @id`);
  if (!r.recordset.length) return res.status(404).json({ error: "Not found" });
  res.json(r.recordset[0]);
});

// POST /api/tours
const TourSchema = z.object({
  category: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  slots: z.number().int().nonnegative(),
  image: z.string().url().optional().or(z.literal("").transform(() => null))
});
app.post("/api/tours", async (req, res) => {
  const parsed = TourSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { category, name, description, slots, image } = parsed.data;
  const pool = await getPool();
  const r = await pool.request()
    .input("category", sql.NVarChar(50), category)
    .input("name", sql.NVarChar(150), name)
    .input("description", sql.NVarChar(sql.MAX), description)
    .input("slots", sql.Int, slots)
    .input("image", sql.NVarChar(sql.MAX), image ?? null)
    .query(`
      INSERT INTO dbo.Tours (category, name, description, slots, image)
      OUTPUT inserted.*
      VALUES (@category, @name, @description, @slots, @image)
    `);
  res.status(201).json(r.recordset[0]);
});

// GET /api/availability/:id
app.get("/api/availability/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Bad id" });
  const pool = await getPool();

  const cap = await pool.request().input("id", sql.Int, id)
    .query(`SELECT slots FROM dbo.Tours WHERE id = @id`);
  if (!cap.recordset.length) return res.status(404).json({ error: "Tour not found" });
  const capacity = cap.recordset[0].slots;

  const b = await pool.request().input("id", sql.Int, id)
    .query(`SELECT ISNULL(SUM(seats), 0) AS booked FROM dbo.Bookings WHERE tourId = @id`);
  const booked = b.recordset[0].booked;

  res.json({ tourId: id, capacity, booked, available: Math.max(capacity - booked, 0) });
});

// POST /api/bookings
const BookingSchema = z.object({
  tourId: z.number().int().positive(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  seats: z.number().int().positive()
});
app.post("/api/bookings", async (req, res) => {
  const parsed = BookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { tourId, customerName, customerEmail, seats } = parsed.data;
  const tx = new sql.Transaction(await getPool());
  try {
    await tx.begin();

    const cap = await new sql.Request(tx).input("id", sql.Int, tourId)
      .query(`SELECT slots FROM dbo.Tours WHERE id = @id`);
    if (!cap.recordset.length) { await tx.rollback(); return res.status(404).json({ error: "Tour not found" }); }
    const capacity = cap.recordset[0].slots;

    const b = await new sql.Request(tx).input("id", sql.Int, tourId)
      .query(`SELECT ISNULL(SUM(seats), 0) AS booked FROM dbo.Bookings WHERE tourId = @id`);
    const booked = b.recordset[0].booked;
    const available = capacity - booked;

    if (seats > available) { await tx.rollback(); return res.status(400).json({ error: `Only ${available} seats left` }); }

    const ins = await new sql.Request(tx)
      .input("tourId", sql.Int, tourId)
      .input("name", sql.NVarChar(100), customerName)
      .input("email", sql.NVarChar(150), customerEmail)
      .input("seats", sql.Int, seats)
      .query(`
        INSERT INTO dbo.Bookings (tourId, customerName, customerEmail, seats)
        OUTPUT inserted.*
        VALUES (@tourId, @name, @email, @seats)
      `);

    await tx.commit();
    res.status(201).json({ booking: ins.recordset[0] });
  } catch (e) {
    try { await tx.rollback(); } catch {}
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.listen(process.env.PORT, () => console.log(`API on http://localhost:${process.env.PORT}`));
