"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../../lib/api";

interface Vehicle {
  _id: string;
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
  _id: string;
  insurerName: string;
  insuranceNo: string;
  claimNumber: string;
}

interface Tow {
  _id: string;
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
  status?: "Active" | "Inactive";
  vehicles?: Vehicle[];
  insurance?: Insurance;
  tow?: Tow;
}

export default function ClientsListPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/clients");
        console.log("Res Data:", res.data);
        setClients(res.data);
        setFilteredClients(res.data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredClients(filtered);
  }, [searchTerm, statusFilter, clients]);

  return (
    <div className="p-6 max-w-[100vw] overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#021024]">
          Clients ({filteredClients.length})
        </h1>

        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#021024] flex-1 md:flex-none"
          />
          <select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setStatusFilter(e.target.value as "All" | "Active" | "Inactive")
            }
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#021024]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-[#021024]">Loading clients...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* List Table */}
      {!loading && filteredClients.length === 0 ? (
        <p className="text-center text-gray-500">No clients available.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">ID Number</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">DOB</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Address</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Vehicle</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Insurance</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Tow</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client, index) => (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {client.firstName} {client.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{client.idNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{client.dob}</td>
                  <td className="px-6 py-4 text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {client.street}, {client.suburb}, {client.city}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {client.vehicles && client.vehicles.length > 0 ? (
                      <>
                        {client.vehicles[0].make} {client.vehicles[0].modelName} (
                        {client.vehicles[0].registration})
                      </>
                    ) : (
                      "No vehicle"
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {client.insurance ? (
                      <>
                        {client.insurance.insurerName} (
                        {client.insurance.insuranceNo})
                      </>
                    ) : (
                      "No insurance"
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {client.tow ? (
                      <>
                        {client.tow.towedBy} ({client.tow.towContact})
                      </>
                    ) : (
                      "No tow"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/clients/${client._id}`}
                      className="text-white bg-[#021024] px-3 py-1 rounded-lg hover:bg-[#021024]/90 transition text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
