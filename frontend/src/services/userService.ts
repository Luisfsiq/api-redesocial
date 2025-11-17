import api from "./api";
import { User } from "../types/User";

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get("/users");
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get("/users/profile");
    return response.data;
  },
};
