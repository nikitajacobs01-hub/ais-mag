"use client";

import { useState } from "react";

export default function AccidentLinkPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "+27", // auto-prefill with +27
  });
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Always enforce +27 prefix
    if (!value.startsWith("+27")) {
      value = "+27" + value.replace(/^\+?0*/, ""); // strip leading + or 0’s
    }

    // If user typed +270, remove the 0
    if (value.startsWith("+270")) {
      value = "+27" + value.slice(4);
    }

    // Remove all non-digits except +
    value = "+27" + value.slice(3).replace(/\D/g, "");

    setFormData({ ...formData, phone: value });
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate SA number length (should be +27 + 9 digits)
      const saNumberRegex = /^\+27\d{9}$/;
      if (!saNumberRegex.test(formData.phone)) {
        alert(
          "Please enter a valid South African cellphone number (e.g., +27821234567)."
        );
        setLoading(false);
        return;
      }

      const res = await fetch(
        "https://ais-backend.onrender.com/api/accident-link",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            onChange={handlePhoneChange}
            required
            className="w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: +27821234567 (South Africa)
          </p>
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
