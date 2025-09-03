import api from "@/lib/api";
import { ClientCreateInput } from "@/lib/types";

// If your backend returns a Client with id, define it here
export interface Client extends ClientCreateInput {
  id: string;
}

console.log("Client API functions loaded", api);
// Fetch all clients
export async function getClients(): Promise<Client[]> {
  const res = await api.get<Client[]>("/api/clients");
  return res.data;
}

// Fetch a single client by id
export async function getClientById(id: string): Promise<Client> {
  const res = await api.get<Client>(`/api/clients/${id}`);
  return res.data;
}

// Create new client
export async function createClient(payload: ClientCreateInput): Promise<Client> {
  const res = await api.post<Client>("/api/clients", payload);
  return res.data;
}
