// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CategoryList from "./pages/CategoryList";
import TourDetails from "./pages/TourDetails";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Tour from "./pages/Tour";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  // Set initial theme from localStorage
  React.useEffect(() => {
    let savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      savedTheme = "light";
      localStorage.setItem("theme", "light");
    }
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <Router>
      <div
        style={{
          background: "var(--bg)",
          color: "var(--text)",
          minHeight: "100vh",
          transition: "background 0.3s, color 0.3s"
        }}
      >
        <Navbar />

        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<CategoryList />} />
            <Route path="/tour/:id" element={<TourDetails />} />
            <Route path="/tours" element={<Tour />} /> {/* 👈 Tour list route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
