"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/api";
import {
  ClientCreateInput,
  VehicleInput,
  InsuranceInput,
  TowInput,
} from "../../../../lib/types";
import { AxiosError } from "axios";

export default function CreateClientPage() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);

  // ✅ NEW: success modal state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successText, setSuccessText] = useState("✅ Client with all details added successfully!");

  const [form, setForm] = useState<ClientCreateInput>({
    firstName: "",
    lastName: "",
    idNumber: "",
    dob: "",
    email: "",
    street: "",
    suburb: "",
    city: "",
    vehicles: [
      {
        registration: "",
        vin: "",
        engineNo: "",
        make: "",
        modelName: "",
        odometer: "",
        colour: "",
        bookingDate: "",
        quoteDate: "",
      },
    ],
    insuranceType: "private",
    insurance: {
      type: "private",
      insurerName: "",
      insuranceNo: "",
      insuranceEmail: "",
      claimNumber: "",
      clerkRef: "",
      assessor: "",
      assessorEmail: "",
      assessorNo: "",
      assessorCompany: "",
      warrantyStatus: "",
      conditionStatus: "",
    },
    towNeeded: "no",
    tow: {
      towedBy: "",
      towContact: "",
      towEmail: "",
      towingFee: "",
    },
  });

  const updateNested = <T extends object>(
    section: keyof ClientCreateInput,
    key: keyof T,
    value: string,
    index?: number
  ) => {
    if (index !== undefined && Array.isArray(form[section])) {
      const arrCopy = [...(form[section] as T[])];
      arrCopy[index] = { ...arrCopy[index], [key]: value };
      setForm({ ...form, [section]: arrCopy });
    } else {
      setForm({
        ...form,
        [section]: { ...(form[section] as T), [key]: value },
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/clients", form);
      const successMsg = "✅ Client with all details added successfully!";
      setMessage(successMsg);

      // ✅ NEW: show modal + message
      setSuccessText(successMsg);
      setShowSuccess(true);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setMessage(error.response?.data?.error || "❌ Failed to add client");
      } else {
        setMessage("❌ An unexpected error occurred");
      }
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const stepLabels = ["Client Info", "Vehicle", "Insurance", "Tow"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">Create New Client</h1>

          {/* ✅ NEW: Navigate to Clients List button */}
          <button
            type="button"
            onClick={() => router.push("/dashboard/clients/list")}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-800 transition"
          >
            Clients List
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 text-center font-medium px-4 py-2 rounded-lg shadow ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Progress tracker */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            {stepLabels.map((label, idx) => (
              <div
                key={idx}
                className={`flex-1 text-center ${
                  step === idx + 1
                    ? "text-blue-600"
                    : step > idx + 1
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {idx + 1}. {label}
              </div>
            ))}
          </div>
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-blue-600 transition-all"
              style={{ width: `${((step - 1) / (stepLabels.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl space-y-8"
        >
          {/* Step 1: Client Info */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(
                [
                  "firstName",
                  "lastName",
                  "idNumber",
                  "dob",
                  "email",
                  "street",
                  "suburb",
                  "city",
                ] as const
              ).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "dob" ? "date" : "text"}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Vehicle */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(form.vehicles?.[0] ?? {}) as (keyof VehicleInput)[]).map(
                (key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      value={form.vehicles?.[0]?.[key] ?? ""}
                      onChange={(e) =>
                        updateNested<VehicleInput>("vehicles", key, e.target.value, 0)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                )
              )}
            </div>
          )}

          {/* Step 3: Insurance */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Type
                </label>
                <select
                  value={form.insuranceType}
                  onChange={(e) =>
                    setForm({ ...form, insuranceType: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
                >
                  <option value="private">Private</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>

              {form.insuranceType === "insurance" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(Object.keys(form.insurance ?? {}) as (keyof InsuranceInput)[]).map(
                    (key) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input
                          value={form.insurance?.[key] ?? ""}
                          onChange={(e) =>
                            updateNested<InsuranceInput>(
                              "insurance",
                              key,
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          )}

          {/* Step 4: Tow */}
          {step === 4 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tow Needed
                </label>
                <select
                  value={form.towNeeded}
                  onChange={(e) =>
                    setForm({ ...form, towNeeded: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              {form.towNeeded === "yes" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(Object.keys(form.tow ?? {}) as (keyof TowInput)[]).map(
                    (key) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input
                          value={form.tow?.[key] ?? ""}
                          onChange={(e) =>
                            updateNested<TowInput>("tow", key, e.target.value)
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 flex-wrap gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
              >
                Previous
              </button>
            )}

            {step < 4 && (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
              >
                Next
              </button>
            )}

            {step === 4 && (
              <button
                type="submit"
                className="ml-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-500 transition"
              >
                Save Client
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ✅ NEW: Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Success
              </h2>
              <p className="text-gray-600 mb-6">{successText}</p>
              <button
                onClick={() => router.push("/dashboard/clients/list")}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg shadow hover:bg-green-500 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
