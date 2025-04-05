import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  businessName: string;
  businessType: "store" | "restaurant" | "pharmacy";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    userData: Omit<User, "id"> & { password: string }
  ) => Promise<void>;
  logout: () => void;
}

// Usuarios de prueba
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "mitienda@gmail.com",
    password: "1234",
    businessName: "Mi Tienda",
    businessType: "store",
  },
  {
    id: "2",
    email: "restaurante@example.com",
    password: "123456",
    businessName: "Mi Restaurante",
    businessType: "restaurant",
  },
];

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) {
          throw new Error("Credenciales inválidas");
        }

        const { password: _, ...userData } = user;
        set({ user: userData, isAuthenticated: true });
      },
      register: async (userData) => {
        const exists = mockUsers.some((u) => u.email === userData.email);

        if (exists) {
          throw new Error("El usuario ya existe");
        }

        const newUser = {
          id: String(mockUsers.length + 1),
          email: userData.email,
          businessName: userData.businessName,
          businessType: userData.businessType,
        };

        mockUsers.push({ ...newUser, password: userData.password });
        set({ user: newUser, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
