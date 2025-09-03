import api from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface LoginResponse {
  user?: User;
  message?: string;
  error?: string;
}

export interface RegisterResponse {
  user?: User;
  message?: string;
  error?: string;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post("/api/auth/login", payload);
  return res.data;
};

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const res = await api.post("/api/auth/register", payload);
  return res.data;
};
