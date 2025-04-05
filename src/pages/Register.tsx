import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Truck } from "lucide-react";
import { useAuth } from "../lib/Auth";

// Definimos los tipos posibles de negocio
type BusinessType = "store" | "restaurant" | "pharmacy";

export function Register() {
  const navigate = useNavigate(); // Hook para redireccionar
  const { register } = useAuth(); // Hook personalizado para manejar autenticación
  const [loading, setLoading] = useState(false); // Estado para mostrar carga
  const [error, setError] = useState<string | null>(null); // Estado para mostrar errores

  // Estado del formulario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    businessName: "",
    businessType: "store" as BusinessType,
  });

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(formData); // Intentamos registrar el usuario
      navigate("/"); // Redireccionamos al home
    } catch (error) {
      // Mostramos error si ocurre
      setError(error instanceof Error ? error.message : "Error al registrarse");
    } finally {
      setLoading(false); // Terminamos carga
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo de video */}
      <video
        className="absolute w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        src="/src/assets/videos/video-1.mp4"
      ></video>

      {/* Capa oscura para mejorar la legibilidad del contenido */}
      <div className="absolute inset-0 bg-gray-900/70 z-10"></div>

      {/* Contenido del formulario de registro */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Truck className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Registro de negocio
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* Formulario de registro */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm text-red-600 dark:text-red-200">
                  {error}
                </div>
              )}

              {/* Campo: Nombre del negocio */}
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nombre del negocio
                </label>
                <div className="mt-1">
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Campo: Tipo de negocio */}
              <div>
                <label
                  htmlFor="businessType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tipo de negocio
                </label>
                <div className="mt-1">
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessType: e.target.value as BusinessType,
                      })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  >
                    <option value="store">Tienda</option>
                    <option value="restaurant">Restaurante</option>
                    <option value="pharmacy">Farmacia</option>
                    <option value="clothing">Tienda de ropa</option>{" "}
                    {/* Este value está duplicado */}
                  </select>
                </div>
              </div>

              {/* Campo: Correo electrónico */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Campo: Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Botón de registro */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? "Registrando..." : "Registrarse"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
