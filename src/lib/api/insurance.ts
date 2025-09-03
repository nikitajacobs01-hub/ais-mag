import api from "@/lib/api";
import { InsuranceInput } from "@/lib/types";

export interface Insurance extends InsuranceInput {
  id: string;
  clientId: string;
}

// Fetch all insurances
export async function getInsurances(): Promise<Insurance[]> {
  const res = await api.get<Insurance[]>("/insurance");
  return res.data;
}

// Create new insurance
export async function createInsurance(payload: InsuranceInput & { clientId: string }): Promise<Insurance> {
  const res = await api.post<Insurance>("/insurance", payload);
  return res.data;
}
