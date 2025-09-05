// types.ts
export interface VehicleInput {
  registration: string;
  vin: string;
  engineNo: string;
  make: string;
  modelName: string;
  odometer: string;
  colour: string;
  bookingDate?: string;
  quoteDate?: string;
}

export interface InsuranceInput {
  type?: string;
  insurerName?: string;
  insuranceNo?: string;
  insuranceEmail?: string;
  claimNumber?: string;
  clerkRef?: string;
  assessor?: string;
  assessorEmail?: string;
  assessorNo?: string;
  assessorCompany?: string;
  warrantyStatus?: string;
  conditionStatus?: string;
}

export interface TowInput {
  towedBy?: string;
  towContact?: string;
  towEmail?: string;
  towingFee?: string;
}

export interface ClientCreateInput {
  firstName: string;
  lastName: string;
  idNumber: string;
  dob: string;
  email: string;
  cellphone: string;
  street: string;
  suburb: string;
  city: string;
  branch: string;
  vehicles: VehicleInput[];
  insuranceType: string;
  insurance: InsuranceInput;
  towNeeded: string;
  tow: TowInput;
}