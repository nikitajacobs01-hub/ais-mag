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

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-gray-200 rounded-lg" />
          <div className="h-28 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow">
          <div className="text-lg font-semibold mb-1">Something went wrong</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600 shadow">
          Client not found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header / Title */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              {client.firstName} {client.lastName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Client ID:&nbsp;
              <span className="font-mono text-gray-700">{client._id}</span>
            </p>
          </div>
          <span
            className={[
              "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm",
              client.status === "Active"
                ? "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200"
                : "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200",
            ].join(" ")}
          >
            {client.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-2">
          <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-gray-200">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <p><span className="text-gray-500">Email:</span> <span className="font-medium">{client.email}</span></p>
              <p><span className="text-gray-500">ID Number:</span> <span className="font-medium">{client.idNumber}</span></p>
              <p><span className="text-gray-500">DOB:</span> <span className="font-medium">{client.dob}</span></p>
              <p className="sm:col-span-2">
                <span className="text-gray-500">Address:</span>{" "}
                <span className="font-medium">{client.street}, {client.suburb}, {client.city}</span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-gray-200">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <p><span className="text-gray-500">Insurance Type:</span> <span className="font-medium">{client.insuranceType}</span></p>
              <p><span className="text-gray-500">Tow Needed:</span> <span className="font-medium">{client.towNeeded}</span></p>
              <p><span className="text-gray-500">Created:</span> <span className="font-medium">{new Date(client.createdAt).toLocaleString()}</span></p>
              <p><span className="text-gray-500">Updated:</span> <span className="font-medium">{new Date(client.updatedAt).toLocaleString()}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Vehicles</h2>
          <span className="text-sm text-gray-500">{client.vehicles.length} total</span>
        </div>

        {client.vehicles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No vehicles added.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {client.vehicles.map((v, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="font-semibold text-gray-900">
                    {v.make} <span className="text-gray-500">/</span> {v.modelName}
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-700">
                    {v.colour || "—"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                  <p><span className="text-gray-500">Registration:</span> <span className="font-medium">{v.registration || "—"}</span></p>
                  <p className="truncate"><span className="text-gray-500">VIN:</span> <span className="font-medium">{v.vin || "—"}</span></p>
                  <p><span className="text-gray-500">Engine No:</span> <span className="font-medium">{v.engineNo || "—"}</span></p>
                  <p><span className="text-gray-500">Odometer:</span> <span className="font-medium">{v.odometer || "—"}</span></p>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white p-2 ring-1 ring-gray-200">
                      <p className="text-[11px] text-gray-500">Booking Date</p>
                      <p className="text-sm font-medium text-gray-800">{v.bookingDate || "—"}</p>
                    </div>
                    <div className="rounded-lg bg-white p-2 ring-1 ring-gray-200">
                      <p className="text-[11px] text-gray-500">Quote Date</p>
                      <p className="text-sm font-medium text-gray-800">{v.quoteDate || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Insurance */}
      {client.insurance && (
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl md:text-2xl font-bold text-gray-900">Insurance</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(client.insurance).map(([key, value]) =>
              key !== "_id" &&
              key !== "clientId" &&
              key !== "__v" &&
              key !== "createdAt" &&
              key !== "updatedAt" ? (
                <div
                  key={key}
                  className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 ring-1 ring-gray-200"
                >
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {String(value) || "—"}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* Tow */}
      {client.tow && (
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl md:text-2xl font-bold text-gray-900">Tow Details</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(client.tow).map(([key, value]) =>
              key !== "_id" &&
              key !== "clientId" &&
              key !== "__v" &&
              key !== "createdAt" &&
              key !== "updatedAt" ? (
                <div
                  key={key}
                  className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 ring-1 ring-gray-200"
                >
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {String(value) || "—"}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </section>
      )}
    </div>
  );
}
