import axios from "axios";
import { create } from "zustand";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string; // Qo'shildi
  username: string; // Qo'shildi
  password: string; // Qo'shildi
  phone: string;
}

interface UserState {
  loading: boolean;
  users: User[];
  error: string;
  fetchUsers: () => void;
  addUser: (newUser: Omit<User, "id">) => void;
  updateUser: (id: string, updatedUser: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  loading: false,
  users: [],
  error: "",
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("http://localhost:3000/users");
      set({ loading: false, users: res.data, error: "" });
    } catch (err) {
      set({ loading: false, users: [], error: (err as Error).message });
    }
  },
  addUser: async (newUser) => {
    try {
      const completeUser: User = {
        ...newUser,
        id: Math.random().toString(36).substr(2, 9), // Tasodifiy ID yaratish
      };
      const res = await axios.post("http://localhost:3000/users", completeUser);
      set((state) => ({
        users: [...state.users, res.data],
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
  updateUser: async (id, updatedUser) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/users/${id}`,
        updatedUser
      );
      set((state) => ({
        users: state.users.map((user) => (user.id === id ? res.data : user)),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
  deleteUser: async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
}));
