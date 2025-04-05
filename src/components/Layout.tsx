"use client";

// Importamos React y herramientas de navegación desde React Router
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Función utilitaria para unir clases condicionalmente
import { cn } from "../lib/Utils";

// Íconos que vamos a usar en la interfaz
import {
  LayoutDashboard,
  Package,
  Users,
  Map,
  FileBarChart,
  Menu,
  Sun,
  Moon,
  X,
  Truck,
  LogOut,
  Settings,
  Navigation,
  Bell,
  Check,
  ChevronRight,
} from "lucide-react";

// Hooks personalizados: para el tema (oscuro/claro) y autenticación
import { useTheme } from "./ThemeProvider";
import { useAuth } from "../lib/Auth";

// Interfaz para estructurar cada notificación
interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

// Navegación lateral con rutas e íconos
const navigation = [
  { name: "Panel principal", href: "/", icon: LayoutDashboard },
  { name: "Clientes", href: "/clients", icon: Users },
  { name: "Pedidos", href: "/orders", icon: Package },
  { name: "Seguimiento", href: "/tracking", icon: Navigation },
  { name: "Rutas", href: "/routes", icon: Map },
  { name: "Conductores", href: "/drivers", icon: Truck },
  { name: "Reportes", href: "/reports", icon: FileBarChart },
  { name: "Configuracion", href: "/config", icon: Settings },
];

// Componente principal de layout (estructura general de la app)
export function Layout({ children }: { children: React.ReactNode }) {
  // Estado para controlar si se muestra la barra lateral en móvil
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Estado para mostrar/ocultar el panel de notificaciones
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  // Hook para obtener la ruta actual
  const location = useLocation();

  // Tema actual y función para cambiarlo
  const { theme, setTheme } = useTheme();

  // Datos del usuario y función para cerrar sesión
  const { user, logout } = useAuth();

  // Navegador para redirigir al cerrar sesión
  const navigate = useNavigate();

  // Notificaciones (por ahora, vacías)
  const [notifications] = React.useState<Notification[]>([]);

  // Al cerrar sesión, cerramos sesión del backend y redirigimos a login
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Efecto para cerrar el panel de notificaciones cuando haces clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notifications-container")) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Estructura visual del layout principal
  return (
    <div className="min-h-screen bg-gray-300 dark:bg-gray-900 flex flex-col">
      {/* Sidebar móvil (solo se muestra si sidebarOpen es true) */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div className="fixed inset-0 bg-gray-900/80" />
        <div className="fixed inset-0 flex">
          <div className="relative flex w-72 max-w-xs flex-1">
            {/* Contenido del sidebar */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-200 dark:bg-gray-800 px-6 pb-4">
              {/* Encabezado del sidebar con botón de cierre */}
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <Truck className="h-8 w-8 text-blue-600" />
                  <span className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                    ViasPlus
                  </span>
                </div>
                {/* Botón para cerrar el sidebar (ahora dentro del panel) */}
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Cerrar menú</span>
                </button>
              </div>
              {/* Navegación */}
              <nav className="flex flex-1 flex-col">
                <ul className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul className="-mx-2 space-y-1">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        const currentPath = location.pathname;
                        return (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              className={cn(
                                item.href === currentPath
                                  ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-200"
                                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative"
                              )}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <Icon className="h-6 w-6 shrink-0" />
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar en pantallas grandes (siempre visible) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white shadow-sm dark:bg-gray-800 px-6 pb-4">
          <SidebarContent currentPath={location.pathname} />
        </div>
      </div>

      {/* Contenido principal del layout */}
      <div className="flex flex-col flex-1 lg:pl-72">
        {/* Barra superior */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-end border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-md">
          {/* Botón para abrir el sidebar en móviles */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-200 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Panel derecho con nombre del usuario, notificaciones, tema y logout */}
          <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
            {user && (
              <span className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200">
                {user.businessName}
              </span>
            )}

            {/* Botón y panel de notificaciones */}
            <div className="relative notifications-container flex items-center">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="flex items-center gap-x-1 text-sm font-semibold text-gray-900 dark:text-white relative z-10"
              >
                <Bell className="h-5 w-5" />
              </button>

              {/* Panel desplegable de notificaciones */}
              {notificationsOpen && (
                <div className="absolute right-0 top-[calc(100%+0.25rem)] w-[420px] rounded-lg bg-gray-200 dark:bg-[#1a1f2b] shadow-lg ring-1 ring-gray-300 dark:ring-gray-800/30 z-50 overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-base font-medium text-gray-900 dark:text-gray-200">
                        Notificaciones
                      </h3>
                    </div>

                    {/* Lista de notificaciones */}
                    <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 rounded-lg",
                            "bg-gray-50 hover:bg-gray-100 dark:bg-[#252b3b] dark:hover:bg-[#2a3042]",
                            "transition-colors duration-200",
                            !notification.read && "border-l-2 border-blue-500"
                          )}
                        >
                          <div className="flex items-start gap-x-4">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {formatDate(notification.date)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Si no hay notificaciones */}
                      {notifications.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-gray-600 dark:text-gray-400">
                            No hay notificaciones
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Enlace para ver todas las notificaciones */}
                    <Link
                      to="/notifications"
                      className="mt-5 flex items-center justify-center w-full px-4 py-3 text-sm text-gray-900 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-[#252b3b] dark:hover:bg-[#2a3042] rounded-lg transition-colors duration-200"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      Ver todas las notificaciones
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Botón para cambiar tema claro/oscuro */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-x-1 text-sm font-semibold text-gray-900 dark:text-white"
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Botón para cerrar sesión */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-x-1 text-sm font-semibold text-gray-900 dark:text-white"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Aquí se renderiza el contenido principal que venga como `children` */}
        <main className="py-10 flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Componente para el contenido del sidebar (lista de enlaces de navegación)
function SidebarContent({ currentPath }: { currentPath: string }) {
  return (
    <>
      <div className="flex h-16 items-center">
        <Truck className="h-8 w-8 text-blue-600" />
        <span className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
          ViasPlus
        </span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        item.href === currentPath
                          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-200"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative"
                      )}
                    >
                      <Icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}

// Devuelve un ícono distinto según el tipo de notificación
function getNotificationIcon(type: string) {
  switch (type) {
    case "success":
      return <Check className="h-6 w-6 text-green-500" />;
    case "error":
      return <X className="h-6 w-6 text-red-500" />;
    default:
      return <Bell className="h-6 w-6 text-gray-500" />;
  }
}

// Formatea una fecha a un formato legible en español
function formatDate(date: string) {
  const dateObject = new Date(date);
  return dateObject.toLocaleString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
