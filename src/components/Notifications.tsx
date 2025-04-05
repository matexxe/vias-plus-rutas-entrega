// Importaciones necesarias
import { useState } from "react";
import { Bell, Check, X, Truck, MapPin } from "lucide-react";
import { Button } from "../UI/Button"; // Componente reutilizable para botones.
import { Badge } from "../UI/Badge"; // Componente reutilizable para etiquetas.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../UI/Tabs"; // Componente reutilizable para pestanas de navegacion.
import { cn } from "../lib/Utils"; // Esta es una funcion para combinar clases con Tailwind.
import { notificationsData } from "../data/NotificationsData"; // Datos simulados de notificaciones.
import { Notification } from "../interfaces/Interfaces"; // Interfaces para las notificaciones porque se usa TypeScript.

// Función para formatear la fecha de una notificación de forma legible
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const timeString = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 0) return `Hoy, ${timeString}`;
  if (diffDays === 1) return `Ayer, ${timeString}`;
  if (diffDays < 7)
    return `${date.toLocaleDateString("es-ES", {
      weekday: "long",
    })}, ${timeString}`;

  return `${date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}, ${timeString}`;
};

// Devuelve el icono correspondiente al tipo de notificación
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "entrega":
      return <Truck className="h-5 w-5 text-green-500" />;
    case "cancelacion":
      return <X className="h-5 w-5 text-red-500" />;
    case "ruta":
      return <MapPin className="h-5 w-5 text-blue-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

export function Notifications() {
  // Estado para almacenar todas las notificaciones
  const [notifications, setNotifications] =
    useState<Notification[]>(notificationsData);

  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState("all");

  // Estado para manejar la confirmación de eliminación
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    id: number | null;
  }>({
    show: false,
    id: null,
  });

  // Filtrar notificaciones según la pestaña seleccionada
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  // Marcar una notificación como leída por ID
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Mostrar diálogo de confirmación de eliminación
  const confirmDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se dispare `onClick` del contenedor
    setDeleteConfirmation({ show: true, id });
  };

  // Eliminar una notificación después de confirmar
  const deleteNotification = () => {
    if (deleteConfirmation.id !== null) {
      setNotifications(
        notifications.filter(
          (notification) => notification.id !== deleteConfirmation.id
        )
      );
      setDeleteConfirmation({ show: false, id: null });
    }
  };

  // Cancelar la acción de eliminación
  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, id: null });
  };

  // Contar cuántas notificaciones no han sido leídas
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div>
      {/* Título y contador de no leídas */}
      <div className="flex justify-between items-center px-6 pt-6 pb-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Notificaciones
        </h1>
        {unreadCount > 0 && (
          <div className="flex items-center">
            <Badge
              variant="secondary"
              className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs font-medium whitespace-nowrap"
            >
              {unreadCount} sin leer
            </Badge>
          </div>
        )}
      </div>

      {/* Contenedor principal con tabs y contenido */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden [&_button]:cursor-pointer">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex justify-between items-center mb-4">
              {/* Lista de pestañas */}
              <TabsList
                className={cn("[&>*]:transition-all [&>*]:duration-200")}
              >
                {[
                  { value: "all", label: "Todas" },
                  { value: "unread", label: "No leídas" },
                  { value: "entrega", label: "Entregas" },
                  { value: "cancelacion", label: "Cancelaciones" },
                  { value: "ruta", label: "Rutas" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "text-gray-700",
                      "hover:bg-gray-100/70",
                      "hover:text-gray-900",
                      "dark:text-white",
                      "dark:hover:bg-gray-700/50",
                      "dark:hover:text-white",
                      "dark:data-[state=active]:text-white",
                      "dark:data-[state=active]:bg-gray-700"
                    )}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Botón para marcar todo como leído */}
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className={cn(
                    "dark:text-white",
                    "dark:hover:bg-gray-700/50",
                    "dark:hover:text-white"
                  )}
                >
                  Marcar todas como leídas
                </Button>
              )}
            </div>

            {/* Contenido de las notificaciones según la pestaña */}
            <TabsContent value={activeTab} className="mt-0">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={cn(
                        "p-4",
                        "cursor-pointer",
                        "transition-all duration-200",
                        "hover:bg-gray-50 dark:hover:bg-gray-700/70",
                        !notification.read && "bg-gray-50 dark:bg-gray-700/50"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icono del tipo de notificación */}
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Encabezado: título y hora */}
                          <div className="flex justify-between">
                            <h3
                              className={cn(
                                "text-base font-medium",
                                !notification.read
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-100"
                              )}
                            >
                              {notification.title}
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-300">
                              {formatDate(notification.date)}
                            </span>
                          </div>
                          {/* Mensaje de la notificación */}
                          <p className="mt-1 text-sm text-gray-700 dark:text-white">
                            {notification.message}
                          </p>
                        </div>
                        {/* Acciones: Marcar como leído / Eliminar */}
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className={cn(
                                "h-8 w-8 dark:text-white dark:hover:text-white dark:hover:bg-gray-700/70"
                              )}
                              aria-label="Marcar como leída"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => confirmDelete(notification.id, e)}
                            className={cn(
                              "h-8 w-8 dark:text-white dark:hover:text-white dark:hover:bg-gray-700/70"
                            )}
                            aria-label="Eliminar notificación"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-white">
                  No hay notificaciones
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar una notificación */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              ¿Está seguro que desea eliminar la notificación?
            </h3>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="border-gray-300 dark:border-gray-600 dark:text-white"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={deleteNotification}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
