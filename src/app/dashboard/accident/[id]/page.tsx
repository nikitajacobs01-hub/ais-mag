"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Accident {
  _id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  vehicleMake: string;
  vehicleModel: string;
  accidentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  description?: string;
  status: "pending" | "assigned" | "completed";
  towCompanyAssigned?: string;
  insuranceCompany?: string;
  carRegistrationImage?: string;
  accidentImages?: string[];
  createdAt: string;
}

interface TowCompany {
  name: string;
  whatsappNumber: string;
}

export default function AccidentDetailPage() {
  const params = useParams();
  const { id } = params;

  const [accident, setAccident] = useState<Accident | null>(null);
  const [loading, setLoading] = useState(true);
  const [towCompany, setTowCompany] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [sendingClientMessage, setSendingClientMessage] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Hardcoded tow companies for now
  const towCompanies: TowCompany[] = [
    { name: "QuickTow Services", whatsappNumber: "+27698053809" },
    { name: "Speedy Tow", whatsappNumber: "+27698053809" },
    { name: "Rapid Tow Co", whatsappNumber: "+27698053809" },
    { name: "Eugene Towing", whatsappNumber: "+27740881414" },
  ];

  useEffect(() => {
    const fetchAccident = async () => {
      try {
        const res = await fetch(
          `https://ais-backend.onrender.com/api/accidents/${id}`
        );
        const data = await res.json();
        if (res.ok) setAccident(data);
        else console.error("Error fetching accident:", data.message);
      } catch (err) {
        console.error("Error fetching accident:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAccident();
  }, [id]);

  const handleAssignTow = async () => {
    if (!towCompany) return alert("Please select a tow company");
    setAssigning(true);

    try {
      // Find selected tow company object from the array
      const selected = towCompanies.find((tc) => tc.name === towCompany);
      if (!selected) return alert("Invalid tow company");

      const res = await fetch(
        `https://ais-backend.onrender.com/api/accidents/${id}/assign-tow`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            towCompany: selected.name,
            towWhatsapp: selected.whatsappNumber,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Tow company assigned successfully!");

        setAccident((prev) =>
          prev
            ? { ...prev, towCompanyAssigned: selected.name, status: "assigned" }
            : prev
        );

        // Open WhatsApp link if provided
        if (data.waLink) {
          window.open(data.waLink, "_blank");
        }
      } else {
        alert(data.message || "Error assigning tow company");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setAssigning(false);
    }
  };

  const handleSendClientMessage = () => {
    if (!accident?.towCompanyAssigned) return;
    setSendingClientMessage(true);
    // Build wa.me URL
    const clientNumber = accident.clientPhone.replace(/\D/g, ""); // sanitize
    const message = `Hello ${accident.clientName}, a tow company (${accident.towCompanyAssigned}) has been assigned to assist with your vehicle at ${accident.accidentLocation.address}.`;
    const waUrl = `https://wa.me/${clientNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(waUrl, "_blank");
    setSendingClientMessage(false);
  };

  // const handleMarkCompleted = async () => {
  //   if (!accident) return;
  //   setCompleting(true);
  //   try {
  //     const res = await fetch(
  //       `https://ais-backend.onrender.com/api/accidents/${id}/mark-completed`,
  //       { method: "PATCH" }
  //     );
  //     if (res.ok) {
  //       alert("Accident marked as completed");
  //       setAccident((prev) => prev && { ...prev, status: "completed" });
  //     } else alert("Error marking accident as completed");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Server error");
  //   } finally {
  //     setCompleting(false);
  //   }
  // };

  if (loading) return <p>Loading accident details...</p>;
  if (!accident) return <p>Accident not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Accident Details</h1>

      {/* Accident Info */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Client Name:</span>{" "}
            {accident.clientName}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {accident.clientPhone}
          </div>
          {accident.clientEmail && (
            <div>
              <span className="font-semibold">Email:</span>{" "}
              {accident.clientEmail}
            </div>
          )}
          <div>
            <span className="font-semibold">Vehicle:</span>{" "}
            {accident.vehicleMake} {accident.vehicleModel}
          </div>
          <div>
            <span className="font-semibold">Location:</span>{" "}
            {accident.accidentLocation.address}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded ${
                accident.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : accident.status === "assigned"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {accident.status}
            </span>
          </div>
          <div>
            <span className="font-semibold">Tow Company:</span>{" "}
            {accident.towCompanyAssigned || "-"}
          </div>
          <div>
            <span className="font-semibold">Insurance:</span>{" "}
            {accident.insuranceCompany || "-"}
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold">Description:</span>{" "}
            {accident.description || "-"}
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(accident.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Accident Images */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Accident Pictures</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {accident.carRegistrationImage ? (
            <img
              src={accident.carRegistrationImage}
              alt="Car Registration"
              className="h-32 w-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
              No Car Registration Image
            </div>
          )}

          {accident.accidentImages && accident.accidentImages.length > 0 ? (
            accident.accidentImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Accident ${idx + 1}`}
                className="h-32 w-full object-cover rounded"
              />
            ))
          ) : (
            <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
              No Accident Images
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Accident Location</h2>
        <iframe
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${accident.accidentLocation.lat},${accident.accidentLocation.lng}&z=15&output=embed`}
        ></iframe>
      </div>

      {/* Tow assignment */}
      {accident.status === "pending" && (
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Assign Tow Company</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <select
              value={towCompany}
              onChange={(e) => setTowCompany(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full md:flex-1"
            >
              <option value="">Select a Tow Company</option>
              {towCompanies.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAssignTow}
              disabled={assigning}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {assigning ? "Assigning..." : "Assign Tow"}
            </button>
          </div>
        </div>
      )}

      {/* Client notification & mark completed */}
      {accident.status === "assigned" && accident.towCompanyAssigned && (
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Notify Client & Complete</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={handleSendClientMessage}
              disabled={sendingClientMessage}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              {sendingClientMessage ? "Sending..." : "Send Message to Client"}
            </button>
            {/* <button
              onClick={handleMarkCompleted}
              disabled={completing}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              {completing ? "Completing..." : "Mark Accident Completed"}
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}
