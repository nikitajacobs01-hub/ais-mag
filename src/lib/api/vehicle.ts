import api from "@/lib/api";
import { VehicleInput } from "@/lib/types";

export interface Vehicle extends VehicleInput {
  id: string;
  clientId: string;
}

// Fetch all vehicles
export async function getVehicles(): Promise<Vehicle[]> {
  const res = await api.get<Vehicle[]>("/vehicles");
  return res.data;
}

// Create new vehicle
export async function createVehicle(payload: VehicleInput & { clientId: string }): Promise<Vehicle> {
  const res = await api.post<Vehicle>("/vehicles", payload);
  return res.data;
}
