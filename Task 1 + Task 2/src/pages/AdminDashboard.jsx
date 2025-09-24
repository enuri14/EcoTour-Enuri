// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // posting / editing state
  const [tour, setTour] = useState({
    title: "",
    details: "",
    photo: "",
    category: "hiking",
    capacity: "",
  });
  const [postedTours, setPostedTours] = useState([]);
  const [editingTour, setEditingTour] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== guard: must be signed-in admin via normal Login page =====
  useEffect(() => {
    const u = safeGetUser();
    const isAdmin = u && (u.role === "admin" || (u.username || "").toLowerCase() === "admin");
    if (!isAdmin) {
      // bounce to login, then back to /admin after login
      navigate("/login?next=/admin", { replace: true });
      return;
    }
    // fetch once authorized
    fetchTours().finally(() => setLoading(false));
  }, [navigate]);

  // ===== helpers =====
  function safeGetUser() {
    try {
      return JSON.parse(localStorage.getItem("eco_auth_user") || "null");
    } catch {
      return null;
    }
  }

  async function fetchTours() {
    try {
      const res = await fetch("http://localhost:3001/api/tours");
      if (!res.ok) throw new Error("Failed to fetch tours");
      const tours = await res.json();
      setPostedTours(tours);
    } catch {
      setPostedTours([]);
    }
  }

  function handleTourChange(e) {
    const { name, value } = e.target;
    setTour((t) => ({ ...t, [name]: value }));
  }

  function handleTourPhoto(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setTour((t) => ({ ...t, photo: ev.target.result }));
      reader.readAsDataURL(file);
    }
  }

  function handleEditTour(t) {
    setEditingTour({
      id: t.id,
      title: t.name || t.title || "",
      details: t.description || t.details || "",
      photo: t.image || t.photo || "",
      category: t.category || "hiking",
      capacity: t.slots || t.capacity || 0, // treat `slots` as remaining/capacity field
    });
  }

  async function handlePostTour(e) {
    e.preventDefault();
    if (!tour.title || !tour.details || !tour.photo || !tour.category || !tour.capacity) {
      alert("Please fill all fields, add a photo, select category, and set capacity.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: tour.category,
          name: tour.title,
          description: tour.details,
          slots: Number(tour.capacity),
          image: tour.photo,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Error posting tour: " + (err.error?.message || JSON.stringify(err)));
        return;
      }
      setTour({ title: "", details: "", photo: "", category: "hiking", capacity: "" });
      alert("Tour posted for users!");
      fetchTours();
    } catch (err) {
      alert("Failed to post tour: " + err.message);
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    const t = editingTour;
    if (!t.title || !t.details || !t.photo || !t.category || !t.capacity) {
      alert("Please fill all fields, add a photo, select category, and set capacity.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/api/tours/${t.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // demo-only secret (client-side) — keep your current backend check if needed
          "x-admin-secret": "admin123",
        },
        body: JSON.stringify({
          category: t.category,
          name: t.title,
          description: t.details,
          slots: Number(t.capacity),
          image: t.photo,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Error editing tour: " + (err.error?.message || JSON.stringify(err)));
        return;
      }
      setEditingTour(null);
      fetchTours();
    } catch (err) {
      alert("Failed to edit tour: " + err.message);
    }
  }

  async function handleDeleteTour(id) {
    if (!window.confirm("Delete this tour?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/tours/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": "admin123" }, // demo-only
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Error deleting tour: " + (err.error?.message || JSON.stringify(err)));
        return;
      }
      fetchTours();
    } catch (err) {
      alert("Failed to delete tour: " + err.message);
    }
  }

  if (loading) {
    return (
      <main className="admin-dashboard min-h-[calc(100dvh-64px)] flex items-center justify-center bg-neutral-50 px-4 py-12">
        <div className="rounded-xl bg-white border px-6 py-4 shadow">Loading…</div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard min-h-[calc(100dvh-64px)] flex flex-col items-center bg-neutral-50 px-4 py-12">
      <h1 className="text-3xl font-extrabold font-merri text-customTeal mb-4">Admin Dashboard</h1>

      {editingTour ? (
        <form className="max-w-md w-full bg-white rounded-xl shadow p-6 mb-8" onSubmit={handleSaveEdit}>
          <h2 className="text-xl font-bold mb-2">Edit Tour</h2>
          <input
            type="text"
            name="title"
            placeholder="Tour Title"
            className="mb-3 w-full px-3 py-2 border rounded"
            value={editingTour.title}
            onChange={(e) => setEditingTour((t) => ({ ...t, title: e.target.value }))}
          />
          <textarea
            name="details"
            placeholder="Tour Details"
            className="mb-3 w-full px-3 py-2 border rounded"
            value={editingTour.details}
            onChange={(e) => setEditingTour((t) => ({ ...t, details: e.target.value }))}
          />
          <select
            name="category"
            className="mb-3 w-full px-3 py-2 border rounded"
            value={editingTour.category}
            onChange={(e) => setEditingTour((t) => ({ ...t, category: e.target.value }))}
          >
            <option value="cycling">Cycling</option>
            <option value="hiking">Hiking</option>
            <option value="nature tours">Nature Tours</option>
          </select>
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            className="mb-3 w-full px-3 py-2 border rounded"
            value={editingTour.capacity}
            onChange={(e) => setEditingTour((t) => ({ ...t, capacity: e.target.value }))}
            min="1"
          />
          <input
            type="file"
            accept="image/*"
            className="mb-3 w-full"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => setEditingTour((t) => ({ ...t, photo: ev.target.result }));
                reader.readAsDataURL(file);
              }
            }}
          />
          {editingTour.photo && (
            <img
              src={editingTour.photo}
              alt="Tour"
              className="mb-3 w-full rounded"
              style={{ maxHeight: 200 }}
            />
          )}
          <div className="flex gap-2">
            <button type="submit" className="w-full py-2 bg-customTeal text-white rounded font-semibold">
              Save
            </button>
            <button
              type="button"
              className="w-full py-2 bg-slate-400 text-white rounded font-semibold"
              onClick={() => setEditingTour(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <form className="max-w-md w-full bg-white rounded-xl shadow p-6 mb-8" onSubmit={handlePostTour}>
          <h2 className="text-xl font-bold mb-3">Post a New Tour</h2>
          <input
            type="text"
            name="title"
            placeholder="Tour Title"
            className="mb-3 w-full px-3 py-2 border rounded"
            value={tour.title}
            onChange={handleTourChange}
          />
          <textarea
            name="details"
            placeholder="Tour Details"
            className="mb-3 w-full px-3 py-2 border rounded"
            value={tour.details}
            onChange={handleTourChange}
          />
          <select
            name="category"
            className="mb-3 w-full px-3 py-2 border rounded"
            value={tour.category}
            onChange={handleTourChange}
          >
            <option value="cycling">Cycling</option>
            <option value="hiking">Hiking</option>
            <option value="nature tours">Nature Tours</option>
          </select>
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            className="mb-3 w-full px-3 py-2 border rounded"
            value={tour.capacity}
            onChange={handleTourChange}
            min="1"
          />
          <input type="file" accept="image/*" className="mb-3 w-full" onChange={handleTourPhoto} />
          {tour.photo && (
            <img src={tour.photo} alt="Tour" className="mb-3 w-full rounded" style={{ maxHeight: 200 }} />
          )}
          <button type="submit" className="w-full py-2 bg-customTeal text-white rounded font-semibold">
            Post Tour
          </button>
        </form>
      )}

      <div className="max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">Posted Tours</h2>
        {postedTours.length === 0 ? (
          <p className="text-slate-500">No tours posted yet.</p>
        ) : (
          postedTours.map((t, i) => (
            <div key={t.id || i} className="mb-4 p-4 bg-white rounded shadow">
              <h3 className="font-bold text-customTeal mb-1">{t.name || t.title}</h3>
              {t.image || t.photo ? (
                <img
                  src={t.image || t.photo}
                  alt="Tour"
                  className="mb-2 w-full rounded"
                  style={{ maxHeight: 120 }}
                />
              ) : null}
              <p className="mb-1">
                <strong>Category:</strong> {t.category}
              </p>
              <p className="mb-1">
                <strong>Capacity:</strong> {t.slots || t.capacity}
              </p>
              <p>{t.description || t.details}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                  onClick={() => handleEditTour(t)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-rose-600 text-white rounded"
                  onClick={() => handleDeleteTour(t.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}


