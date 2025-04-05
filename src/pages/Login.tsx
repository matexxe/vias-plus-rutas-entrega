
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Truck } from "lucide-react";
import { useAuth } from "../lib/auth";

// Componente de inicio de sesión
export function Login() {
  const navigate = useNavigate(); // Hook de navegación
  const { login } = useAuth(); // Hook de autenticación personalizado
  const [loading, setLoading] = useState(false); // Estado para indicar si está cargando
  const [error, setError] = useState<string | null>(null); // Estado para mensajes de error
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  }); // Estado para el formulario

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que se recargue la página
    setLoading(true);
    setError(null);

    try {
      // Intenta iniciar sesión con los datos proporcionados
      await login(formData.email, formData.password);
      navigate("/"); // Redirige a la página principal si inicia sesión correctamente
    } catch (error) {
      // Muestra el mensaje de error si ocurre un fallo al iniciar sesión
      setError(
        error instanceof Error ? error.message : "Error al iniciar sesión"
      );
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo de video en pantalla completa */}
      <video
        className="absolute w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        src="/src/assets/videos/video-2.mp4" // Ruta del video de fondo
      ></video>

      {/* Capa superpuesta oscura para mejorar la legibilidad del contenido */}
      <div className="absolute inset-0 bg-gray-900/70 z-10"></div>

      {/* Contenedor principal del contenido de login */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        {/* Encabezado con ícono y título */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Truck className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Inicia sesión en ViasPlus
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/registro"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Formulario de inicio de sesión */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Mensaje de error si lo hay */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm text-red-600 dark:text-red-200">
                  {error}
                </div>
              )}

              {/* Campo de correo electrónico */}
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

              {/* Campo de contraseña */}
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
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Botón para enviar el formulario */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </div>
            </form>

            {/* Credenciales de prueba (útiles durante desarrollo o demo) */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                    Credenciales de prueba
                  </span>
                </div>
              </div>
              <div className="mt-6 text-sm">
                <p className="text-gray-500 dark:text-gray-400">
                  Email: mitienda@gmail.com
                  <br />
                  Contraseña: 1234
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
