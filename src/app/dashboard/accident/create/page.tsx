"use client";

import { useState } from "react";

export default function AccidentLinkPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://ais-backend.onrender.com/api/accident-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        // Open WhatsApp link
        window.open(data.waLink, "_blank");
      } else {
        alert(data.message || "Error sending link");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-xl p-6 mt-10">
      <h1 className="text-xl font-semibold mb-4">Send Accident Tow Link</h1>
      <form onSubmit={handleSendLink} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Client Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">WhatsApp Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+27831234567"
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#021024] text-white px-4 py-2 rounded hover:bg-[#032040]"
        >
          {loading ? "Sending..." : "Send Link"}
        </button>
      </form>
    </div>
  );
}
