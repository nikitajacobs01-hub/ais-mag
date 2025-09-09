"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AccidentFormPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [locationError, setLocationError] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("");

  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    vehicleMake: "",
    vehicleModel: "",
    accidentDescription: "",
    insuranceCompany: "",
    accidentLocation: {
      lat: 0,
      lng: 0,
      address: "",
    },
  });

  // New state for images
  const [carRegistrationImage, setCarRegistrationImage] = useState<File | null>(null);
  const [accidentImages, setAccidentImages] = useState<File[]>([]);

  // Validate token on load
  useEffect(() => {
    const validateToken = async () => {
      if (!token) return;
      try {
        const res = await fetch(
          `https://ais-backend.onrender.com/api/accident-link/validate/${token}`
        );
        const data = await res.json();
        if (res.ok) setValidToken(true);
        else alert(data.message || "Invalid or expired link");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, [token]);

  // Fetch GPS location
  const fetchLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationError("⚠️ Geolocation not supported on this device.");
      return;
    }

    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          accidentLocation: {
            ...prev.accidentLocation,
            lat,
            lng,
          },
        }));

        try {
          const geoRes = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const geoData = await geoRes.json();
          if (geoData.status === "OK" && geoData.results.length > 0) {
            const formatted = geoData.results[0].formatted_address;
            setAddress(formatted);
            setFormData((prev) => ({
              ...prev,
              accidentLocation: {
                ...prev.accidentLocation,
                address: formatted,
              },
            }));
          } else {
            setAddress("Address not available");
          }
        } catch (err) {
          console.error("Geocoding error:", err);
          setAddress("Address not available");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        let msg =
          "⚠️ Could not fetch location. Please enable GPS and try again.";
        if (error.code === 1)
          msg = "⚠️ Location permission denied. Enable GPS.";
        else if (error.code === 2)
          msg = "⚠️ Position unavailable. Try going outside for better signal.";
        else if (error.code === 3) msg = "⚠️ Location request timed out. Retry.";

        setLocationError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (validToken) fetchLocation();
  }, [validToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image upload handlers
  const handleCarRegistrationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCarRegistrationImage(e.target.files[0]);
  };

  const handleAccidentImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAccidentImages((prev) => {
        const combined = [...prev, ...newFiles].slice(0, 4); // max 4 images
        return combined;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("token", token || "");
      payload.append("clientName", formData.clientName);
      payload.append("clientPhone", formData.clientPhone);
      payload.append("vehicleMake", formData.vehicleMake);
      payload.append("vehicleModel", formData.vehicleModel);
      payload.append("description", formData.accidentDescription);
      payload.append("insuranceCompany", formData.insuranceCompany);
      payload.append("lat", formData.accidentLocation.lat.toString());
      payload.append("lng", formData.accidentLocation.lng.toString());
      payload.append("address", address || formData.accidentLocation.address);

      if (carRegistrationImage) payload.append("carRegistrationImage", carRegistrationImage);
      accidentImages.forEach((file) => payload.append("accidentImages", file));

      const res = await fetch("https://ais-backend.onrender.com/api/accident-form", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      if (res.ok) alert("✅ Accident report submitted successfully");
      else alert(data.message || "❌ Error submitting accident report");
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting accident report");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!validToken) return <p>Invalid or expired link</p>;

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-xl p-6 mt-10">
      <h1 className="text-xl font-semibold mb-4">Accident Report Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Original Fields */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Vehicle Make</label>
          <input
            type="text"
            name="vehicleMake"
            value={formData.vehicleMake}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Vehicle Model</label>
          <input
            type="text"
            name="vehicleModel"
            value={formData.vehicleModel}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Accident Description</label>
          <textarea
            name="accidentDescription"
            value={formData.accidentDescription}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Insurance Company (optional)</label>
          <input
            type="text"
            name="insuranceCompany"
            value={formData.insuranceCompany}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Location */}
        {locationError ? (
          <div className="text-red-600 text-sm">
            <p>{locationError}</p>
            <button
              type="button"
              onClick={fetchLocation}
              className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Retry Location
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            📍 Location: {formData.accidentLocation.lat}, {formData.accidentLocation.lng}
            <br />
            🏠 Address: {address || "Fetching..."}
          </p>
        )}

        {locationError && (
          <div>
            <label className="block text-sm font-medium">Enter Address Manually</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street, City"
              className="w-full border rounded p-2"
            />
          </div>
        )}

        {/* New Image Fields */}
        <div>
          <label className="block text-sm font-medium">Car Registration Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCarRegistrationUpload}
            className="w-full border rounded p-2"
          />
          {carRegistrationImage && (
            <img
              src={URL.createObjectURL(carRegistrationImage)}
              alt="Registration preview"
              className="mt-2 h-24 rounded object-cover"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Accident Images (max 4)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAccidentImagesUpload}
            className="w-full border rounded p-2"
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            {accidentImages.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`Accident ${idx + 1}`}
                className="h-24 rounded object-cover"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#021024] text-white px-4 py-2 rounded hover:bg-[#032040]"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
