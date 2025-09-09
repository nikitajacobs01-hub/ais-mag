"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Accident {
  _id: string;
  clientName: string;
  clientPhone: string;
  vehicleMake: string;
  vehicleModel: string;
  accidentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  insuranceCompany?: string;
  description?: string;
  status: "pending" | "assigned" | "completed";
  towCompanyAssigned?: string;
  createdAt: string;
}

export default function ViewAccidentsPage() {
  const router = useRouter();
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "assigned" | "completed"
  >("all");

  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const res = await fetch("https://ais-backend.onrender.com/api/accidents");
        const data = await res.json();

        if (res.ok) {
          setAccidents(data.accidents || []);
        } else {
          console.error("Error fetching accidents:", data.message);
          setAccidents([]);
        }
      } catch (err) {
        console.error("Error fetching accidents:", err);
        setAccidents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccidents();
  }, []);

  const filteredAccidents = Array.isArray(accidents)
    ? accidents.filter((a) => {
        const matchesSearch =
          a.clientName.toLowerCase().includes(search.toLowerCase()) ||
          a.clientPhone.toLowerCase().includes(search.toLowerCase()) ||
          a.vehicleMake.toLowerCase().includes(search.toLowerCase()) ||
          a.vehicleModel.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || a.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  if (loading) return <p>Loading accidents...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Accidents Dashboard</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by client, phone, vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded shadow-sm w-full md:w-1/2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as "all" | "pending" | "assigned" | "completed"
            )
          }
          className="border border-gray-300 p-2 rounded shadow-sm w-full md:w-1/4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Client
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Phone
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Vehicle
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Location
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Insurance
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Description
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Tow Company
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Created
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAccidents.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-500">
                  No accidents found.
                </td>
              </tr>
            ) : (
              filteredAccidents.map((acc) => (
                <tr key={acc._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{acc.clientName}</td>
                  <td className="px-4 py-2">{acc.clientPhone}</td>
                  <td className="px-4 py-2">
                    {acc.vehicleMake} {acc.vehicleModel}
                  </td>
                  <td className="px-4 py-2">{acc.accidentLocation.address}</td>
                  <td className="px-4 py-2">{acc.insuranceCompany || "-"}</td>
                  <td className="px-4 py-2">{acc.description || "-"}</td>
                  <td className="px-4 py-2">{acc.towCompanyAssigned || "-"}</td>
                  <td className="px-4 py-2 capitalize">{acc.status}</td>
                  <td className="px-4 py-2">
                    {new Date(acc.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/accident/${acc._id}`)
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
