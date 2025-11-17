import api from "./api";
import { User } from "../types/User";

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get("/users/profile");
    return response.data;
  },

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
};
