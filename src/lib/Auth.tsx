import { create } from "zustand";
import { persist } from "zustand/middleware";

// Definición de la interfaz para el usuario (tienda) autenticado
interface User {
  id: string;
  email: string;
  businessName: string;
  businessType: "store" | "restaurant" | "pharmacy";
}

// Estado y acciones relacionadas con la autenticación
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    userData: Omit<User, "id"> & { password: string }
  ) => Promise<void>;
  logout: () => void;
}

// Base de datos simulada en memoria para usuarios de prueba
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

// Hook personalizado de Zustand para manejar la autenticación
export const useAuth = create<AuthState>()(
  // Persistencia del estado en localStorage (clave: "auth-storage")
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      /**
       * Inicia sesión con un email y contraseña.
       * Busca en la lista de usuarios simulada (mockUsers).
       * Lanza un error si las credenciales no coinciden.
       */
      login: async (email: string, password: string) => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) {
          throw new Error("Credenciales inválidas");
        }

        // Se excluye la contraseña del objeto almacenado en el estado
        const { password: _, ...userData } = user;
        set({ user: userData, isAuthenticated: true });
      },

      /**
       * Registra un nuevo usuario.
       * Verifica que no exista ya uno con el mismo correo.
       * Almacena el nuevo usuario en la lista simulada y actualiza el estado.
       */
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

      /**
       * Cierra la sesión, eliminando el usuario del estado.
       */
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // Nombre de la clave para localStorage
    }
  )
);
