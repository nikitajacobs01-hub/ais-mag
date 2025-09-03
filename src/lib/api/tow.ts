import api from "@/lib/api";
import { TowInput } from "@/lib/types";

export interface Tow extends TowInput {
  id: string;
  clientId: string;
}

// Fetch all tows
export async function getTows(): Promise<Tow[]> {
  const res = await api.get<Tow[]>("/tow");
  return res.data;
}

// Create new tow
export async function createTow(payload: TowInput & { clientId: string }): Promise<Tow> {
  const res = await api.post<Tow>("/tow", payload);
  return res.data;
}
