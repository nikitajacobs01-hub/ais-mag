"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../../lib/api";

interface Vehicle {
  registration: string;
  vin: string;
  engineNo: string;
  make: string;
  modelName: string;
  odometer: string;
  colour: string;
  bookingDate: string;
  quoteDate: string;
}

interface Insurance {
  type: string;
  insurerName: string;
  insuranceNo: string;
  insuranceEmail: string;
  claimNumber: string;
  clerkRef: string;
  assessor: string;
  assessorEmail: string;
  assessorNo: string;
  assessorCompany: string;
  warrantyStatus: string;
  conditionStatus: string;
}

interface Tow {
  towedBy: string;
  towContact: string;
  towEmail: string;
  towingFee: string;
}

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  dob: string;
  email: string;
  street: string;
  suburb: string;
  city: string;
  status: "Active" | "Inactive";
  vehicles: Vehicle[];
  insuranceType: string;
  insurance?: Insurance;
  towNeeded: string;
  tow?: Tow;
  createdAt: string;
  updatedAt: string;
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!clientId) return;

    const fetchClient = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/clients/${clientId}`);
        setClient(res.data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  if (loading) return <p className="p-6 text-center">Loading client details...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!client) return <p className="p-6 text-center text-gray-500">Client not found.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* Client Info */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">{client.firstName} {client.lastName}</h1>
          <span
            className={`px-4 py-1 rounded-full font-semibold text-sm ${
              client.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {client.status}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-gray-700">
          <p><span className="font-semibold">Email:</span> {client.email}</p>
          <p><span className="font-semibold">ID Number:</span> {client.idNumber}</p>
          <p><span className="font-semibold">DOB:</span> {client.dob}</p>
          <p><span className="font-semibold">Address:</span> {client.street}, {client.suburb}, {client.city}</p>
          <p><span className="font-semibold">Insurance Type:</span> {client.insuranceType}</p>
          <p><span className="font-semibold">Tow Needed:</span> {client.towNeeded}</p>
          <p><span className="font-semibold">Created At:</span> {new Date(client.createdAt).toLocaleString()}</p>
          <p><span className="font-semibold">Updated At:</span> {new Date(client.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Vehicles */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Vehicles</h2>
        {client.vehicles.length === 0 ? (
          <p className="text-gray-500">No vehicles added.</p>
        ) : (
          <div className="space-y-4">
            {client.vehicles.map((v, idx) => (
              <div key={idx} className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                  <p><span className="font-semibold">Registration:</span> {v.registration}</p>
                  <p><span className="font-semibold">VIN:</span> {v.vin}</p>
                  <p><span className="font-semibold">Engine No:</span> {v.engineNo}</p>
                  <p><span className="font-semibold">Make / Model:</span> {v.make} / {v.modelName}</p>
                  <p><span className="font-semibold">Odometer:</span> {v.odometer}</p>
                  <p><span className="font-semibold">Colour:</span> {v.colour}</p>
                  <p><span className="font-semibold">Booking Date:</span> {v.bookingDate}</p>
                  <p><span className="font-semibold">Quote Date:</span> {v.quoteDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insurance */}
      {client.insurance && (
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Insurance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            {Object.entries(client.insurance).map(([key, value]) => (
              key !== "_id" && key !== "clientId" && key !== "__v" && key !== "createdAt" && key !== "updatedAt" ? (
                <p key={key}><span className="font-semibold">{key.replace(/([A-Z])/g, " $1")}: </span>{value}</p>
              ) : null
            ))}
          </div>
        </div>
      )}

      {/* Tow */}
      {client.tow && (
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Tow Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            {Object.entries(client.tow).map(([key, value]) => (
              key !== "_id" && key !== "clientId" && key !== "__v" && key !== "createdAt" && key !== "updatedAt" ? (
                <p key={key}><span className="font-semibold">{key.replace(/([A-Z])/g, " $1")}: </span>{value}</p>
              ) : null
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
