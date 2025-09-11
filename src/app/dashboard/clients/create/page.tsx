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

  // Success modal state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successText, setSuccessText] = useState(
    "✅ Client with all details added successfully!"
  );

  // Regex patterns
  const EmailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const IdNumberRegex =
    /^([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{4}[01][8][0-9]$/;
  const PhoneRegex =
    /^(?:\+27|0|(?:\s?\+27)\s?)(?:\d{2}[-.\s]?\d{3}[-.\s]?\d{4})$/;

  const [form, setForm] = useState<ClientCreateInput>({
    firstName: "",
    lastName: "",
    idNumber: "",
    dob: "",
    email: "",
    cellphone: "",
    street: "",
    suburb: "",
    city: "",
    branch: "",
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

  const branches = ["MAG Selby", "MAG The Glen", "MAG Longmeadow", "MAG Pretoria"];

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
          <h1 className="text-4xl font-extrabold text-gray-800">
            Create New Client
          </h1>
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
              style={{
                width: `${((step - 1) / (stepLabels.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

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
                  "cellphone",
                  "street",
                  "suburb",
                  "city",
                  "branch",
                ] as const
              ).map((field) => {
                const labelMap: Record<string, string> = {
                  firstName: "First Name",
                  lastName: "Last Name",
                  idNumber: "ID Number",
                  dob: "Date of Birth",
                  email: "Email Address",
                  cellphone: "Cellphone Number",
                  street: "Street",
                  suburb: "Suburb",
                  city: "City",
                  branch: "Select Branch",
                };

                const placeholderMap: Record<string, string> = {
                  firstName: "Enter First Name",
                  lastName: "Enter Last Name",
                  idNumber: "Enter 13-digit ID Number",
                  dob: "yyyy/mm/dd",
                  email: "Enter Email Address",
                  cellphone: "Enter Cellphone Number",
                  street: "Enter Street",
                  suburb: "Enter Suburb",
                  city: "Enter City",
                  branch: "Choose Branch",
                };

                const isEmail = field === "email";
                const isId = field === "idNumber";
                const isPhone = field === "cellphone";

                const isRequiredField = [
                  "firstName",
                  "lastName",
                  "idNumber",
                  "cellphone",
                ].includes(field);

                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {labelMap[field]}
                    </label>

                    {field === "dob" ? (
                      <input
                        type="date"
                        placeholder={placeholderMap[field]}
                        value={form[field] ?? ""}
                        onChange={(e) =>
                          setForm({ ...form, [field]: e.target.value })
                        }
                        className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          isRequiredField ? "bg-yellow-100" : ""
                        }`}
                      />
                    ) : field === "branch" ? (
                      <select
                        value={form[field] ?? ""}
                        onChange={(e) =>
                          setForm({ ...form, [field]: e.target.value })
                        }
                        className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          isRequiredField ? "bg-yellow-100" : ""
                        }`}
                      >
                        <option value="">{placeholderMap[field]}</option>
                        {branches.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={isEmail ? "email" : "text"}
                        placeholder={placeholderMap[field]}
                        value={form[field] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (isEmail && value && !EmailRegex.test(value)) {
                            console.warn("Invalid email format");
                          }
                          if (isId && value && !IdNumberRegex.test(value)) {
                            console.warn("Invalid ID number");
                          }
                          if (isPhone && value && !PhoneRegex.test(value)) {
                            console.warn("Invalid cellphone number");
                          }
                          setForm({ ...form, [field]: value });
                        }}
                        className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          isRequiredField ? "bg-yellow-100" : ""
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 2: Vehicle */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(
                Object.keys(form.vehicles?.[0] ?? {}) as (keyof VehicleInput)[]
              ).map((key) => {
                const labelMap: Record<string, string> = {
                  registration: "Registration Number",
                  vin: "VIN",
                  engineNo: "Engine Number",
                  make: "Make",
                  modelName: "Model Name",
                  odometer: "Odometer Reading",
                  colour: "Colour",
                  bookingDate: "Booking Date",
                  quoteDate: "Quote Date",
                };

                const requiredFields: (keyof VehicleInput)[] = [
                  "registration",
                  "vin",
                  "make",
                  "modelName",
                ];

                const carMakes = [
                  "Toyota",
                  "Volkswagen",
                  "BMW",
                  "Mercedes-Benz",
                  "Audi",
                  "Ford",
                  "Nissan",
                  "Hyundai",
                  "Kia",
                  "Mazda",
                  "Honda",
                  "Chevrolet",
                  "Suzuki",
                  "Renault",
                  "Land Rover",
                  "Jeep",
                  "Volvo",
                ];

                const isDateField = key === "bookingDate" || key === "quoteDate";
                const isRequiredField = requiredFields.includes(key);

                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {labelMap[key] ?? key}
                    </label>

                    {key === "make" ? (
                      <select
                        value={form.vehicles?.[0]?.[key] ?? ""}
                        onChange={(e) =>
                          updateNested<VehicleInput>(
                            "vehicles",
                            key,
                            e.target.value,
                            0
                          )
                        }
                        required={requiredFields.includes(key)}
                        className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          isRequiredField ? "bg-yellow-100" : ""
                        }`}
                      >
                        <option value="">Select Make</option>
                        {carMakes.map((make) => (
                          <option key={make} value={make}>
                            {make}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={isDateField ? "date" : "text"}
                        placeholder={`Enter ${labelMap[key] ?? key}`}
                        value={form.vehicles?.[0]?.[key] ?? ""}
                        onChange={(e) =>
                          updateNested<VehicleInput>(
                            "vehicles",
                            key,
                            e.target.value,
                            0
                          )
                        }
                        required={requiredFields.includes(key)}
                        className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          isRequiredField ? "bg-yellow-100" : ""
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 3: Insurance */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Insurance Type */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Insurance Type
                </label>
                <select
                  value={form.insuranceType}
                  onChange={(e) =>
                    setForm({ ...form, insuranceType: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm hover:border-gray-400 transition"
                >
                  <option value="private">Private</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>

              {/* Warranty Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Warranty Status
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={form.insurance?.warrantyStatus ?? ""}
                  onChange={(e) =>
                    updateNested<InsuranceInput>(
                      "insurance",
                      "warrantyStatus",
                      e.target.value
                    )
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm hover:border-gray-400 transition"
                >
                  <option value="">Select Warranty Status</option>
                  <option value="In Warranty">In Warranty</option>
                  <option value="Out of Warranty">Out of Warranty</option>
                </select>
              </div>

              {/* Condition Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Condition Status
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={form.insurance?.conditionStatus ?? ""}
                  onChange={(e) =>
                    updateNested<InsuranceInput>(
                      "insurance",
                      "conditionStatus",
                      e.target.value
                    )
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm hover:border-gray-400 transition"
                >
                  <option value="">Select Condition Status</option>
                  <option value="Non-Structural">Non-Structural</option>
                  <option value="Advanced Structural">Advanced Structural</option>
                  <option value="Major Structural">Major Structural</option>
                </select>
              </div>

              {/* Other Insurance Fields */}
              {form.insuranceType === "insurance" &&
                (Object.keys(form.insurance ?? {}) as (keyof InsuranceInput)[])
                  .filter(
                    (key) =>
                      key !== "warrantyStatus" && key !== "conditionStatus"
                  )
                  .map((key) => {
                    const labelMap: Record<string, string> = {
                      type: "Type",
                      insurerName: "Insurer Name",
                      insuranceNo: "Insurance Number",
                      insuranceEmail: "Insurance Email",
                      claimNumber: "Claim Number",
                      clerkRef: "Clerk Reference",
                      assessor: "Assessor",
                      assessorEmail: "Assessor Email",
                      assessorNo: "Assessor Number",
                      assessorCompany: "Assessor Company",
                    };

                    const placeholderMap: Record<string, string> = {
                      type: "Enter Type",
                      insurerName: "Enter Insurer Name",
                      insuranceNo: "Enter Insurance Number",
                      insuranceEmail: "Enter Email Address",
                      claimNumber: "Enter Claim Number",
                      clerkRef: "Enter Clerk Reference",
                      assessor: "Enter Assessor Name",
                      assessorEmail: "Enter Email Address",
                      assessorNo: "Enter Assessor Number",
                      assessorCompany: "Enter Assessor Company",
                    };

                    const isEmailField = key === "insuranceEmail";
                    const EmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

                    return (
                      <div key={key}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          {labelMap[key] ?? key}
                          {isEmailField && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        <input
                          type="text"
                          placeholder={
                            placeholderMap[key] ??
                            `Enter ${labelMap[key] ?? key}`
                          }
                          value={form.insurance?.[key] ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              isEmailField &&
                              value &&
                              !EmailRegex.test(value)
                            ) {
                              console.warn("Invalid email format");
                            }
                            updateNested<InsuranceInput>(
                              "insurance",
                              key,
                              value
                            );
                          }}
                          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm hover:border-gray-400 transition placeholder-gray-400"
                        />
                      </div>
                    );
                  })}
            </div>
          )}

          {/* Step 4: Tow */}
          {step === 4 && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tow Needed
                </label>
                <select
                  value={form.towNeeded}
                  onChange={(e) =>
                    setForm({ ...form, towNeeded: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm hover:border-gray-400 transition"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              {form.towNeeded === "yes" &&
                (Object.keys(form.tow ?? {}) as (keyof TowInput)[]).map(
                  (key) => {
                    const labelMap: Record<string, string> = {
                      towedBy: "Towed By",
                      towContact: "Tow Contact",
                      towEmail: "Tow Email",
                      towingFee: "Towing Fee",
                    };
                    return (
                      <div key={key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {labelMap[key] ?? key}
                        </label>
                        <input
                          type="text"
                          value={form.tow?.[key] ?? ""}
                          onChange={(e) =>
                            updateNested<TowInput>("tow", key, e.target.value)
                          }
                          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm hover:border-gray-400 transition"
                        />
                      </div>
                    );
                  }
                )}
            </>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Previous
              </button>
            )}
            {step < stepLabels.length && (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Next
              </button>
            )}
            {step === stepLabels.length && (
              <button
                type="submit"
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
