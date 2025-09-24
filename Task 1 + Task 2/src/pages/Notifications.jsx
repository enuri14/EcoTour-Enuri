// src/pages/Notifications.jsx
import React from "react";

export default function Notifications() {
  return (
    <main className="min-h-[calc(100dvh-64px)] flex flex-col items-center justify-center bg-neutral-50 px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold font-merri text-customTeal mb-4 text-center" style={{ fontFamily: 'Merriweather, serif' }}>
        Notifications
      </h1>
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6 text-center">
        <p className="text-lg text-slate-700 mb-2">Notifications for tour updates.</p>
        <p className="text-sm text-slate-500">You will see important updates about your booked tours and new adventures here.</p>
      </div>
    </main>
  );
}
